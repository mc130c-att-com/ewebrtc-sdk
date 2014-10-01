# RELEASE NOTES - NodeJS Server (DHS) for AT&T's Enhanced WebRTC JS SDK

September 20, 2014

The DHS is a node application with the following functionality:
  * Manage configuration options for the SDK's Node Sample Application
  * Manage Application configuration (application key, secret, redirect_uri, etc.)
  * Handle AT&T's OAuth Token creation using credentials and scope.
  * Create E911 Id'sJavaScript SDK for AT&T Enhanced WebRTC API (JS SDK) v1.0.0-beta.4

## v1.0.0-beta

* **Features:**
  * Configuration file to setup AT&T's Developer
Program enrollment assets (application key and secret, redirect_uri).
  * RESTful API:
    * `/config` - environment options necessary to configure the SDK.
    * `/tokens` - AT&T's OAuth use to generate Access Tokens
    * `/e911ids` - create E911 Ids
  * **Documentation:**
    * Instructions on how to setup & start the DHS pointing to different
    environments
    * Description of the RESTful API


### Known Issues

* DHS Configuration: Virtual Numbers must be valid 10-digit phone numbers.
