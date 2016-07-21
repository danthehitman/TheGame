define(['knockout', 'pubsub', 'utils', 'ilapi', 'toolboxViewModel', 'southContentViewModel', 'notificationViewModel', 'redLineViewModel', 'userGeoLocation',
    'ilapi', 'fadeVisible', 'slideVisible', 'jqueryFileDownload'],
    function (ko, pubsub, utils, Ilapi, ToolboxViewModel, SouthContentViewModel, NotificationViewModel, RedLineViewModel, userGeoLocation) {
        return function appViewModel() {
            var self = this;

            self.integraApi = new Ilapi();
            // Constants==================================================================================
            self.LOGIN_TEXT = "Login";
            self.LOGOUT_TEXT = "";
            self.AUTHORIZING_TEXT = "Authorizing";
            self.AUTH_BUTTON_ENABLED_COLOR = 'white';
            self.AUTH_BUTTON_DISABLED_COLOR = 'gray';
            self.AUTH_BUTTON_HOVER_CURSOR_DISABLED = 'default';
            self.AUTH_BUTTON_HOVER_CURSOR_ENABLED = 'pointer';
            self.NOTIFICATION_HISTORY_BUTTON_TOOLTIP = "view notification history";

            // View Models==================================================================================
            self.toolboxViewModel = null;
            self.mapSettings = null;
            self.southContentViewModel = null;
            self.notificationViewModel = null;
            self.redlineViewModel = null;

            // App Variables==================================================================================
            self.miniMode = ko.observable(false);
            self.showMobileHeader = ko.observable(false);
            self.isMobile = ko.observable(false);
            self.hasGeolocation = userGeoLocation.hasGeoLocation; //Assigns reference to ko-observable???
            self.sessionToken = ko.observable(null);
            self.trackCurrentLocation = ko.observable(false);
            self.showLoginSplashScreen = ko.observable(false);
            self.configurationLoaded = ko.observable();
            self.currentUser = ko.observable("");
            self.appDataObject = null;
            self.currentUserShort = ko.computed(function () { return self.currentUser().split('@')[0]; });
            self.showSearchResultsIcon = ko.observable(false);
            self.userConnected = ko.observable(false);
            self.authButtonText = ko.observable(self.LOGIN_TEXT);
            self.loginErrorMessage = ko.observable(null);
            self.authButtonColor = ko.observable(self.AUTH_BUTTON_ENABLED_COLOR);
            self.authButtonHoverCursor = ko.observable(self.AUTH_BUTTON_HOVER_CURSOR_ENABLED);

            self.activate = function () {

                $(document).tooltip({
                    tooltipClass: "tooltips",
                    show: {
                        effect: "slideDown",
                        delay: 1000
                    },
                    items: "[iltooltip]",
                    content: function () {
                        var element = $(this);
                        if (element.is("[iltooltip]")) {
                            var text = element.attr("iltooltip");
                            return text;
                        }
                    }
                });
                $.ajaxSetup({ cache: false });

                self.createViewModels();
                self.setupEventSubscriptions();
                self.notificationViewModel = new NotificationViewModel(self).initialize();
                self.checkState();
            };

            self.initialize = function () {
                self.isMobile(utils.isMobile.any());
                self.initViewModels();
                self.notificationViewModel.notify("Initializing...");
                //TODO: DEF Need a more elegant solution here.
                self.checkHeadSize();
                self.loadSettings();
            };

            self.initializeGoogleApis = function () {
                self.mapSettings = new mapapSettings().initialize();
                var appConfig = self.appDataObject;
                var browserKey = self.mapSettings.browserkey;

                require(['async!https://maps.googleapis.com/maps/api/js?v=3&sensor=false&libraries=places,visualization,drawing&key={0}'.format(browserKey)], function () {
                    self.googleApisLoaded();
                });
            };

            self.createViewModels = function () {
                self.toolboxViewModel = new ToolboxViewModel();
                self.southContentViewModel = new SouthContentViewModel();
                self.redlineViewModel = new RedLineViewModel();
            };

            self.initViewModels = function () {
                userGeoLocation.initialize();
                self.toolboxViewModel.initialize(self);
                self.southContentViewModel.initialize(self.integraApi, self);
                self.redlineViewModel.initialize(self.integraApi, self);
            };

            self.loadSettings = function () {
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    self.trackCurrentLocation(true);
                }
            };

            // This method is used to see if we are returning from the google auth service or not.  If we have a code
            // we will try and connect the user and get a session.  We also grab any state variables off of the query
            // string and load them here.
            self.checkState = function () {
                self.sessionToken(utils.getSessionCookie());
                if (self.sessionToken() != null) {
                    self.integraApi.checkSessionState(self.checkSessionSuccessCallback, self.checkSessionErrorCallback);
                } else {
                    var code = utils.getUriParameterByName('code');
                    if (code) {
                        self.integraApi.getSessionToken(code, self.userConnectedHandler, self.connectionErrorHandler);
                        //  Log the code in the console but dont show the user.
                        self.notificationViewModel.notify(code, true);
                    } else {
                        self.connectionErrorHandler();
                    }
                }
            };

            // Initialize all event subscriptions.
            self.setupEventSubscriptions = function () {
                // DOM
                $(window).resize(self.handleWindowResize);

                // Knockout
                self.sessionToken.subscribe(self.onSessionTokenChanged);
                self.trackCurrentLocation.subscribe(self.onTrackCurrentLocationChanged);
            };

            // Callback Handlers==============================================================================
            self.checkSessionSuccessCallback = function () {
                self.userConnectedHandler(self.sessionToken());
                self.integraApi.refreshGoogleToken();
            };

            self.checkSessionErrorCallback = function (result) {
                var connectionMessage = "There was an error while renewing the session token.";
                if (result.status == "403") {
                    connectionMessage = "Session expired.";
                }
                self.connectionErrorHandler({ 'responseText': connectionMessage });
            };

            //Event Handlers==================================================================================
            self.onApiError = function (error) {
                if (error.responseJSON != null && error.responseJSON["detail"] === "Session is not valid.") {
                    self.notificationViewModel.notify("Session expired.  Please login to continue.");
                    self.resetAppState();
                } else {
                    self.notificationViewModel.notify(error.responseText);
                }
            };

            self.handleWindowResize = function () {
                self.checkHeadSize();
                self.southContentViewModel.windowResized();
            };

            //TODO: DEF All of this new mobile header stuff needs to be in an auto closing view model thingy.  Need to formalize the mobile design implemenation strategy.
            self.checkHeadSize = function () {
                var docWidth = $(document).width();
                if (docWidth < 650) {
                    self.miniMode(true);
                }
                else {
                    self.miniMode(false);
                }
            };

            self.toggleShowMobileHeader = function () {
                self.showMobileHeader(!self.showMobileHeader());
            };

            self.getHeaderDisplayVal = ko.computed(function () {
                if (self.miniMode() == true) {
                    if (!self.showMobileHeader()) {
                        return 'none';
                    }
                }
                return 'inline-block';
            });

            // Once the user is connected (i.e. we have a session) we need to get the users uiconfig.
            self.userConnectedHandler = function (data) {
                self.notificationViewModel.notify("Connected.  Retrieving ui configuration...");
                self.sessionToken(data);
                self.userConnected(true);
                self.integraApi.getUserUiConfig(self.configurationLoadedHandler, self.configurationErrorHandler);
                self.updateAuthButtonText();
            };

            self.userDisconnectedHandler = function () {
                utils.deleteSessionCookie();
                self.resetAppState();
                self.notificationViewModel.notify("Goodbye.");
            };

            self.connectionErrorHandler = function (error) {
                self.userConnected(false);
                self.currentUser("");
                if (error != null && error.responseText != null) {
                    self.notificationViewModel.notify(error.responseText);
                    self.setLoginFailureMessage(error.responseText);
                }
                self.updateAuthButtonText();
                self.enableAuthButton();
                self.resetAppState();
            };

            self.setLoginFailureMessage = function (errorMessage) {
                if (errorMessage == null) {
                    self.loginErrorMessage(errorMessage);
                    return;
                }

                var notRegistered = '"NOT_REGISTERED email: ';
                if (errorMessage.startsWith(notRegistered)) {
                    var temp = errorMessage.substr(notRegistered.length);
                    var temp = temp.substr(0, temp.length - 1);
                    self.loginErrorMessage(temp + " is not registered.");
                }
                else
                    self.loginErrorMessage(errorMessage);
            };

            self.configurationLoadedHandler = function (data) {
                self.appDataObject = data;
                self.initializeGoogleApis();
            };

            self.googleApisLoaded = function (message) {
                self.initialize();
                var appConfig = self.appDataObject;
                if (appConfig != null) {
                    if (appConfig.accesstoken) {
                        self.notificationViewModel.notify("Access Token: " + appConfig.accesstoken.token);
                        self.mapViewModel.accessToken(appConfig.accesstoken.token);
                    } else {
                        self.notificationViewModel.notify("No access token was returned.  GME layers cannot be loaded.");
                    }
                    // Schedule the initial refresh of the access token with the ilapi.
                    window.setTimeout(function () { self.integraApi.refreshGoogleToken(); }, appConfig.accesstoken.expires_in * 900);

                    self.notificationViewModel.notify("Welcome.");
                    self.currentUser(appConfig.user.username);

                    self.configurationLoaded(true);
                }
            };

            self.configurationErrorHandler = function (error) {
                self.notificationViewModel.notify("An error occured while loading the configuration.");
                self.notificationViewModel.notify(error.responseText);
            };

            // Whenever we have a session token change we need to set the token on the ilapi object.
            self.onSessionTokenChanged = function () {
                self.integraApi.sessionToken = self.sessionToken();
                utils.storeSessionCookie(self.sessionToken());
                window.console.log(self.sessionToken());
            };

            // Methods==================================================================================

            // Map Stuff

            self.onTrackCurrentLocationChanged = function () {
                self.mapViewModel.trackCurrentLocation(self.trackCurrentLocation());
                self.appsButtonViewModel.updateTrackLocationCookie(self.trackCurrentLocation());
            };

            // Auth Button Stuff
            self.handleAuthButtonClick = function () {
                self.disableAuthButton();
                if (self.userConnected()) {
                    self.notificationViewModel.notify("Disconnecting...");
                    self.integraApi.invalidateSessionToken(self.userDisconnectedHandler, self.connectionErrorHandler);
                }
                else {
                    self.notificationViewModel.notify("Connecting...");
                    utils.deleteSessionCookie();
                    self.integraApi.initializeAppsAuthorization();
                }
            };

            self.updateAuthButtonText = function () {
                if (self.userConnected() === false) {
                    self.authButtonText(self.LOGIN_TEXT);
                } else {
                    self.authButtonText(self.LOGOUT_TEXT);
                }
                self.enableAuthButton();
            };

            self.disableAuthButton = function () {
                self.authButtonHoverCursor(self.AUTH_BUTTON_HOVER_CURSOR_DISABLED);
                self.authButtonColor(self.AUTH_BUTTON_DISABLED_COLOR);
                self.authButtonText(self.AUTHORIZING_TEXT);
            };
            self.enableAuthButton = function () {
                self.authButtonHoverCursor(self.AUTH_BUTTON_HOVER_CURSOR_ENABLED);
                self.authButtonColor(self.AUTH_BUTTON_ENABLED_COLOR);
            };

            // The user object sent to the user update api requires ids
            // for organization and siteviews as opposed to the full objects.
            // This may change.
            self.getCurrentUserObjectForWrite = function () {
                var userObjForWrite = $.extend(true, {}, self.appDataObject.user);
                if (userObjForWrite != null) {
                    var siteViewIds = [],
                        i;
                    for (i = 0; i < userObjForWrite.siteviews.length; i++) {
                        siteViewIds.push(userObjForWrite.siteviews[i].uuid);
                    }
                    if (self.appDataObject.user.organization != null) {
                        userObjForWrite.organization = self.appDataObject.user.organization.uuid;
                    }
                    userObjForWrite.siteviews = siteViewIds;
                }
                return userObjForWrite;
            };

            self.resetAppState = function () {
                self.showLoginSplashScreen(true);
                self.userConnected(false);
                self.configurationLoaded(false);
                self.updateAuthButtonText();
                self.currentUser("");
                self.mapViewModel.resetAppState();
                self.toolboxViewModel.reset();
            };

            self.iframeVisible = ko.observable(false);
            self.iframeUrl = ko.observable();
            self.showIframe = function (url) {
                self.iframeVisible(true);
                if (url != null) {
                    self.iframeUrl(url);
                }
            };
            self.hideIframe = function () {
                self.iframeVisible(false);
                self.iframeUrl("");
            };
        };
    });