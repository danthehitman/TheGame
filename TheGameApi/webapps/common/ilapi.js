// Filename: ilapi.js
define(['pubsub', 'guidgen', 'utils'],
    function (pubsub, guidgen, utils) {
        return function ilapi() {
            var self = this;

            self.ilapiEvents = {
                gapiTokenRefreshed: "gapi-token-refreshed"
            };

            // CONSTANTS
            // Google APIs Client Id for web applications
            self.APPS_CLIENTID = "816301768316-eoeaq2g5ppkoav23rgs2q86ndrvlefu9.apps.googleusercontent.com";
            self.API_CLIENTID = "816301768316-as1jpb6jcvf02e09clhe2vhl94p7ra14.apps.googleusercontent.com";
            self.SCOPES = ['https://www.googleapis.com/auth/mapsengine.readonly',
                'https://www.googleapis.com/auth/mapsengine',
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile'];
            self.AUTHREDIRECTURL = window.location.href.split('?')[0];
            self.SESSIONENDPOINT = 'auth/sessions';
            self.USERCONFIGENDPOINT = 'users/uiconfig';
            self.GISFEATUREENDPOINT = 'gis/features';
            self.GMELAYERSENDPOINT = 'gis/gmelayers';
            self.LINEARREFLAYERSENDPOINT = 'gis/linearreflayers';
            self.POSTGISDATASETSENDPOINT = 'gis/postgisdatasets';
            self.POSTGISMAPLAYERSENDPOINT = 'gis/postgismaplayers';
            self.LINEARREFSEARCHENDPOINT = 'gis/linearrefsearch';
            self.USERSENDPOINT = 'users/users';
            self.SITEVIEWENDPOINT = 'users/siteviews';
            self.ORGANIZATIONSENDPOINT = 'organizations';
            self.CREATEDOMAINUSERSENDPOINT = 'users/domainusers';
            self.REPLICATIONJOBENDPOINT = 'replication/replicatorjobs';
            self.MINIMALGISFEATUREENDPOINT = 'gis/minimalfeatures';
            self.GISCHARTENDPOINT = 'gis/chartdata';
            self.REGISTRATIONENDPOINT = 'users/register';
            self.INVITATIONENDPOINT = 'users/invitation';

            self.sessionToken = "";

            self.pageInfo = {
                page: 1,
                count: 100000
            };

            self.checkSessionState = function (successCallback, errorCallback) {
                $.ajax({
                    type: 'GET',
                    headers: { "Authorization": self.sessionToken },
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
                    headers: { "authorization": self.sessionToken },
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

            // Takes a registration token and registers the user.
            self.registerUser = function (token, successHandler, errorHandler) {
                $.ajax({
                    type: 'POST',
                    url: '/api/' + self.REGISTRATIONENDPOINT + "?token=" + token,
                    contentType: 'application/json',
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json'
                });
            };

            // Takes a registration token and registers the user.
            self.inviteUser = function (data, successHandler, errorHandler) {
                $.ajax({
                    type: 'POST',
                    url: '/api/' + self.INVITATIONENDPOINT,
                    contentType: 'application/json',
                    headers: { "authorization": self.sessionToken },
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json',
                    data: JSON.stringify(data)
                });
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
                    headers: { "Authorization": self.sessionToken },
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

            //  This call queries the features endpoint for features within a given distance of the provided point.
            self.getFeatureById = function (featureId, successCallback, errorCallback) {
                $.ajax({
                    type: 'GET',
                    headers: { "Authorization": self.sessionToken },
                    url: '/api/' + self.GISFEATUREENDPOINT + "/" + featureId,
                    async: true,
                    success: successCallback,
                    error: errorCallback
                });
            };

            //  This call queries the features endpoint for features within a given distance of the provided point.
            self.getFeaturesFromPoint = function (lat, lng, distance, dataSets, successCallback, errorCallback, pageSize) {
                if (pageSize != null) {
                    self.pageInfo.count = pageSize;
                }
                $.ajax({
                    type: 'GET',
                    headers: { "Authorization": self.sessionToken },
                    url: '/api/' + self.GISFEATUREENDPOINT + "?searchtype=geo&type=point&geometry={0}&distance={1}&datasets={2}&page={3}&count={4}".format(lng + ',' + lat, distance, dataSets, self.pageInfo.page, self.pageInfo.count),
                    async: true,
                    success: successCallback,
                    error: errorCallback
                });
            };

            //  This call queries the features endpoint for features within a given distance of the provided point.
            self.getNearestLinearRefFromPoint = function (lat, lng, distance, linearRefLayers, successCallback, errorCallback) {
                $.ajax({
                    type: 'GET',
                    headers: { "Authorization": self.sessionToken },
                    url: '/api/gis/nearestlinearrefpoint?searchtype=geo&type=point&geometry={0}&distance={1}&layers={2}'.format(lng + ',' + lat, distance, linearRefLayers),
                    async: true,
                    success: successCallback,
                    error: errorCallback
                });
            };

            self.getChartData = function (chartId, successCallback, errorCallback) {
                $.ajax({
                    type: 'GET',
                    headers: { "Authorization": self.sessionToken },
                    url: '/api/' + self.GISCHARTENDPOINT + "/{0}".format(chartId),
                    async: true,
                    success: successCallback,
                    error: errorCallback
                });
            };

            self.getSchemaForPostGisDataSet = function (postGisDataSetId, successCallback, errorCallback) {
                $.ajax({
                    type: 'GET',
                    headers: { "Authorization": self.sessionToken },
                    url: '/api/' + self.POSTGISDATASETSENDPOINT + "/{0}/schema".format(postGisDataSetId),
                    async: true,
                    success: successCallback,
                    error: errorCallback
                });
            };

            self.query = function (postGisDataSetId, filter, successCallback, errorCallback) {
                $.ajax({
                    type: 'POST',
                    url: '/api/' + self.POSTGISDATASETSENDPOINT + "/{0}/filter".format(postGisDataSetId),
                    contentType: 'application/json',
                    headers: { "authorization": self.sessionToken },
                    success: successCallback,
                    error: errorCallback,
                    processData: false,
                    dataType: 'json',
                    data: JSON.stringify(filter)
                });
            };

            //  This call retrieves all data in the given layers from the features endpoint.
            self.retrieveMinimalLayers = function (dataSetIds, successCallback, errorCallback) {
                $.ajax({
                    type: 'GET',
                    headers: { "Authorization": self.sessionToken },
                    url: '/api/' + self.MINIMALGISFEATUREENDPOINT + "?datasets={0}".format(dataSetIds),
                    async: true,
                    success: successCallback,
                    error: errorCallback
                });
            };

            //  This call retrieves all data in the given layers from the features endpoint.
            self.retrieveFullLayers = function (dataSetIds, successCallback, errorCallback) {
                $.ajax({
                    type: 'GET',
                    headers: { "Authorization": self.sessionToken },
                    url: '/api/' + self.GISFEATUREENDPOINT + "?datasets={0}".format(dataSetIds),
                    async: true,
                    success: successCallback,
                    error: errorCallback
                });
            };

            //  This call retrieves all data in the given layers from the features endpoint.
            self.textSearch = function (dataSetIds, searchText, extent, successCallback, errorCallback, pageSize) {
                if (pageSize != null) {
                    self.pageInfo.count = pageSize;
                }
                var extentString = "";
                if (extent != null) {
                    extentString = "&searchextent=" + extent;
                }
                $.ajax({
                    type: 'GET',
                    headers: { "Authorization": self.sessionToken },
                    url: '/api/' + self.GISFEATUREENDPOINT + "?searchtype=text&searchtext={0}&datasets={1}&page={2}&count={3}{4}".format(encodeURIComponent(searchText), dataSetIds, self.pageInfo.page, self.pageInfo.count, extentString),
                    async: true,
                    success: successCallback,
                    error: errorCallback
                });
            };

            //  This call retrieves all data in the given layers from the features endpoint.
            self.linearRefSearch = function (layerIds, searchText, mileseries, footstation, successCallback, errorCallback) {
                var urlArgs = "";
                if (mileseries == null) {
                    urlArgs = "?searchtext={0}&layers={1}&footstation={2}".format(encodeURIComponent(searchText), layerIds, encodeURIComponent(footstation));
                } else {
                    urlArgs = "?searchtext={0}&layers={1}&mileseries={2}&footstation={3}".format(encodeURIComponent(searchText), layerIds,
                                            mileseries, encodeURIComponent(footstation));
                }
                $.ajax({
                    type: 'GET',
                    headers: { "Authorization": self.sessionToken },
                    url: '/api/' + self.LINEARREFSEARCHENDPOINT + urlArgs,
                    async: true,
                    success: successCallback,
                    error: errorCallback
                });
            };

            self.getUserUiConfig = function (successHandler, errorHandler) {
                $.ajax({
                    type: 'GET',
                    url: '/api/' + self.USERCONFIGENDPOINT,
                    headers: { "authorization": self.sessionToken },
                    contentType: 'application/octet-stream; charset=utf-8',
                    success: successHandler,
                    error: errorHandler
                });
            };

            self.doGet = function (pageUri, successHandler, errorHandler) {
                $.ajax({
                    type: 'GET',
                    headers: { "Authorization": self.sessionToken },
                    url: pageUri,
                    async: true,
                    success: successHandler,
                    error: errorHandler
                });
            };

            self.doDelete = function (pageUri, successHandler, errorHandler) {
                $.ajax({
                    type: 'DELETE',
                    headers: { "Authorization": self.sessionToken },
                    url: pageUri,
                    async: true,
                    success: successHandler,
                    error: errorHandler
                });
            };

            self.doDeleteMany = function (pageUri, ids, successHandler, errorHandler) {
                $.ajax({
                    type: 'DELETE',
                    headers: { "Authorization": self.sessionToken },
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
                    headers: { "authorization": self.sessionToken },
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json',
                    data: JSON.stringify(items)
                });
            };

            self.getPostGisDataSets = function (successHandler, errorHandler, filter, operator) {
                self.search(self.POSTGISDATASETSENDPOINT, successHandler, errorHandler, filter, operator);
            };

            self.addPostGisDataSet = function (record, successHandler, errorHandler) {
                $.ajax({
                    type: 'POST',
                    url: '/api/' + self.POSTGISDATASETSENDPOINT,
                    contentType: 'application/json',
                    headers: { "authorization": self.sessionToken },
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json',
                    data: JSON.stringify(record)
                });

            };

            self.updatePostGisDataSet = function (record, successHandler, errorHandler) {
                $.ajax({
                    type: 'PUT',
                    url: '/api/' + self.POSTGISDATASETSENDPOINT + '/' + record.uuid,
                    contentType: 'application/json',
                    headers: { "authorization": self.sessionToken },
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json',
                    data: JSON.stringify(record)
                });
            };

            self.deletePostGisDataSet = function (record, successHandler, errorHandler) {
                var url = '/api/' + self.POSTGISDATASETSENDPOINT + '/' + record.uuid;
                self.doDelete(url, successHandler, errorHandler);
            };


            self.getPostGisMapLayers = function (successHandler, errorHandler, filter, operator) {
                self.search(self.POSTGISMAPLAYERSENDPOINT, successHandler, errorHandler, filter, operator);
            };

            self.addPostGisMapLayer = function (record, successHandler, errorHandler) {
                $.ajax({
                    type: 'POST',
                    url: '/api/' + self.POSTGISMAPLAYERSENDPOINT,
                    contentType: 'application/json',
                    headers: { "authorization": self.sessionToken },
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json',
                    data: JSON.stringify(record)
                });

            };

            self.updatePostGisMapLayer = function (record, successHandler, errorHandler) {
                $.ajax({
                    type: 'PUT',
                    url: '/api/' + self.POSTGISMAPLAYERSENDPOINT + '/' + record.uuid,
                    contentType: 'application/json',
                    headers: { "authorization": self.sessionToken },
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json',
                    data: JSON.stringify(record)
                });
            };

            self.deletePostGisMapLayer = function (record, successHandler, errorHandler) {
                var url = '/api/' + self.POSTGISMAPLAYERSENDPOINT + '/' + record.uuid;
                self.doDelete(url, successHandler, errorHandler);
            };

            self.getGmeLayers = function (successHandler, errorHandler, filter, operator) {
                self.search(self.GMELAYERSENDPOINT, successHandler, errorHandler, filter, operator);
            };

            self.addGmeLayer = function (gmeLayer, successHandler, errorHandler) {
                $.ajax({
                    type: 'POST',
                    url: '/api/' + self.GMELAYERSENDPOINT,
                    contentType: 'application/json',
                    headers: { "authorization": self.sessionToken },
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json',
                    data: JSON.stringify(gmeLayer)
                });
            };

            self.updateGmeLayer = function (gmeLayer, successHandler, errorHandler) {
                $.ajax({
                    type: 'PUT',
                    url: '/api/' + self.GMELAYERSENDPOINT + '/' + gmeLayer.uuid,
                    contentType: 'application/json',
                    headers: { "authorization": self.sessionToken },
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json',
                    data: JSON.stringify(gmeLayer)
                });
            };

            self.deleteGmeLayer = function (gmeLayer, successHandler, errorHandler) {
                var url = '/api/' + self.GMELAYERSENDPOINT + '/' + gmeLayer.uuid;
                self.doDelete(url, successHandler, errorHandler);
            };

            self.getUser = function (uuid, successHandler, errorHandler) {
                var url = '/api/' + self.USERSENDPOINT + '/' + uuid;
                self.doGet(url, successHandler, errorHandler);
            };

            self.getUserBySubId = function (subid, successHandler, errorHandler) {
                var filter = "googlesubid:" + subid;
                self.search(self.USERSENDPOINT, successHandler, errorHandler, filter);
            };

            self.getUsers = function (successHandler, errorHandler, filter, operator) {
                self.search(self.USERSENDPOINT, successHandler, errorHandler, filter, operator);
            };

            self.search = function (endpoint, successHandler, errorHandler, filter, operator) {
                var uri = '/api/' + endpoint;

                if (filter) {
                    uri += "?filter=" + filter;
                }

                if (operator) {
                    uri += "&operator=" + operator;
                }

                self.doGet(uri, successHandler, errorHandler);
            };

            // Users ---------------------
            self.updateUser = function (user, successHandler, errorHandler) {
                $.ajax({
                    type: 'PUT',
                    url: '/api/users/users/' + user.uuid,
                    contentType: 'application/json',
                    headers: { "authorization": self.sessionToken },
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json',
                    data: JSON.stringify(user)
                });
            };

            self.updateUsers = function (users, successHandler, errorHandler) {
                self.doPutMany('api/' + self.USERSENDPOINT, users, successHandler, errorHandler);
            };

            self.addUser = function (user, successHandler, errorHandler) {
                $.ajax({
                    type: 'POST',
                    url: '/api/users/users/',
                    contentType: 'application/json',
                    headers: { "authorization": self.sessionToken },
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json',
                    data: JSON.stringify(user)
                });
            };

            self.deleteUser = function (user, successHandler, errorHandler) {
                var url = '/api/' + self.USERSENDPOINT + '/' + user.uuid;
                self.doDelete(url, successHandler, errorHandler);
            };

            self.deleteUsers = function (userIds, successHandler, errorHandler) {
                var url = '/api/' + self.USERSENDPOINT;
                self.doDeleteMany(url, userIds, successHandler, errorHandler);
            };

            //Siteviews --------------------

            self.getSiteView = function (successHandler, errorHandler, siteviewId, getDeep) {
                if (!getDeep)
                    getDeep = false;
                $.ajax({
                    type: 'GET',
                    url: '/api/' + self.SITEVIEWENDPOINT + "/" + siteviewId + "?deep=" + getDeep,
                    headers: { "authorization": self.sessionToken },
                    success: successHandler,
                    error: errorHandler
                });
            };

            self.getSiteViews = function (successHandler, errorHandler, filter, operator) {
                self.search(self.SITEVIEWENDPOINT, successHandler, errorHandler, filter, operator);
            };

            self.updateSiteView = function (siteView, successHandler, errorHandler) {
                $.ajax({
                    type: 'PUT',
                    url: '/api/' + self.SITEVIEWENDPOINT + "/" + siteView.uuid,
                    contentType: 'application/json',
                    headers: { "authorization": self.sessionToken },
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json',
                    data: JSON.stringify(siteView)
                });
            };

            self.updateSiteViews = function (siteViews, successHandler, errorHandler) {
                self.doPutMany('/api/' + self.SITEVIEWENDPOINT, siteViews, successHandler, errorHandler);
            };

            self.addSiteView = function (siteView, successHandler, errorHandler) {
                $.ajax({
                    type: 'POST',
                    url: '/api/' + self.SITEVIEWENDPOINT,
                    contentType: 'application/json',
                    headers: { "authorization": self.sessionToken },
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json',
                    data: JSON.stringify(siteView)
                });
            };

            self.deleteSiteView = function (siteView, successHandler, errorHandler) {
                var url = '/api/' + self.SITEVIEWENDPOINT + '/' + siteView.uuid;
                self.doDelete(url, successHandler, errorHandler);
            };

            self.deleteSiteViews = function (ids, successHandler, errorHandler) {
                var url = '/api/' + self.SITEVIEWENDPOINT;
                self.doDeleteMany(url, ids, successHandler, errorHandler);
            };

            //Organizations ---------------
            self.getOrganizations = function (successHandler, errorHandler, filter, operator) {
                self.search(self.ORGANIZATIONSENDPOINT, successHandler, errorHandler, filter, operator);
            };

            self.updateOrganization = function (org, successHandler, errorHandler) {
                $.ajax({
                    type: 'PUT',
                    url: '/api/' + self.ORGANIZATIONSENDPOINT + "/" + org.uuid,
                    contentType: 'application/json',
                    headers: { "authorization": self.sessionToken },
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json',
                    data: JSON.stringify(org)
                });
            };

            self.updateOrganizations = function (orgs, successHandler, errorHandler) {
                self.doPutMany('/api/' + self.ORGANIZATIONSENDPOINT, orgs, successHandler, errorHandler);
            };

            self.addOrganization = function (org, successHandler, errorHandler) {
                $.ajax({
                    type: 'POST',
                    url: '/api/' + self.ORGANIZATIONSENDPOINT,
                    contentType: 'application/json',
                    headers: { "authorization": self.sessionToken },
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json',
                    data: JSON.stringify(org)
                });
            };

            self.deleteOrganization = function (org, successHandler, errorHandler) {
                var url = '/api/' + self.ORGANIZATIONSENDPOINT + '/' + org.uuid;
                self.doDelete(url, successHandler, errorHandler);
            };

            self.deleteOrganizations = function (ids, successHandler, errorHandler) {
                var url = '/api/' + self.ORGANIZATIONSENDPOINT;
                self.doDeleteMany(url, ids, successHandler, errorHandler);
            };


            //Linear Reference Layers ----------------
            self.getLinearRefLayers = function (successHandler, errorHandler, filter, operator) {
                self.search(self.LINEARREFLAYERSENDPOINT, successHandler, errorHandler, filter, operator);
            };

            self.updateLinearRefLayer = function (layer, successHandler, errorHandler) {
                $.ajax({
                    type: 'PUT',
                    url: '/api/' + self.LINEARREFLAYERSENDPOINT + "/" + layer.uuid,
                    contentType: 'application/json',
                    headers: { "authorization": self.sessionToken },
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json',
                    data: JSON.stringify(layer)
                });

            };

            //note: nlm - 2014/12/31 - Not implemented on server
            //self.updateLinearRefLayers = function (layers, successHandler, errorHandler) { };

            self.addLinearRefLayer = function (layer, successHandler, errorHandler) {
                $.ajax({
                    type: 'POST',
                    url: '/api/' + self.LINEARREFLAYERSENDPOINT,
                    contentType: 'application/json',
                    headers: { "authorization": self.sessionToken },
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json',
                    data: JSON.stringify(layer)
                });
            };

            self.deleteLinearRefLayer = function (layer, successHandler, errorHandler) {
                var url = '/api/' + self.LINEARREFLAYERSENDPOINT + '/' + layer.uuid;
                self.doDelete(url, successHandler, errorHandler);
            };

            //note: nlm - 2014/12/31 - Not implemented on server
            //self.deleteLinearRefLayers = function (ids, successHandler, errorHandler) {
            //    var url = '/api/' + self.LINEARREFLAYERSENDPOINT;
            //    self.doDeleteMany(url, ids, successHandler, errorHandler);
            //};


            self.createDomainuser = function (users, successHandler, errorHandler) {
                users = {
                    "user": {
                        "name": {
                            "familyName": "testerton",
                            "givenName": "testy"
                        },
                        "password": "test1234",
                        "primaryEmail": "testy.testerton@dev.pipelinecloud.com",
                        "emails": [{
                            "primary": false,
                            "address": "daniel.frank@willbros.com"
                        }],
                        "changePasswordAtNextLogin": true

                    }
                };
                var payload = JSON.stringify(users);
                $.ajax({
                    type: 'POST',
                    url: '/api/' + self.CREATEDOMAINUSERSENDPOINT,
                    contentType: 'application/json',
                    headers: { "authorization": self.sessionToken },
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json',
                    data: payload
                });
            };

            self.createReplicationJob = function (jobData, successHandler, errorHandler) {
                var payload = JSON.stringify(jobData);
                $.ajax({
                    type: 'POST',
                    url: '/api/' + self.REPLICATIONJOBENDPOINT,
                    contentType: 'application/json',
                    headers: { "authorization": self.sessionToken },
                    success: successHandler,
                    error: errorHandler,
                    processData: false,
                    dataType: 'json',
                    data: payload
                });
            };

            self.getReplicationJob = function (jobId, successHandler, errorHandler) {
                $.ajax({
                    type: 'GET',
                    url: '/api/' + self.REPLICATIONJOBENDPOINT + "/" + jobId,
                    headers: { "authorization": self.sessionToken },
                    success: successHandler,
                    error: errorHandler
                });
            };

            self.getReplicationJobs = function (successHandler, errorHandler) {
                $.ajax({
                    type: 'GET',
                    url: '/api/' + self.REPLICATIONJOBENDPOINT,
                    headers: { "authorization": self.sessionToken },
                    success: successHandler,
                    error: errorHandler
                });
            };

            self.uploadFile = function (formData, successCallback, errorCallback) {
                $.ajax({
                    headers: { "Authorization": self.sessionToken },
                    url: '/api/files/kml/uploads',
                    type: 'POST',
                    data: formData,
                    mimeType: "multipart/form-data",
                    contentType: false,
                    cache: false,
                    dataType: 'json',
                    processData: false,
                    success: successCallback,
                    error: errorCallback
                });
            };

            self.exportKml = function (features, successCallback, errorCallback) {
                $.ajax({
                    type: 'POST',
                    url: '/api/gis/drawings',
                    contentType: 'application/json',
                    headers: { "authorization": self.sessionToken },
                    success: successCallback,
                    error: errorCallback,
                    processData: false,
                    dataType: 'json',
                    data: JSON.stringify(features)
                });
            };

            self.importGeoJson = function (id, successCallback, errorCallback) {
                self.doGet('/api/gis/drawings/' + id + '/geojson', successCallback, errorCallback);
            };
        };
    });