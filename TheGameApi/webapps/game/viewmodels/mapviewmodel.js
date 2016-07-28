define(['ko', 'pubsub', 'guidgen', 'utils', 'userGeoLocation', 'directionUtils',
    'mapService', 'measureToolViewModel', 'ilapi', 'geojson'],
function (ko, pubsub, guidgen, utils, userGeoLocation, directionUtils, mapService, MeasureToolViewModel) {
    return function mapViewModel(integraApi, mapSettings) {
        var self = this;

        self.mapViewModelEvents = {
            mapViewModelInitialized: "map-view-model-initialized"
        };

        //Constants

        //Varibles
        self.measureToolViewModel = new MeasureToolViewModel();
        self.mapService = null;
        self.zoomTimer = null;
        self.varDoneZoomingInterval = 500;
        self.mapCoordinates = ko.observable();
        self.infoWindow = null;
        self.currentDrawing = null;
        self.drawingCallback = null;
        self.appViewModel = null;
        self.mapSettings = mapSettings;
        self.accessToken = ko.observable();
        self.defaultZoomScale = 18;
        self.highlights = {};
        self.mapMarkers = {};
        self.mapMarkerLabels = {};
        self.featureOverlays = {};
        self.directionRenderers = [];
        self.userBuffer = null;
        self.locationUpdateCount = ko.observable(0);

        self.initialize = function (appVM) {
            self.appViewModel = appVM;
            self.mapService = new mapService().initialize();
            self.measureToolViewModel.initialize(self.mapService, appVM);

            self.infoWindow = new google.maps.InfoWindow();

            self.setupEventSubscriptions();
            self.initializeLabel();

            directionUtils.initialize();

            self.directionRenderer = new google.maps.DirectionsRenderer();

            return self;
        };

        self.setupEventSubscriptions = function () {
            self.trackCurrentLocation.subscribe(self.onTrackCurrentLocationChanged);
            userGeoLocation.mostRecentPosition.subscribe(self.onUserLocationChanged);
            userGeoLocation.isLocationActive.subscribe(self.onIsLocationActiveChanged);

            pubsub.subscribe(integraApi.ilapiEvents.gapiTokenRefreshed, self.onGapiTokenRefreshed);

            google.maps.event.addListener(self.mapService.getMap(), 'click', self.onMapClicked);
            google.maps.event.addListener(self.mapService.getMap(), 'zoom_changed', self.onZoomScaleChanged);
            google.maps.event.addListener(self.mapService.getMap(), 'mousemove', function (event) {
                self.displayCoordinates(event.latLng);
            });
        };

        // Event handlers.=================================================================================================

        self.onZoomScaleChanged = function () {
            clearTimeout(self.zoomTimer);
            self.zoomTimer = setTimeout(function () {
                var zoomLevel = self.mapService.getMap().getZoom();
                window.console.log(zoomLevel);
            }, self.varDoneZoomingInterval);
        };

        self.onGapiTokenRefreshed = function (message, token) {
            self.accessToken(token);
            window.console.log(token);
        };

        self.getSearchDistance = function () {
            var distance = 0.05;
            var zoomLevel = self.mapService.getMap().getZoom();
            if (zoomLevel >= 0 && zoomLevel < 5) {
                distance = 0.016;
            } else if (zoomLevel >= 5 && zoomLevel < 15) {
                distance = 0.005;
            } else if (zoomLevel >= 15 && zoomLevel < 20) {
                distance = 0.0001;
            } else {
                distance = 0.00001;
            }
            return distance;
        };

        self.onMapClicked = function(mouseEvent) {
            if (self.measureToolViewModel.isMeasuring() === true) {
                self.measureToolViewModel.onMeasureMapClick(mouseEvent.latLng);
            }
            var clickLoc = mouseEvent.latLng;
            var position = userGeoLocation.mostRecentPosition();
            var newLatLng = self.createLatLong(position.coords.latitude, position.coords.longitude);

            //var icon = {
            //    url: "/images/drone.svg"
            //};

            //var marker = new google.maps.Marker({
            //    position: clickLoc,
            //    map: self.mapService.getMap(),
            //    draggable: false,
            //    icon: icon,
            //    zIndex: -20
            //});

            //var newLatLng = self.createLatLong(position.coords.latitude, position.coords.longitude);
            //var lineSymbol = {
            //    path: google.maps.SymbolPath.CIRCLE,
            //    scale: 8,
            //    strokeColor: '#393'
            //};

            //var line = new google.maps.Polyline({
            //    path: [newLatLng, clickLoc],
            //    icons: [
            //    {
            //        icon: icon,
            //        offset: '100%'
            //    }
            //    ],
            //    map: self.mapService.getMap()
            //});
            var heading = newLatLng.getHeading(clickLoc);
            self.animateInLine(newLatLng, 100, .01, heading);
        };

        self.animateInLine = function (startPos, times, increments, heading) {
            var newTimes = times -1;
            var nextPoint = startPos.destinationPoint(heading, increments);
            self.currentLocationMarker.setPosition(nextPoint);
            if (times > 0)
                setTimeout(function () { self.animateInLine(nextPoint, newTimes, increments, heading ); }, 100);
        };

        self.animateInCircle = function (startPos, times) {
            var newTimes = times - 1;
            var nextPoint = startPos.destinationPoint(times, .1);
            self.currentLocationMarker.setPosition(nextPoint);
            if (times > 0)
                setTimeout(function () { self.animateInCircle(startPos, newTimes); }, 200);
        };

        //Methods

        self.setMapStyle = function (styleArray) {
            self.mapService.getMap().setOptions({ styles: styleArray });
        };
        

        self.displayCoordinates = function (pnt) {
            if (pnt.lat && pnt.lng) {
                var lat = pnt.lat();
                lat = lat.toFixed(4);
                var lng = pnt.lng();
                lng = lng.toFixed(4);
                self.mapCoordinates("Latitude: " + lat + "  Longitude: " + lng);
            }
            else {
                self.mapCoordinates("Error retrieving coordinates from mouse position.");
            }
        };

        // Convienience method.  Not sure if its convenient.  Also not sure how to spell convenient.
        self.createLatLong = function (lat, long) {
            var latlng = new google.maps.LatLng(
                                parseFloat(lat),
                                parseFloat(long));
            return latlng;
        };

        self.getMapExtentAsGeoJson = function () {
            var bounds = self.mapService.getMap().getBounds();
            var path = [[]];
            path[0].push([bounds.getNorthEast().lng(), bounds.getNorthEast().lat()]);
            path[0].push([bounds.getSouthWest().lng(), bounds.getNorthEast().lat()]);
            path[0].push([bounds.getSouthWest().lng(), bounds.getSouthWest().lat()]);
            path[0].push([bounds.getNorthEast().lng(), bounds.getSouthWest().lat()]);
            path[0].push([bounds.getNorthEast().lng(), bounds.getNorthEast().lat()]);
            var geojson = {};
            geojson.type = "Polygon";
            geojson.coordinates = path;
            return JSON.stringify(geojson);
        };

        // Markers and highlights stuff.====================================================================================

        self.markerIcons = {
            userCurrentLocation: { url: "/images/usercurrentlocation.png", anchor: { x: 32, y: 32 } }
        };

        self.placeMarker = function (latlng, markerId, markerImage, markerClickCallback, label) {
            // Check for an existing marker with the id.  If we have one get rid of it.
            var marker,
                label,
                markerLabel;
            if (markerId) {
                marker = self.mapMarkers[markerId];
                label = self.mapMarkerLabels[markerId];
                if (marker) {
                    marker.setMap(null);
                    delete self.mapMarkers[markerId];
                }
                if (label) {
                    label.setMap(null);
                    delete self.mapMarkerLabels[markerId];
                }
            }
            marker = new google.maps.Marker({
                map: self.mapService.getMap(),
                position: latlng,
                icon: markerImage,
                clickable: false
            });
            //  If there are contents to show then set clickable back to true and set up the info window.
            if (markerClickCallback) {
                marker.setClickable(true);
                google.maps.event.addListener(marker, 'click', markerClickCallback);
            } else if (label) {
                markerLabel = new self.Label({ map: self.mapService.getMap() });
                markerLabel.set('zIndex', 99999);
                markerLabel.bindTo('position', marker, 'position');
                markerLabel.set('text', label);
                self.mapMarkerLabels[markerId] = markerLabel;
            }
            if (!markerId) {
                markerId = guidgen.guid();
            }
            self.mapMarkers[markerId] = marker;
            return marker;
        };

        self.clearMapMarkers = function () {
            var marker, label;
            for (marker in self.mapMarkers) {
                if (self.mapMarkers.hasOwnProperty(marker)) {
                    self.mapMarkers[marker].setMap(null);
                }
            }
            for (label in self.mapMarkerLabels) {
                if (self.mapMarkerLabels.hasOwnProperty(label)) {
                    self.mapMarkerLabels[label].setMap(null);
                }
            }
            self.mapMarkers = {};
            self.mapMarkerLabels = {};
        };

        // Create the given feature on the map.  If lock is true then it wont be replaced with the next highlight.  
        // If lock is false then the default highlight will be moved.  Assumes the geometry is geojson. Returns the created overlay.
        self.createOverlay = function (geojson, overlayId, symbolOptions, addToMap) {
            var i;

            // If we are dealing with an existing highlightID get rid of it.
            if (self.highlights[overlayId]) {
                if (geojson.type.startsWith("Multi")) {
                    //for (i = 0; i < self.highlights[overlayId].length; i++) {
                    //    self.highlights[overlayId][i].setMap(null);
                    //}
                    for (geom in self.highlights[overlayId])
                        self.highlights[overlayId][geom].setMap(null);
                } else {
                    self.highlights[overlayId].setMap(null);
                }
            }
            var geom;
            var googleOptions = null;
            if (symbolOptions) {
                googleOptions = symbolOptions;
            }
            switch (geojson.type) {
                case "Point":
                case "MultiPoint":
                    // Z of 10k to make sure we are on top.
                    if (googleOptions == null) {
                        googleOptions = {
                            icon: self.markerIcons.pointHighlightIcon,
                            zIndex: 10000,
                            clickable: false
                        };
                    }
                    geom = new GeoJSON(geojson, googleOptions);
                    self.highlights[overlayId] = geom;
                    break;
                case "LineString":
                case "MultiLineString":
                    if (googleOptions == null) {
                        googleOptions = {
                            strokeColor: '#FF0000',
                            strokeWeight: 5,
                            zIndex: 10000,
                            clickable: false
                        };
                    }
                    geom = new GeoJSON(geojson, googleOptions);
                    self.highlights[overlayId] = geom;
                    break;
                case "Polygon":
                case "MultiPolygon":
                    if (googleOptions == null) {
                        googleOptions = {
                            strokeColor: '#FF0000',
                            strokeWeight: 5,
                            zIndex: 10000,
                            clickable: false
                        };
                    }
                    geom = new GeoJSON(geojson, googleOptions);
                    self.highlights[overlayId] = geom;
                    break;
            }
            if (addToMap !== false) {
                if (geom != null && geojson.type.startsWith("Multi")) {
                    for (thisgeom in geom)
                        geom[thisgeom].setMap(self.mapService.getMap());
                }
                else if (geom != null) {
                    geom.setMap(self.mapService.getMap());
                }
            }

            return geom;
        };

        self.clearHighlights = function () {
            var highlight, j;
            for (highlight in self.highlights) {
                if (self.highlights.hasOwnProperty(highlight)) {
                    if (self.highlights[highlight] instanceof Array) {
                        for (j = 0; j < self.highlights[highlight].length; j++) {
                            self.highlights[highlight][j].setMap(null);
                        }
                    } else {
                        self.highlights[highlight].setMap(null);
                    }
                }
            }
        };

        self.zoomToPoint = function (latLng) {
            self.mapService.getMap().setCenter(latLng);
            self.mapService.getMap().setZoom(self.defaultZoomScale);
        };

        //===================Location Tracking Stuff=====================================
        self.currentLocationMarker = null;
        //Note: this is intentionally a reference to the ko-observable
        self.trackCurrentLocation = ko.observable(false);
        self.onTrackCurrentLocationChanged = function () {
            self.refreshLocationMarker();
        };

        self.onIsLocationActiveChanged = function (isActive) {
            self.refreshLocationMarker();
        };

        self.onUserLocationChanged = function (position) {
            self.refreshLocationMarker();
            self.locationUpdateCount(self.locationUpdateCount() + 1);
        }

        self.zoomCurrentLocation = function () {
            var loc = self.getCurrentLocation();
            if (loc == null) return;
            
            self.zoomToPoint(loc);
        };

        self.getCurrentLocation = function () {
            if (!userGeoLocation.hasGeoLocation()) return null;
            if (userGeoLocation.mostRecentPosition() == null) return null;

            return self.createLatLong(
                userGeoLocation.mostRecentPosition().coords.latitude,
                userGeoLocation.mostRecentPosition().coords.longitude);
        };

        self.refreshLocationMarker = function () {
            if (userGeoLocation.hasGeoLocation() &&
                userGeoLocation.mostRecentPosition() != null
                && self.trackCurrentLocation()) {
                self.addOrUpdateLocationMarker();
            }
            else {
                self.removeLocationMarker();
            }
        };

        self.removeLocationMarker = function () {
            if (self.currentLocationMarker == null) return;
            self.currentLocationMarker.setMap(null);
            self.currentLocationMarker = null;
        };

        self.addOrUpdateLocationMarker = function () {
            var position = userGeoLocation.mostRecentPosition();

            var newLatLng = self.createLatLong(position.coords.latitude, position.coords.longitude);

            if (self.userBuffer == null) {
                self.userBuffer = new google.maps.Circle({
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35,
                    map: self.mapService.getMap(),
                    center: newLatLng,
                    radius: 70
                });
            }
            else {
                self.userBuffer.setCenter(newLatLng);
            }

            var icon = self.markerIcons.userCurrentLocation;            

            if (self.currentLocationMarker == null) {
                self.currentLocationMarker = self.placeMarker(newLatLng, "userCurrentLocationMarker",
                    icon);
            }
            else {
                //self.markerIcons.currentLocationInactive
                self.currentLocationMarker.setPosition(newLatLng);
                //self.currentLocationMarker.setIcon(icon);
                //self.currentLocationMarker.setMap(self.mapService.getMap());
            }
        };


        //===================End Location Tracking Stuff=====================================

        //===================Drawing Stuff=====================================

        self.drawingManager = null;
        self.enableDrawingTools = function (opts) {
            opts = opts || {};

            var defaultMarkerOptions = {
                icon: { url: 'images/redline-circle.png', anchor: new google.maps.Point(8, 8) },
                editable: true,
                draggable: true
            };

            var defaultPolylineOptions = {
                editable: true,
                draggable: true
            };

            var defaultPolygonOptions = {
                fillColor: '#ffff00',
                fillOpacity: 0.25,
                strokeWeight: 3,
                zIndex: 1,
                editable: true,
                draggable: true
            };

            var defaultDrawingControlOptions = {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: [
                  google.maps.drawing.OverlayType.MARKER,
                  google.maps.drawing.OverlayType.POLYGON,
                  google.maps.drawing.OverlayType.POLYLINE
                ]
            };

            var appliedOpts = {
                drawingMode: opts.hasOwnProperty("drawingMode") ? opts.drawingMode : google.maps.drawing.OverlayType.MARKER,
                drawingControl: (opts.drawingControl != null) ? opts.drawingControl : true,
                drawingControlOptions: opts.drawingControlOptions || defaultDrawingControlOptions,
                markerOptions: opts.markerOptions || defaultMarkerOptions,
                polylineOptions: opts.polylineOptions || defaultPolylineOptions,
                polygonOptions: opts.polygonOptions || defaultPolygonOptions
            }

            if (self.drawingManager == null) {
                self.drawingManager = new google.maps.drawing.DrawingManager(appliedOpts);
                google.maps.event.addListener(self.drawingManager, 'overlaycomplete', self.onDrawingComplete);
            }
            else {
                self.drawingManager.setOptions(appliedOpts);
            }
            self.drawingManager.setMap(self.mapService.getMap());
        };

        self.disableDrawingTools = function () {
            if (self.drawingManager != null) {
                self.drawingManager.setOptions({ drawingControl: false });
                self.drawingManager.setMap(null);
            }
        };

        self.subscribeToDrawingManagerComplete = function (handler) {
            if (self.drawingManager != null) {
                return google.maps.event.addListener(self.drawingManager, 'overlaycomplete', handler);
            }
        };

        self.unsubscribeToDrawingManagerComplete = function (handler) {
            google.maps.event.removeListener(handler);
        };

        self.clearDrawing = function () {
            if (self.currentDrawing != null) {
                self.currentDrawing.overlay.setMap(null);
            }
        };

        self.getDrawingAsGeoJson = function () {
            var geojson = {};
            geojson.type = self.currentDrawing.type;
            if (geojson.type.toUpperCase() === "POLYGON") {
                geojson.type = "Polygon";
                geojson.coordinates = [[]];
                var path = self.currentDrawing.overlay.getPath();
                for (var i = 0, len = path.length; i < len; i++) {
                    var el = path.getAt(i);
                    geojson.coordinates[0].push([el.lng(), el.lat()]);
                };
            }
            else if (geojson.type.toUpperCase() === "POLYLINE") {
                geojson.type = "LineString";
                geojson.coordinates = [];
                var path = self.currentDrawing.overlay.getPath();
                for (var i = 0, len = path.length; i < len; i++) {
                    var el = path.getAt(i);
                    geojson.coordinates.push([el.lng(), el.lat()]);
                }
            }
            else if (geojson.type.toUpperCase() === "MARKER") {
                geojson.type = "Point";
                geojson.coordinates = [self.currentDrawing.overlay.getPosition().lng(), self.currentDrawing.overlay.getPosition().lat()];
            }
            return geojson;
        };

        self.onDrawingComplete = function (overlay) {
            self.clearDrawing();
            self.currentDrawing = overlay;

            if (self.drawingCallback && self.drawingCallback.drawingComplete)
                self.drawingCallback.drawingComplete(overlay);
        };

        //===================End Drawing Stuff=====================================

        // ==================== LABEL STUFF==========================
        self.Label = function (opt_options) {
            // Initialization
            this.setValues(opt_options);

            // Label specific
            var span = this.span_ = document.createElement('span');
            span.style.cssText = 'position: relative; left: 0px; top: -40px; ' +
                        'white-space: nowrap; border: 0px; font-family:arial; font-weight:bold;' +
                        'padding: 2px; background-color: #ddd; ' +
                        'opacity: .85; ' +
                        'filter: alpha(opacity=85); ' +
                        '-ms-filter: "alpha(opacity=85)"; ' +
                        '-khtml-opacity: .85; ' +
                        '-moz-opacity: .85;';

            var div = this.div_ = document.createElement('div');
            div.appendChild(span);
            div.style.cssText = 'position: absolute; display: none';
            div.style.zIndex = "60000";
        };

        self.initializeLabel = function () {
            self.Label.prototype = new google.maps.OverlayView;

            // Implement onAdd
            self.Label.prototype.onAdd = function () {
                var pane = this.getPanes().overlayLayer;
                pane.appendChild(this.div_);


                // Ensures the label is redrawn if the text or position is changed.
                var me = this;
                this.listeners_ = [
                    google.maps.event.addListener(this, 'position_changed',
                    function () { me.draw(); }),
                    google.maps.event.addListener(this, 'text_changed',
                    function () { me.draw(); })
                ];

            };

            // Implement onRemove
            self.Label.prototype.onRemove = function () {
                this.div_.parentNode.removeChild(this.div_);
                var i;
                // Label is removed from the map, stop updating its position/text.
                for (i = 0, I = this.listeners_.length; i < I; ++i) {
                    google.maps.event.removeListener(this.listeners_[i]);
                }
            };

            // Implement draw
            self.Label.prototype.draw = function () {
                var projection = this.getProjection();
                var position = projection.fromLatLngToDivPixel(this.get('position'));

                var div = this.div_;
                div.style.left = position.x + 'px';
                div.style.top = position.y + 'px';
                div.style.display = 'block';
                //This is a hacky fix for a display issue that occurs when the end points arent moved but the middle vertices are and the text draws on top of its self.
                this.span_.innerHTML = "";
                this.span_.innerHTML = this.get('text').toString();
            };
        };

        self.resetAppState = function () {
            self.clearMapMarkers();
            self.clearHighlights();
        };

        // ==================== Driving Directions ==========================
        self.showDirections = function (directions) {
            self.clearDirections();

            for (var i = 0, len = directions.routes.length; i < len; i++) {
                var polyOpts = (i > 0)
                    ? { strokeColor: "#AFAFAF", strokeWeight: 4 }
                    : null;

                var renderer = new google.maps.DirectionsRenderer({
                    map: self.mapService.getMap(),
                    directions: directions,
                    routeIndex: i,
                    polylineOptions: polyOpts
                });

                self.directionRenderers.push(renderer);
            }
        }

        self.clearDirections = function () {
            for (var i = 0, len = self.directionRenderers.length; i < len; i++) {
                self.directionRenderers[i].setMap(null);
            }

            self.directionRenderers = [];
        };
    };
});