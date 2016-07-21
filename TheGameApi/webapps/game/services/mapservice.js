define(['ko', 'mapContainer'],
    function (ko, MapContainer) {
        return function mapService() {
            var self = this;

            self.mapContainer = null;
            self.initialize = function () {
                var googleMap = new google.maps.Map(document.getElementById("mapContainer"), {
                    tilt: 0,
                    center: new google.maps.LatLng(40, -100),
                    zoom: 4,
                    mapTypeId: 'roadmap',
                    mapTypeControlOptions: { style: google.maps.MapTypeControlStyle.DROPDOWN_MENU },
                    zoomControl: true,
                    panControl: false,
                    zoomControlOptions: { position: google.maps.ControlPosition.TOP_RIGHT },
                    streetViewControlOptions: { position: google.maps.ControlPosition.TOP_RIGHT }
                });

                self.mapContainer = new MapContainer();
                self.mapContainer.map = googleMap;

                return self;
            };

            self.getMap = function () {
                if (self.mapContainer != null) {
                    return self.mapContainer.map;
                }
                return null;
            };

            self.clearMap = function () {
                self.mapContainer.map.overlayMapTypes.clear();
            };
        };
    });