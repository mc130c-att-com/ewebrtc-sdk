# RELEASE NOTES - AT&T's Enhanced WebRTC JS SDK

The SDK provides the following components:
  * JavaScript library - a client library to consume AT&T's Enhanced WebRTC API.
  **Please refer to `node-sample/RELEASE.md` for Sample Applications-specific notes**
  * NodeJS Sample Application - Web Application to demonstrate the features
  of the JavaScript library.
  * DHS - NodeJS server to manage application assets (key, secret, etc.) and
  to generate OAuth access tokens and E911 Ids.
  **Please refer to `node-dhs/RELEASE.md` for DHS-specific notes**

# v1.0.0-beta.5
September 26, 2014

* **New Feature:** Switch from a call in foreground to one in background. This feature enables the developer to
bring a call in the background to the foreground. Operations using the `Phone` interface
like hold, resume, mute, un-mute, hangup, move and switch can then be performed on the foreground call.
  * After a successful switch the foreground call:
    * will resume automatically if, the call was put on the background via `Phone.addCall`, `Phone.answer` or
     `Phone.switchCall`
    * will not resume automatically if, the call was put on hold via `Phone.hold` before putting in the background.
  * A new event `session:call-switched` has been created to enable the developer to be notified of a successful switch
  between calls during `Phone.addCall`, `Phone.answer` and `Phone.switchCall`.

* **Bug Fix:** DE74137: Unable to call ICMN to NOTN and call continues to ring (QC 25394).
* **Bug Fix:** DE74457 : Answer second call documentation is lacking; Input parameter validation for phone.answer()
second call needs improvement (QC 20600)
* **Bug Fix:** DE75299 : Camera is still on and captured by application even after ending video call (QC:29483)
* **Bug Fix:** DE75082 : SDK is not releasing mic after call is ended successfully. QC 28571


## Known Issues

* Unable to make calls to Virtual Number users using `tel:` format.
  * **Workaround:** Use the following format: `sip:1231231234@yourdomain.com`
  * Related QC Ticket:
    * QC 82965: SDK_WEBRTC_8.14 - VTN User is Unable to Create Conference in Production Environment (F4/H4) : state: "session-terminated", reason: "External server request error."

* After successfully adding a mobile phone (PSTN) to a Conference it will be disconnected after ~24s.
  * Related QC Ticket:
    * QC 85425: Call disconnects after 24 seconds when successfully creating a conference (as any user) and adding a PSTN participant.
* `External Server request error` when creating a Conference using Virtual Number or Account ID users.
  * Related QC Tickets:
    * QC 81357: SDK_WEBRTC_7.14 - Unable to create a conference in F4 using an Account ID user
    * QC 82965: SDK_WEBRTC_8.14 - VTN User is Unable to Create Conference in Production Environment (F4/H4) : state: "session-terminated", reason: "External server request error."

* Getting Message: `External Server request error` or `User Not Found` when calling Account ID users.
  * Cause: This is caused by a platform issue.
  * **Workaround:** N/A
  * Related QC Tickets:
    * QC 17878
    * QC 82965: SDK_WEBRTC_8.14 - VTN User is Unable to Create Conference in Production Environment (F4/H4) : state: "session-terminated", reason: "External server request error."

* `Phone.move` only works for Chrome 37+ on Windows.

* Adding multiple participants at once using `Phone.addParticipants` method fails with error: `SVC8501:MediaConference ongoing update participant operation.,Variables=`. SDK is tracking this issue against the API platform with the QC Defect ID: 79678
  * **Workaround:** Use `Phone.addParticipants` with a single participant ID (mobile number, account id, virtual number)
  * Related QC Ticket:
    * QC 85105: SDK_WEBRTC_9.14 - Error: `External server request error.` when adding a participant to a conference created by a VTN user.

* When a participant leaves a conference by using the `endConference` method, the platform does not generate
the necessary event to inform the host. Product Team is tracking this issue with QC Defect ID: 79658
* When an Mobile Number user rejects an invitation for a conference, sometimes the event `conference:ended` will not
  be published due to a bug at the Platform Level.
* When adding a participant to a conference, sometimes the error: `The requested conference ID <id> was not found.`
  is shown. SDK is tracking this issue against the API platform with the QC Defect ID: 65423
* Video switching between participants seems to be unstable. Product Team is tracking this issue with QC Defect ID: 79673
  * **Workaround:** Turn off your microphone while the other participant speaks, that will switch the video to the
  speaking participant.

## Tested Environments

   * RESTful API Environment: The SDK was tested against Production.
   * Chrome Version 37.0.2062.94 for OSX v10.8.5

**_The SDK may also work for other Operating Systems,
  other Browsers but is not tested or supported_**

## Notes

* **QC: 80472 (Rally DE67530):** Unable to login using SDK. This is not an SDK error, this is caused by an HTTP error with code 503.
It means: "_The server is currently unavailable (because it is overloaded or down for maintenance).
Generally, this is a temporary state._"
  * [Wikipedia: 5xx Server Error](http://en.wikipedia.org/wiki/List_of_HTTP_status_codes#5xx_Server_Error)

# Older releases

## v1.0.0-beta.4
September 20, 2014

* **Change Request 0089:** This CR is a required change to align with Rev F of the WCG spec:
  * **New event** `call:ringback-provided` on `Phone` object.
    * review the API documentation for details of when this event is fired.
    * review the tutorial for an example of how this event could be used.
* **Bug Fix:** DE71593: CORS security needs to be enabled for cross domain use of WebRTC-SDK.
  * **NOTE:** It is no longer necessary to launch the browser with disabled web security.
* **Bug Fix:** DE73531: Unable to see user's video after resuming the first call
* **Bug Fix:** DE71192: Local hold action was disabled after remote party performed a hold.
* **Bug Fix:** DE72613 (QC20611): Call disconnected event is getting fired twice for incoming client when call is
ended.
* **Bug Fix:** DE73529 (QC23712 & QC23747): Virtual number to Account Id call is not working. cleanPhoneNumber
method was converting
Account Id to phone number.
* **Bug Fix:** DE73535 (QC5124 & QC5121): when user provides `tel` or `sip` in callee, SVT-SDK will call other phone
 number.
* **Bug Fix:** DE71853 (QC14825): SDK is not throwing error message when system throw http 503 error message. ( Fixed
documentation)


## What's new in v1.0.0-beta.3
September 12, 2014

* **Bug Fix:** DE72036 (QC 14890): BIZ_UAT_WebRTC_PROD: No audio from video to audio call.
* **Re-branding:**
  * `/node-dhs/package.json`
    * Setting `allow_domains` is now `cors_domains`
    * Setting `enhanced_webrtc_domain` is now `ewebrtc_domain`
    * Setting `virtual_numbers_pool` is now an array.
  * Changes to method signatures (see API Doc for more details):
    * `ATT.rtc.hasWebRTC` is now `ATT.rtc.hasEnhancedWebRTC`
    * `ATT.rtc.enhancedWebRTCDomain` is now `ATT.rtc.getEWebRTCDomain`
    * `ATT.rtc.configure`:
    ```javascript
        ATT.rtc.configure({
            ewebrtc_domain: 'my.domain.com'
            api_endpoint: 'https://api.att.com'
          })
    ```

  * Replace occurrences of _WebRTC_ with _Enhanced WebRTC_ in:
    * API Documentation
    * README.md
    * API Error Dictionary
  * JS Library renamed from `webrtc-sdk.min.js` to `ewebrtc-sdk.min.js`


## What's new in v1.0.0-beta.2

* **Bug Fix:** DE16893 Webcam is open even after ending phone call.
* **New method `Phone.move()`**: Use this function to move the current call to another client. All clients currently logged in with the same Id will receive a call. This method can also be used to move a call to a handheld device.
* **Re-branding** - There are names and text changes to the methods, error messages and API docs. Highlights are:
  * `ATT.rtc.hasWebRTC` is renamed as `ATT.rtc.hasEnhancedWebRTC`
  * `ATT.rtc.getAppDomain` is renamed as `ATT.rtc.getEWebRTCDomain`
  * The signature of `ATT.rtc.configure` is now:

    ```javascript
        ATT.rtc.configure({
            ewebrtc_domain: 'my.domain.com'
            api_endpoint: 'https://api.att.com'
          })
    ```

  * `ATT.rtc.dhs.createAccessToken` now accepts these app scopes:
    * `MOBILE_NUMBER` (for mobile number users)
    * `VIRTUAL_NUMBER` (for virtual number users)
    * `ACCOUNT_ID` (for account id users)
    * `E911` (for e911 services)

* **New Versioning schema:** The SDK now uses [Semantic Versioning](http://semver.org/)

## Fixes: JavaScript SDK for AT&T Enhanced WebRTC API (JS SDK) Beta 1.0.1

### Bug Fixes

* QC 14866: BIZ_UAT_WebRTC_PROD: Unable to login using NO TN from Modelshop application
(for usage examples of `ATT.rtc.configure` method, refer to the API Documentation and Tutorial).


## JavaScript SDK for AT&T Enhanced WebRTC API (JS SDK) Beta 1.0

### Bug Fixes

 * Rally DE68721: Camera not disabled on call disconnected
 * Rally DE81721: Hold, mute, and Resume won't work
 * Rally DE68720: Video cam enabled on audio call
 * Rally DE68929: Reference error for onUserMediaError when local/remote media is invalid

### New Features

* **Refactored DHS** - Improvements in the organization of the SDK sources for easier use and
comprehension of the different components of the SDK. The new package contains the following components:
  * **Node DHS** - A node application with the following functionality:
    * Manage configuration options for the SDK's Node Sample Application
    * Manage Application configuration (application key, secret, redirect_uri)
    * Handle AT&T's OAuth Token creation using credentials and scope.
    * Create E911 Id's
  * **Node Sample Application** - A NodeJS web application demonstrating the use of the JS library.
  The Node Sample Application has the following functionality:
    * Manage DHS host and port configuration options for application startup.
    * Provide endpoint for AT&T's OAuth Authorization: `/oauth/authorize`
    * Provide RESTful API to provide configuration for the JS Library:
      * DHS URL,
      * Enhanced WebRTC API base URL,
      * Enhanced WebRTC domain
    * Provide RESTful API for Basic User Management with file-based persistence.
      * MongoDB is no longer necessary as a dependency. The users are stored in a JSON file. **Once you restart the Node Sample Application all users will be lost.**
    * Hosts a Web Application (HTML+CSS+JS) that makes use of the Enhanced WebRTC JS Library.
  * **Enhanced WebRTC Javascript Library** - The actual library which defines the `Phone` and `ATT.rtc` objects:
    * `Phone` - Call & Conference management
    * `ATT.rtc` - Various configuration and utility methods necessary to setup the library.
    * `ATT.rtc.dhs` - Various methods specific for interaction with the Node DHS mentioned above.
  * **Updated documentation** - Documentation reflects the changes described above.