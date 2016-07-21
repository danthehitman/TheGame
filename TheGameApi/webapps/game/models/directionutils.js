define(['ko'], function (ko) {
    var self = this;

    self.dirService = null;

    self.initialize = function () {
        self.dirService = new google.maps.DirectionsService();
    };

    self.showDrivingDirections = function (fromLatLng, toLatLng) {
        var url = "http://maps.google.com/?saddr=" + fromLatLng.lat().toFixed(6) + "," + fromLatLng.lng().toFixed(6) +
            "&daddr=" + toLatLng.lat().toFixed(6) + "," + toLatLng.lng().toFixed(6);
        var win = window.open(url);
    };

    self.requestDrivingDirections = function (start, end, callback) {
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };
        self.dirService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                callback(response);
            }
        });
    };

    self.createLatLng = function (lat, lng) {
        var latlng = new google.maps.LatLng(
                                        parseFloat(lat),
                                        parseFloat(lng));
        return latlng;
    };

    return {
        initialize: self.initialize,
        showDrivingDirections: self.showDrivingDirections,
        requestDrivingDirections: self.requestDrivingDirections,
        createLatLng: self.createLatLng
    };
});