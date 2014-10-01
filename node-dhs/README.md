# NodeJS Developer Hosted Server (DHS) for AT&T WebRTC JS SDK

A node application with the following functionality:
  * Manage configuration options for the SDK's Node Sample Application
  * Manage Application configuration (application key, secret, redirect_uri, etc.)
  * Handle AT&T's OAuth Token creation using credentials and scope.
  * Create E911 Id'sJavaScript SDK for AT&T Enhanced WebRTC API (JS SDK) v1.0.0-beta.4

## Contents of this Package

This package contains the software necessary to run a DHS to be used together with
a NodeJS Sample Web Application.

- `/package.json` - Configuration options
- `/att-webrtc-dhs.js` - Main NodeJS program

## Configuring the DHS

The configuration is located in the file: `/package.json`

### DHS Specific Configuration

```javascript
"dhs_config": {
  "dhs_host": "localhost",
  "api_env": "sandbox",
  "http_port": 10010,
  "https_port": 10011,
  "cert_file": "dhs.cert",
  "key_file": "dhs.key",
  "dhs_name": "att.webrtc.dhs",
  "cors_domains": "your.test.com, *.prod.com, *.sandbox.myapp.com"
}
```
### WebRTC API Specific Configuration

```javascript
"sandbox": {
  "api_endpoint": "https://api.att.com",
  "app_key": "YourAppKey",
  "app_secret": "YourAppSecret",
  "oauth_callback": "https://localhost:20021/oauth/callback",
  "virtual_numbers_pool": ["number1", "number2" ],
  "ewebrtc_domain": "your.ewebrtc_domain.com"
}
```

## Running the Server

** NOTE: Make sure to use the sample application using an internet connection that's not restricted. **

### Install NodeJS dependencies

```bash
$ npm install
```

### Using the NPM `start` script

```bash
$ npm start
```

**NOTE**: The `start` script will use the sandbox environment by default.

### Using different environments

  * `sandbox` - Use this environment for your testing.

  ```bash
  $ node att-webrtc-dhs.js sandbox
  ```

  * `prod` - Use this environment when you are ready for production.

  ```bash
  $ node att-webrtc-dhs.js prod
  ```


## RESTful API

### Getting the DHS Configuration
```
GET /config
```

#### Parameters

N/A

#### Response:
```javascript
{
  "dhs_name":"att.webrtc.dhs",
  "dhs_version":"1.0.0",
  "dhs_http_url":"http://att-webrtc-dhs.herokuapp.com",
  "dhs_https_url":"https://att-webrtc-hs.herokuapp.com",
  "cors_domains":["your.test.com","*.prod.com","*.sandbox.myapp.com"],
  "api_env":"test",
  "api_endpoint":"https://api-stage.mars.bf.sl.attcompute.com",
  "token_uri":"/oauth/token",
  "authorize_uri":"/oauth/authorize",
  "oauth_callback":"https://localhost:20021/oauth/callback",
  "app_key":"YourAppKey",
  "scope_names":{"MOBILE_NUMBER":"WEBRTCMOBILE","VIRTUAL_NUMBER":"WEBRTC","ACCOUNT_ID":"WEBRTC","E911":"EMERGENCYSERVICES"},
  "virtual_numbers_pool":["number1", "Number2"],
  "ewebrtc_domain":"code-api-att.com"
}
```

### Creating an Access Token

```
POST /tokens
```

#### Parameters

* Mobile Number Users:
  * `app_scope=MOBILE_NUMBER`
  * `auth_code=some_auth_code`
* Virtual Number Users:
  * `app_scope=VIRTUAL_NUMBER`
* Account ID Users:
  * `app_scope=ACCOUNT_ID`
* E911:
  * `app_scope=E911`

#### Response

Same as directly calling the [AT&T's OAuth API](http://developer.att.com/apis/oauth-2)
```javascript
{
  "access_token":"Access_Token",
  "token_type":"bearer",
  "expires_in":157680000,
  "refresh_token":"Refresh_Token"
}
```

### Create an E911 Id
```
POST /e911ids
```

### Parameters
```javascript
{
  "access_token": "Access_Token",
  "first_name": "WebRTC",
  "last_name": "Tester",
  "house_number": "3844",
  "street": "165TH PL NE",
  "city": "Redmond",
  "state": "WA",
  "zip": "98052",
  "is_confirmed": "true",
  "comments": "Just Testing"
}
```

#### Response:
```javascript
{
  "e911Locations":
  {
    "addressIdentifier":"Identifier",
    "status":"Validated",
    "expirationDate":"-1"
  }
}
```

## Glossary
* API: Application Programming Interface
* FVT: Function Verification Test
* GA: General Availability
* DHS: Developer Hosted Server
* ICMN: In-App Calling for Mobile Number
* JS: JavaScript
* MVP: Minimum Viable Product
* SDK: Software Development Kit
* SVT: Service Verification Test
* WebRTC: Web Real-Time Communications, a W3C standard
