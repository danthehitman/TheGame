// Filename: ilapi.js
define(['pubsub', 'guidgen', 'utils'],
    function (pubsub, guidgen, utils) {
        return function ilapi() {
            var self = this;

            self.ilapiEvents = {
            };

            // CONSTANTS
            // Google APIs Client Id for web applications
            self.SCOPES = [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile'];
            self.AUTHREDIRECTURL = window.location.href.split('?')[0];
            self.APIROOT = '/api/'
            self.SESSIONENDPOINT = 'sessions';
            self.GENERATEDISCOVERIESENDPOINT = "discovery/generate";
            self.USERSENDPOINT = "users/"

            self.sessionToken = "";

            self.pageInfo = {
                page: 1,
                count: 100000
            };

            self.checkSessionState = function (successCallback, errorCallback) {
                $.ajax({
                    type: 'GET',
                    headers: { "auth": self.sessionToken },
                    url: '/api/' + self.SESSIONENDPOINT + "/" + self.sessionToken,
                    async: true,
                    success: successCallback,
                    error: errorCallback
                });
            };

            //  Here we just build the URL for the google oauth2 call and navigate to it.
            //  This one is specific to the APPS authorization which is used for all the UI applications.
            //  The AUTHREDIRECTURL is important here, it must be the same url we are navigating from or the call will fail.
            self.initializeAppsAuthorization = function (argScopes) {
                var scopes = self.SCOPES;
                if (argScopes) {
                    scopes = self.SCOPES.concat(argScopes);
                }
                scopes = scopes.join("+");
                var authUrl = 'https://accounts.google.com/o/oauth2/auth' +
                    '?state=' + utils.getUriParameterByName("state") +
                    '&redirect_uri=' + self.AUTHREDIRECTURL +
                    '&response_type=code' +
                    '&client_id=' + self.APPS_CLIENTID +
                    '&approval_prompt=force' +
                    '&scope=' + scopes +
                    '&access_type=offline';
                document.location = authUrl;
            };

            //  Here we just build the URL for the google oauth2 call and navigate to it.
            //  This one is specific to the API authorization which is used for the API keys.  Also now handling the GAdmin login which only has different scopes passed in.
            //  The AUTHREDIRECTURL is important here, it must be the same url we are navigating from or the call will fail.
            self.initializeApiAuthorization = function (argScopes) {
                var scopes = self.SCOPES;
                if (argScopes) {
                    scopes = self.SCOPES.concat(argScopes);
                }
                scopes = scopes.join("+");
                var authUrl = 'https://accounts.google.com/o/oauth2/auth' +
                    '?state=' + utils.getUriParameterByName("state") +
                    '&redirect_uri=' + self.AUTHREDIRECTURL +
                    '&response_type=code' +
                    '&client_id=' + self.API_CLIENTID +
                    '&approval_prompt=force' +
                    '&scope=' + scopes +
                    '&access_type=offline';
                document.location = authUrl;
            };

            // Takes a google authorization code and exchanges it for an ILAPI session token.
            self.getSessionToken = function (code, successHandler, errorHandler) {
                $.ajax({
                    type: 'POST',
                    url: '/api/' + self.SESSIONENDPOINT,
                    contentType: 'application/octet-stream; charset=utf-8',
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json',
                    data: '{"code":"' + code + '",' +
                        '"redirectUrl":"' + self.AUTHREDIRECTURL + '",' +
                        '"authtype":"google"' +
                    '}'
                });
            };

            self.updateSessionToken = function (record, successHandler, errorHandler) {
                $.ajax({
                    type: 'PUT',
                    url: '/api/' + self.SESSIONENDPOINT + '/' + record.sessiontoken,
                    contentType: 'application/json',
                    headers: { "auth": self.sessionToken },
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json',
                    data: JSON.stringify(record)
                });
            };

            self.deleteSessionToken = function (record, successHandler, errorHandler) {
                var url = '/api/' + self.SESSIONENDPOINT + '/' + record.sessiontoken;
                self.doDelete(url, successHandler, errorHandler);
            };

            // Takes a google authorization code and exchanges it for an ILAPI session token.
            self.getSessionTokenLocalAuth = function (username, password, successHandler, errorHandler) {
                $.ajax({
                    type: 'POST',
                    url: '/api/' + self.SESSIONENDPOINT,
                    contentType: 'application/octet-stream; charset=utf-8',
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json',
                    data: '{"authtype":"local",' +
                        '"username":"' + username + '",' +
                        '"password":"' + password + '"' +
                    '}'
                });
            };

            // Takes a google authorization code and exchanges it for an ILAPI session token.
            self.getApiSessionToken = function (code, successHandler, errorHandler) {
                $.ajax({
                    type: 'POST',
                    url: '/api/' + self.SESSIONENDPOINT,
                    contentType: 'application/octet-stream; charset=utf-8',
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json',
                    data: '{"code":"' + code + '",' +
                        '"redirectUrl":"' + self.AUTHREDIRECTURL + '",' +
                        '"authtype":"api"' +
                    '}'
                });
            };

            // Takes a google authorization code and exchanges it for an ILAPI session token.
            self.getGAdminSessionToken = function (code, successHandler, errorHandler) {
                $.ajax({
                    type: 'POST',
                    url: '/api/' + self.SESSIONENDPOINT,
                    contentType: 'application/octet-stream; charset=utf-8',
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json',
                    data: '{"code":"' + code + '",' +
                        '"redirectUrl":"' + self.AUTHREDIRECTURL + '",' +
                        '"authtype":"gadmin"' +
                    '}'
                });
            };

            //  Invalidates the current session token.
            self.invalidateSessionToken = function (successHandler, errorHandler) {
                $.ajax({
                    type: 'DELETE',
                    headers: { "auth": self.sessionToken },
                    url: '/api/' + self.SESSIONENDPOINT,
                    async: true,
                    success: successHandler,
                    error: errorHandler
                });
            };

            // Initialize the process to refresh the Google issued access token.  
            // Immediate is set to false so that the user will not be prompted.
            self.refreshGoogleToken = function () {
                var options = {
                    client_id: self.APPS_CLIENTID,
                    scope: self.SCOPES,
                    immediate: true
                };
                gapi.auth.authorize(options, self.onGoogleTokenRefreshed);
            };

            //  No error handling here because if the call failed then we never got back here because there will be a 400 bad request in the console.
            self.onGoogleTokenRefreshed = function (result) {
                if (result != null && result.access_token != null) {
                    pubsub.publish(self.ilapiEvents.gapiTokenRefreshed, result.access_token);
                    window.setTimeout(function () { self.refreshGoogleToken(); }, result.expires_in * 900);
                }
            };

            self.doGet = function (pageUri, successHandler, errorHandler) {
                $.ajax({
                    type: 'GET',
                    headers: { "auth": self.sessionToken },
                    url: pageUri,
                    async: true,
                    success: successHandler,
                    error: errorHandler
                });
            };

            self.doDelete = function (pageUri, successHandler, errorHandler) {
                $.ajax({
                    type: 'DELETE',
                    headers: { "auth": self.sessionToken },
                    url: pageUri,
                    async: true,
                    success: successHandler,
                    error: errorHandler
                });
            };

            self.doDeleteMany = function (pageUri, ids, successHandler, errorHandler) {
                $.ajax({
                    type: 'DELETE',
                    headers: { "auth": self.sessionToken },
                    url: pageUri,
                    async: true,
                    contentType: 'application/json',
                    processData: false,
                    dataType: 'json',
                    data: JSON.stringify(ids),
                    success: successHandler,
                    error: errorHandler
                });

            };

            self.doPutMany = function (url, items, successHandler, errorHandler) {
                $.ajax({
                    type: 'PUT',
                    url: url,
                    contentType: 'application/json',
                    headers: { "auth": self.sessionToken },
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json',
                    data: JSON.stringify(items)
                });
            };

            self.getUser = function (userId, getFull, successHandler, errorHandler) {
                var url = self.APIROOT + self.USERSENDPOINT + userId + "?Full=" + getFull;
                self.doGet(url, successHandler, errorHandler);
            };

            self.getUserBySubId = function (subid, successHandler, errorHandler) {
                var filter = "googlesubid:" + subid;
                self.search(self.USERSENDPOINT, successHandler, errorHandler, filter);
            };

            self.getLoggedInUser = function (successHandler, errorHandler) {
                $.ajax({
                    type: 'GET',
                    headers: { "auth": self.sessionToken },
                    url: self.APIROOT + "sessions/" + self.sessionToken + "/user",
                    async: true,
                    success: successHandler,
                    error: errorHandler
                });
            };

            self.getDiscoveries = function (successHandler, errorHandler) {
                $.ajax({
                    type: 'GET',
                    headers: { "auth": self.sessionToken },
                    url: self.APIROOT + "discovery",
                    async: true,
                    success: successHandler,
                    error: errorHandler
                });
            };

            self.getRecipes = function (successHandler, errorHandler) {
                $.ajax({
                    type: 'GET',
                    headers: { "auth": self.sessionToken },
                    url: self.APIROOT + "recipes",
                    async: true,
                    success: successHandler,
                    error: errorHandler
                });
            };

            self.generateDiscoveriesFromItem = function (itemId, point, successHandler, errorHandler) {
                var postData = {
                    itemId: itemId,
                    point: point
                };
                $.ajax({
                    headers: { "auth": self.sessionToken },
                    contentType: "application/json",
                    type: "POST",
                    url: self.APIROOT + self.GENERATEDISCOVERIESENDPOINT,
                    processData: false,
                    dataType: "json",
                    data: JSON.stringify(postData),
                    success: successHandler,
                    error: errorHandler
                });
            };

            self.convertDiscoveryToLoot = function (discoveryId, successHandler, errorHandler) {
                $.ajax({
                    headers: { "auth": self.sessionToken },
                    contentType: "application/json",
                    type: "POST",
                    url: self.APIROOT + "discovery/" + discoveryId + "/convert",
                    processData: false,
                    dataType: "json",
                    success: successHandler,
                    error: errorHandler
                });
            };

            self.postCraftRecipe = function (recipeId,  ingredients, successHandler, errorHandler) {
                $.ajax({
                    headers: { "auth": self.sessionToken },
                    contentType: "application/json",
                    type: "POST",
                    url: self.APIROOT + "recipes/" + recipeId + "/craft",
                    processData: false,
                    dataType: "json",
                    data: JSON.stringify(ingredients),
                    success: successHandler,
                    error: errorHandler
                });
            };

            self.getItemsForUser = function (userId, successHandler, errorHandler) {
                $.ajax({
                    type: 'GET',
                    headers: { "auth": self.sessionToken },
                    url: self.APIROOT + "users/" + userId + "/items",
                    async: true,
                    success: successHandler,
                    error: errorHandler
                });
            };
            self.getJunkForUser = function (userId, successHandler, errorHandler) {
                $.ajax({
                    type: 'GET',
                    headers: { "auth": self.sessionToken },
                    url: self.APIROOT + "users/" + userId + "/junk",
                    async: true,
                    success: successHandler,
                    error: errorHandler
                });
            };
        };
    });