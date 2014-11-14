/*jslint browser: true, devel: true, node: true, debug: true, todo: true, indent: 2, maxlen: 150 */
/*global require, it, before, after, describe*/
/*global browser, By*/
'use strict';

(function () {

  var os = require('os'),
    fs = require('fs'),
    selenium = require('selenium-webdriver'),
    by = selenium.By,
    until = selenium.until,
    chrome = require('selenium-webdriver/chrome'),
    assert = require('chai').assert,
    config = require('./config'),

    consoleLogCounter = 1,
    driverBuilder,
    registeredUsers = [],
    virtualNumbers = {};

  function fillField(browser, id, content) {
    return browser.findElement(by.id(id)).then(function (fieldElement) {
      fieldElement.clear();
      fieldElement.sendKeys(content);
    });
  }

  function getChromeDriverPath() {

    var osType = os.type();
    if (osType === 'Darwin') {
      return 'mac/chromedriver';
    }
    if (osType === 'Windows_NT') {
      return 'win\\chromedriver.exe';
    }
    if (osType === 'Linux') {
      return 'linux/chromedriver';
    }
    throw new Error("I don't have a chromedriver for OS type " + osType);
  }

  function getChromeDriver() {
    if (!driverBuilder) {
      var driverPath = getChromeDriverPath(),
        serviceBuilder = new chrome.ServiceBuilder(driverPath),
        options,
        caps;
      chrome.setDefaultService(serviceBuilder.build());
      options = new chrome.Options();

      // use fake audio and video so tests will run on machines with no webcam
      options.addArguments([
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream']);
      caps = options.toCapabilities();

      // make sure we can capture browser console logs on failures
      caps.setLoggingPrefs({'browser': 'ALL'});

      driverBuilder = new selenium.Builder().withCapabilities(caps);
    }
    return driverBuilder.build();
  }

  function navigateToSamplePage(browser) {
    browser.get(config.samplePage);
  }

  function isUserRegistered(username) {
    return -1 !== registeredUsers.indexOf(username);
  }

  function collectVirtualTelephoneNumber(opts) {
    var browser = opts.browser;

    browser.wait(until.elementLocated(by.id('profile')), config.waitMilliseconds)
      .then(function (profileButton) {
        browser.wait(until.elementIsVisible(profileButton))
          .then(function () {
            profileButton.click();
          });
      });
    browser.wait(until.elementLocated(by.id('virtual_number')), config.waitMilliseconds)
      .then(function (vtnDisplayElement) {
        vtnDisplayElement.getText()
          .then(function (virtualNumber) {
            virtualNumbers[opts.username] = virtualNumber;
          });
      });
    browser.findElement(by.id('nav_home')).click();
  }

  function goFromSamplePageToLoginPage(browser) {
    browser
      .wait(until.elementLocated(by.id('login')), config.waitMilliseconds)
      .then(function (button) {
        button.click();
      });
  }

  function goFromSamplePageToRegistrationPage(browser) {
    browser
      .wait(until.elementLocated(by.id('register')), config.waitMilliseconds)
      .then(function (button) {
        button.click();
      });
  }

  function submitRegistration(opts) {
    var browser = opts.browser;

    // fill out user registration form
    browser.wait(until.elementLocated(by.id('registerForm')), config.waitMilliseconds);
    fillField(browser, 'user_name', opts.username);
    fillField(browser, 'user_id', opts.username);
    fillField(browser, 'password', config.password);
    fillField(browser, 'confpassword', config.password);

    // select appropriate user type
    if (opts.type === 'NOTN') {
      browser.findElement(by.id('notn_radio_button')).click();
    } else if (opts.type === 'VTN') {
      browser.findElement(by.id('vtn_radio_button')).click();
    } else {
      throw new Error('unexpected user type given: ' + opts.type);
    }
    browser.findElement(by.id('register-btn')).click();
    registeredUsers.push(opts.username);

    // just in case the user is already registered, but for some reason
    // the test doesn't know about it - clear the error and go straight
    // to the login page.
    browser
      .wait(until.elementLocated(by.id('loginForm')), config.waitMilliseconds)
      .then(null, function errorHandler() {
        browser.findElement(by.id('errormessage'))
          .then(function (errorDiv) {
            browser.wait(until.elementTextContains(errorDiv, 'already exists'));
            browser.get(config.samplePage);
            browser
              .wait(until.elementLocated(by.id('login')), config.waitMilliseconds)
              .then(function (loginButton) {
                loginButton.click();
              });
          });
      });
  }

  function submitE911(browser) {
    browser.wait(until.elementLocated(by.name('is_confirmed')), config.waitMilliseconds)
      .then(function (checkbox) {
        checkbox.getAttribute('checked')
          .then(function (checked) {
            if (!checked) {
              checkbox.click();
            }
          });
        browser.findElement(by.id('address')).click();
      });
  }

  function submitLogin(opts) {
    var browser = opts.browser;

    browser.wait(until.elementLocated(by.id('loginForm')), config.waitMilliseconds);
    fillField(browser, 'userid', opts.username);
    fillField(browser, 'password', config.password);
    browser.findElement(by.id('login-submit')).click();

    if (opts.type === 'VTN') {
      submitE911(browser);
    }
  }

  function login(opts) {
    assert(opts.browser, 'webdriver not given');
    assert(opts.type, 'type (NOTN, VTN, etc) not given');
    assert(opts.username, 'username not given');
    assert(opts.type === 'NOTN' || opts.type === 'VTN', 'type must be NOTN or VTN');

    var browser = opts.browser;

    navigateToSamplePage(browser);
    if (isUserRegistered(opts.username)) {
      goFromSamplePageToLoginPage(browser);
    } else {
      goFromSamplePageToRegistrationPage(browser);
      submitRegistration(opts);
    }
    submitLogin(opts);
    if ((opts.type === 'VTN') && !virtualNumbers[opts.username]) {
      collectVirtualTelephoneNumber(opts);
    }
    // wait for main (logged-in) sample page to appear
    return browser.wait(until.elementLocated(by.id('btn-make-call')), 120000);
  }

  function call(opts) {
    assert(opts.browser, 'webdriver not given');
    assert(opts.type, 'callee type not specified');
    assert(opts.callee, 'callee not given');

    var browser = opts.browser,
      callee = opts.callee;

    // make sure we don't try to look at the virtualNumbers map until after
    // we've actually gone and obtained that info from the browsers.
    browser.call(function () {
      if (opts.type === 'VTN') {
        assert(virtualNumbers[callee], 'No virtual number associated with user: ' + callee);
      }
    });

    // click the call button
    browser.wait(until.elementLocated(by.id('btn-make-call')), config.waitMilliseconds)
      .then(function (button) {
        // sometimes the call button is technically on the page, but selenium
        // won't click it because it is underneath the header bar. scroll the page
        // up just in case.
        button.sendKeys(selenium.Key.PAGE_UP);
        button.click();
      });

    // tell it who to call and click the dial button
    browser.wait(until.elementLocated(by.id('callee')), config.waitMilliseconds)
      .then(function () {
        var calleeAddress;
        if (opts.type === 'VTN') {
          calleeAddress = virtualNumbers[callee];
        } else if (opts.type === 'NOTN') {
          calleeAddress = callee + '@sdkdemo.com';
        } else {
          throw new Error('unknown user type: ' + opts.type);
        }
        fillField(browser, 'callee', calleeAddress);
      });
    return browser.findElement(by.id('btn-dial')).click();
  }

  function answer(opts) {
    assert(opts.browser, 'webdriver not given');
    assert(opts.caller, 'caller not given');

    var browser = opts.browser;

    // click the answer button when it appears
    browser.wait(until.elementLocated(by.id('answer-button')), config.waitMilliseconds);
    browser.findElement(by.id('answer-button'))
      .then(function (answerButton) {
        // sometimes the answer button is technically on the page, but selenium
        // won't click it because it is underneath the header bar. scroll the page
        // up just in case.
        answerButton.sendKeys(selenium.Key.PAGE_UP);
        answerButton.click();
      });

    // wait until the connection completes, as indicated by the on-screen notification
    return browser.findElement(by.id('message')).then(function (messageElement) {
      browser.wait(until.elementTextContains(messageElement, 'Connected to call'), config.waitMilliseconds);
    });
  }

  function hangup(opts) {
    assert(opts.browser, 'webdriver not given');

    var browser = opts.browser;

    browser.wait(until.elementLocated(by.id('btn-hangup')), config.waitMilliseconds);
    browser.findElement(by.id('btn-hangup')).click();

    // wait until the call disconnects, as indicated by the on-screen notification
    return browser.findElement(by.id('message')).then(function (messageElement) {
      browser.wait(until.elementTextContains(messageElement, 'disconnected'), config.waitMilliseconds);
    });
  }

  function logout(opts) {
    assert(opts.browser, 'webdriver not given');

    var browser = opts.browser;

    browser.wait(until.elementLocated(by.id('nav_logout')), config.waitMilliseconds);
    browser.findElement(by.id('nav_logout')).click();

    // wait until logout completes, as indicated by the on-screen notification
    return browser.findElement(by.id('message')).then(function (messageElement) {
      browser.wait(until.elementTextIs(messageElement, 'User logged out successfully'), config.waitMilliseconds);
    });
  }

  function dumpConsoleLog(filebase, browser) {
    var filename = filebase + "-" + consoleLogCounter + ".log",
      logs = new selenium.WebDriver.Logs(browser);
    consoleLogCounter = consoleLogCounter + 1;
    logs.get('browser').then(function (consoleLogs) {
      var stream = fs.createWriteStream(filename);
      stream.once('open', function () {
        consoleLogs.forEach(function (logEntry) {
          stream.write(logEntry.message + '\n');
        });
        stream.end();
      });
      console.log('browser console log saved to: ' + filename);
    });
  }

  exports.getChromeDriver = getChromeDriver;
  exports.login = login;
  exports.call = call;
  exports.answer = answer;
  exports.hangup = hangup;
  exports.logout = logout;
  exports.dumpConsoleLog = dumpConsoleLog;
}());
