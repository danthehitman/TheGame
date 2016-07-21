define(['ko', 'directionUtils'],
    function (ko, directionUtils) {
        var self = this;

        //constants
        //Number of milliseconds for timeout of getCurrentLocation calls
        self.timeout = 360000;
        ///Specifies if high accuracy is enable
        self.highAccuracy = false;
        //Specifies the maximum age of caches locations that can be used
        self.cacheMaxAge = 360000;
        //Active timeout constant
        self.inactiveInterval = 2000;

        //Members
        self.hasGeoLocation = ko.observable(navigator.geolocation != null);
        self.geoWatchId = null;
        self.mostRecentPosition = ko.observable(null);
        //Indicates if we have received a location position somewhat recently
        self.isLocationActive = ko.observable(false);
        self.inactiveTimer = null;

        self.initialize = function () {
            if (self.hasGeoLocation()) {
                try {
                    self.geoWatchId = navigator.geolocation.watchPosition(self.handleGeowatchCallback,
                        self.handleGeowatchCallback, { enableHighAccuracy: true, maximumAge: 1000, timeout: 27000 });
                } catch (ignore) { }
            }
        }

        self.endMonitorLocation = function () {
            if (!self.hasGeoLocation()) return;
            navigator.geolocation.clearWatch(self.geoWatchId);
            self.geoWatchId = null;
        }

        self.handleGeowatchCallback = function (position) {
            if (position == null || position.coords == null) return;
            self.isLocationActive(true);

            //Restart the inactive timer
            self.inactiveTimer = setTimeout(function () {
                self.isLocationActive(false);
            }, inactiveInterval);

            self.mostRecentPosition(position);
        };

        self.showDirectionsTo = function (toLatLng) {
            if (!self.hasGeoLocation()) return;
            if (self.mostRecentPosition() == null) return;

            directionUtils.showDrivingDirections(
                self.self.getCurrentLatLng(),
                toLatLng);
        };

        self.requestDirectionsTo = function (toLatLng, callback) {
            if (!self.hasGeoLocation()) return;
            if (self.mostRecentPosition() == null) return;

            directionUtils.requestDrivingDirections(
                self.getCurrentLatLng(),
                toLatLng,
                callback);
        };

        self.getCurrentLatLng = function () {
            return directionUtils.createLatLng(self.mostRecentPosition().coords.latitude, self.mostRecentPosition().coords.longitude);
        };

        return {
            //Properties
            //observable(bool), represents if browser supports geo tracking
            hasGeoLocation: self.hasGeoLocation,
            //observable(position), the most recent position of the user
            mostRecentPosition: self.mostRecentPosition,
            //observable(bool), indicates if we have recently received a location update
            isLocationActive: self.isLocationActive,

            initialize: self.initialize,
            showDirectionsTo: self.showDirectionsTo,
            requestDirectionsTo: self.requestDirectionsTo
        };
    });