# RELEASE NOTES - NodeJS Sample Application for AT&T's Enhanced WebRTC JS SDK

This sample app is a Node.js Web application for demonstrating the features of AT&T Enhanced WebRTC, and includes the following functionality:
  * User management
  * OAuth endpoint for Mobile Number authorization and callback
  * Login and logout functionality for Virtual Number and Account ID users

## v1.0.0-beta
September 20, 2014

* **Features:**
  * RESTful API:
    * `/users` - User management
    * `/login` & `/logout` - Authentication (session management)
    * `/oauth/authorize` - Device authorization
    * `/oauth/callback` - Redirection to the sample app

### Known Issues

* XHR Error: `net::ERR_INSECURE_RESPONSE`
  * **Workaround:** load the sample app URL in your browser (e.g., `https://127.0.0.1:9001`), and click _proceed to URL (unsafe)_.

* Error Registering Users (HTTP 409) - `POST https://localhost:9001/users 409 (Conflict)`
  * **Workaround:** Delete the file `/node-sample/users.json` and restart the sample app.
