define(['ko','geojson'],
    function (ko) {
        return function measureToolViewModel() {
            var self = this;
            self.appViewModel = null;
            self.mapService = null;

            self.measureDistanceUnits = {
                feet: "ft",
                miles: 'mi',
                meters: 'm',
                kilometers: 'km'
            };

            self.currentSegmentMeasureDistanceUnits = self.measureDistanceUnits.feet;
            self.totalMeasureDistanceUnits = self.measureDistanceUnits.feet;
            self.userSelectedUnits = ko.observable(self.measureDistanceUnits.feet);
            self.measurePoly = null;
            self.measureMarker1 = null;
            self.measureMarker2 = null;
            self.measureMarker1Label = null;
            self.measureMarker2Label = null;
            self.isMeasuring = ko.observable(false);
            self.totalMeasureDistance = ko.observable("");
            self.lastMeasureSegmentDistance = ko.observable("");

            self.initialize = function (mapServiceArg, appViewModelArg) {
                self.appViewModel = appViewModelArg;
                self.mapService = mapServiceArg;
                self.setupEventSubscriptions();
                return self;
            };

            self.setupEventSubscriptions = function () {
                self.totalMeasureDistance.subscribe(self.onTotalMeasureDistanceChanged);
                self.userSelectedUnits.subscribe(self.onUserSelectedUnitsChanged);
            };

            self.setIsMeasuring = function (value) {
                self.isMeasuring(value);
                if (value) {
                    if (self.measurePoly == null) {
                        self.addRuler();
                    }
                }
            };

            self.clearRuler = function () {
                if (self.measureMarker1 != null) {
                    self.measureMarker1.setMap(null);
                    self.measureMarker1 = null;
                }
                if (self.measureMarker2 != null) {
                    self.measureMarker2.setMap(null);
                    self.measureMarker2 = null;
                }
                if (self.measureMarker1Label != null) {
                    self.measureMarker1Label.setMap(null);
                    self.measureMarker1Label = null;
                }
                if (self.measureMarker2Label != null) {
                    self.measureMarker2Label.setMap(null);
                    self.measureMarker2Label = null;
                }
                if (self.measurePoly != null) {
                    self.measurePoly.setMap(null);
                    self.measurePoly = null;
                }
                if (self.isMeasuring()) {
                    self.addRuler();
                }
            };

            self.addRuler = function () {
                self.totalMeasureDistance("0" + self.userSelectedUnits());
                self.lastMeasureSegmentDistance("0" + self.userSelectedUnits());

                if (self.measurePoly != null) {
                    self.measurePoly.overlay.setMap(null);
                }

                var map = self.mapService.getMap();

                self.measureMarker1 = new google.maps.Marker({
                    position: map.getCenter(),
                    map: map,
                    icon: {
                        url: 'images/speedsquaremarker.png',
                        anchor: {
                            x: 0,
                            y: 25
                        }
                    }
                });

                self.measureMarker2 = new google.maps.Marker({
                    position: map.getCenter(),
                    map: map,
                    icon: {
                        url: 'images/speedsquaremarker.png',
                        anchor: {
                            x: 0,
                            y: 25
                        }
                    }
                });

                self.measurePoly = new google.maps.Polyline({
                    path: [self.measureMarker1.position],
                    strokeColor: "red",
                    strokeOpacity: 0.7,
                    strokeWeight: 2,
                    editable: true
                });

                google.maps.event.addListener(self.measurePoly, 'dblclick', self.onMeasurePolyDoubleClick);

                google.maps.event.addListener(self.measureMarker1, 'dragend', self.onMeasureMarkerDragEnd);

                self.measureMarker1Label = new self.appViewModel.mapViewModel.Label({ map: map });
                self.measureMarker2Label = new self.appViewModel.mapViewModel.Label({ map: map });
                self.measureMarker1Label.bindTo('position', self.measureMarker1);
                self.measureMarker2Label.bindTo('position', self.measureMarker2);

                var path = self.measurePoly.getPath();
                google.maps.event.addListener(path, 'insert_at', self.onMeasurePolyPathChanged);
                google.maps.event.addListener(path, 'remove_at', self.onMeasurePolyPathChanged);
                google.maps.event.addListener(path, 'set_at', self.onMeasurePolyPathChanged);

                self.measurePoly.setMap(map);

                self.measureMarker1Label.set('text', "0" + self.userSelectedUnits());
                self.measureMarker2Label.set('text', "0" + self.userSelectedUnits());
            };

            self.onTotalMeasureDistanceChanged = function () {
                if (self.measureMarker1Label != null) {
                    self.measureMarker1Label.set('text', self.totalMeasureDistance());
                }
                if (self.measureMarker2Label != null) {
                    self.measureMarker2Label.set('text', self.totalMeasureDistance());
                }
            };

            self.onMeasureMapClick = function (newPoint) {
                self.measurePoly.getPath().push(newPoint);
            };

            self.onMeasurePolyPathChanged = function () {
                self.measureMarker1.setPosition(self.measurePoly.getPath().getAt(0));
                self.measureMarker2.setPosition(self.measurePoly.getPath().getAt(self.measurePoly.getPath().getLength() - 1));
                self.updateMeasureDistance();
            };

            self.onMeasurePolyDoubleClick = function (event) {
                if (event.vertex != null) {
                    if (self.measurePoly.getPath().getLength() > 2) {
                        self.measurePoly.getPath().removeAt(event.vertex);
                    }
                }
            };

            self.updateMeasureDistance = function () {
                self.totalMeasureDistance(self.getMeasurePolyTotalDistance() + self.totalMeasureDistanceUnits);
                self.lastMeasureSegmentDistance(self.getLastMeasureSegmentDistance() + self.currentSegmentMeasureDistanceUnits);
            };

            self.getLastMeasureSegmentDistance = function () {
                var path = self.measurePoly.getPath();
                var distance = 0;
                if (path.getLength() > 1) {
                    var point1 = path.getAt(path.getLength() - 2);
                    var point2 = path.getAt(path.getLength() - 1);
                    distance = self.distance(point1.lat(), point1.lng(), point2.lat(), point2.lng());
                }
                if (distance / 1000 > 1) {
                    distance = self.getKilometersMilesDistance(distance);

                    self.currentSegmentMeasureDistanceUnits = self.userSelectedUnits() == self.measureDistanceUnits.feet ?
                        self.measureDistanceUnits.miles : self.measureDistanceUnits.kilometers;
                }
                else {
                    if (self.userSelectedUnits() == self.measureDistanceUnits.feet) {
                        distance = self.getFeetFromMeters(distance);
                    }

                    self.currentSegmentMeasureDistanceUnits = self.userSelectedUnits() == self.measureDistanceUnits.feet ?
                        self.measureDistanceUnits.feet : self.measureDistanceUnits.meters;
                }
                return distance.toFixed(1);
            };

            self.getMeasurePolyTotalDistance = function () {
                var totalDistance = 0;
                var path = self.measurePoly.getPath();
                for (var index = 1, len = path.length; index < len; index++) {
                    //note: intentionally skipping first element
                    var element = path.getAt(index);
                    var previousPoint = path.getAt(index - 1);
                    totalDistance += self.distance(element.lat(), element.lng(), previousPoint.lat(), previousPoint.lng());
                }
                if (totalDistance / 1000 > 1) {
                    totalDistance = self.getKilometersMilesDistance(totalDistance);

                    self.totalMeasureDistanceUnits = self.userSelectedUnits() == self.measureDistanceUnits.feet ?
                        self.measureDistanceUnits.miles : self.measureDistanceUnits.kilometers;
                }
                else {
                    if (self.userSelectedUnits() == self.measureDistanceUnits.feet) {
                        totalDistance = self.getFeetFromMeters(totalDistance);
                    }

                    self.totalMeasureDistanceUnits = self.userSelectedUnits() == self.measureDistanceUnits.feet ?
                        self.measureDistanceUnits.feet : self.measureDistanceUnits.meters;
                }
                return totalDistance.toFixed(1);
            };

            self.onUserSelectedUnitsChanged = function () {
                self.updateMeasureDistance();
            };

            self.distance = function (lat1, lon1, lat2, lon2) {

                //From StackOverflow: http://stackoverflow.com/questions/1502590/calculate-distance-between-two-points-in-google-maps-v3
                //var R = 6378137; // Earth’s mean radius in meter
                //var dLat = rad(p2.lat() - p1.lat());
                //var dLong = rad(p2.lng() - p1.lng());
                //var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                //  Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
                //  Math.sin(dLong / 2) * Math.sin(dLong / 2);
                //var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                //var d = R * c;
                //return d; // returns the distance in meter

                //Original: DEF: this was something I hacked together from different sources.
                //var R = 6371; //Earts Radius in KM.
                //var dLat = (lat2 - lat1) * Math.PI / 180;
                //var dLon = (lon2 - lon1) * Math.PI / 180;
                //var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                //    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                //    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                //var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                ////Distance in KM.
                //var d = R * c;

                var R = 6378137; //Earts Radius in KM.
                var dLat = (lat2 - lat1) * Math.PI / 180;
                var dLon = (lon2 - lon1) * Math.PI / 180;
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                //Distance in meters.
                var d = R * c;

                return d;
            };

            self.getKilometersMilesDistance = function (dMeters) {
                var d = dMeters / 1000;
                if (self.userSelectedUnits() == self.measureDistanceUnits.feet) {
                    d = d * 0.621371;
                }
                return d;
            };

            self.getFeetFromMeters = function (meters) {
                return meters * 3.28084;
            };
        };
    });