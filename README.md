# JavaScript SDK for AT&T Enhanced WebRTC API

Note: For a **much better reading experience** open this file with a Markdown-compatible viewer.

One option is to use the [Markdown Viewer](https://chrome.google.com/webstore/detail/markdown-viewer/ehnambpmkdhopilaccgfmojilolcglhn) Chrome extension:

1. Install the Chrome extension from the previous URL
2. Go to `chrome://extensions/` in Chrome
3. Find the _Markdown Viewer_ extension and check `Allow access to file URLs.`
4. Open this file using Chrome (open a new tab and drag the file to that tab)

# SDK Contents

* `/node-dhs`: Node.js Developer Hosted Server (DHS)
* `/node-sample/`: Sample application
* `/node-sample/public/js/ewebrtc-sdk.min.js`: JavaScript client library for the AT&T Enhanced WebRTC API
* `/tutorial/index.html`: AT&T Enhanced WebRTC JavaScript SDK tutorial
* `/api-docs/index.html`: JS SDK API reference documentation

# Using the Sample Application

The following section is an overview for setting up the AT&T Enhanced WebRTC DHS and sample application. The sample app can be used as a reference and starting point for your own applications. 

For full instructions on deploying this SDK and sample app, see the [Enhanced WebRTC JavaScript SDK page](http://developer.att.com/sdks-plugins/enhanced-webrtc) on the AT&T Developer Program Web site.

## Summary

* Enroll in the [AT&T Developer Program](http://developer.att.com/), register your app, set up an Org Domain and CORS domains, and get an app key and secret.
* Configure the Node.js DHS.
* Configure the Sample App with your DHS URL.
* Install the Node.js dependencies by running `$ npm install` in the `node-dhs` directory.
* Install the Node.js sample app dependencies by running `$ npm install` in the `node-sample` directory.
* Start the DHS: Run `$ npm start` from the `node-dhs` directory
* Start the Sample Application: Run `$ npm start` from the `node-sample` directory
* Launch a Chrome browser to run the sample application: `https://localhost:9001/`

## System Requirements

* Mac OS X 10.7 "Lion," 10.8 "Mountain Lion," or 10.9 "Mavericks"; Windows 7.x or 8.x; Linux 
* Ruby, Java or PHP (production environment) or Node.js (quick-start deployment), available from [Nodejs.org](http://nodejs.org/download/)

## Further reading

* AT&T Enhanced WebRTC JavaScript SDK configuration, deployment and samples: [http://developer.att.com/sdks-plugins/enhanced-webrtc](http://developer.att.com/sdks-plugins/enhanced-webrtc)

* DHS ReadMe: [`/node-dhs/README.md`](/node-dhs/README.md) 
* DHS Release Notes: [`/node-dhs/RELEASE.md`](/node-dhs/RELEASE.md) 

* Sample App ReadMe: [`/node-sample/README.md`](/node-sample/README.md) 
* Sample App Release Notes: [`/node-sample/RELEASE.md`](/node-sample/RELEASE.md) 

### Notes

* The sample app uses the DHS for its initial configuration, setting up an Enhanced WebRTC API Endpoint and accessing the DHS RESTful API
