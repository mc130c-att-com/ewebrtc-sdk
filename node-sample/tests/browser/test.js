/*jslint browser: true, devel: true, node: true, debug: true, todo: true, indent: 2, maxlen: 150 */
/*global require, it, beforeEach, afterEach, describe*/
/*global browser, By*/
'use strict';

var selenium = require('selenium-webdriver');
var by = selenium.By;
var until = selenium.until;
var expect = require('chai').expect;
var config = require('./config');
var utils = require('./utils');

// the test cases below will be run for each of the following combinations:
[{firstType: 'NOTN', secondType: 'NOTN'},
  {firstType: 'NOTN', secondType: 'VTN'},
  {firstType: 'VTN', secondType: 'NOTN'},
  {firstType: 'VTN', secondType: 'VTN'}]
  .forEach(function (data) {
    var firstType = data.firstType,
      secondType = data.secondType;

    describe('Making ' + secondType + '-to-' + firstType + ' phone calls:', function () {

      this.timeout(config.testTimeoutMilliseconds);

      var firstUsername,
        secondUsername,
        firstBrowser,
        secondBrowser;

      beforeEach('start the browsers', function () {
        firstBrowser = utils.getChromeDriver();
        secondBrowser = utils.getChromeDriver();
      });

      beforeEach('create the usernames', function () {
        // because we only have a limited number of virtual telephone numbers (VTN)
        // we'll reuse the same two users.
        firstUsername = (firstType === 'VTN') ? 'vtn1' : 'notn1';
        secondUsername = (secondType === 'VTN') ? 'vtn2' : 'notn2';
      });

      afterEach('dump browser consoles on failure', function () {
        if (this.currentTest.state === 'failed') {
          utils.dumpConsoleLog('firstBrowser', firstBrowser);
          utils.dumpConsoleLog('secondBrowser', secondBrowser);
        }
      });

      afterEach('close the browsers', function (done) {
        firstBrowser.quit();
        secondBrowser.quit().then(done);
      });

      [{whoHangsUp: 'caller'},
        {whoHangsUp: 'callee'}]
        .forEach(function (data) {
          var whoHangsUp = data.whoHangsUp;

          it('makes a successful call, and the ' + whoHangsUp + ' hangs up', function (done) {

            utils.login({browser: firstBrowser, type: firstType, username: firstUsername});
            utils.login({browser: secondBrowser, type: secondType, username: secondUsername});

            utils.call({browser: secondBrowser, type: firstType, callee: firstUsername});
            utils.answer({browser: firstBrowser, caller: secondUsername});

            // make sure the other user is also connected, as indicated by the on-screen notification
            secondBrowser.findElement(by.id('message')).then(function (messageElement) {
              secondBrowser.wait(until.elementTextContains(messageElement, 'Connected to call'), config.waitMilliseconds);
            });

            var hangupBrowser = whoHangsUp === 'caller' ? secondBrowser : firstBrowser,
              nonHangupBrowser = whoHangsUp === 'caller' ? firstBrowser : secondBrowser;

            utils.hangup({browser: hangupBrowser});

            // make sure the other user also disconnects, as indicated by the on-screen notification
            nonHangupBrowser.findElement(by.id('message')).then(function (messageElement) {
              nonHangupBrowser.wait(until.elementTextContains(messageElement, 'disconnected'), config.waitMilliseconds);
            });

            utils.logout({browser: firstBrowser});
            utils.logout({browser: secondBrowser})
              .then(done); // make sure 'done' is always the last thing we do, so mocha knows the test case finished
          });
        });
    });

    /*
     TODO: Create tests for caller signaling: dialing, connecting, connected, disconnecting, disconnected
     TODO: Create tests for callee signaling: call from:, answering, connecting, connected, disconnecting, disconnected
     */
  });
