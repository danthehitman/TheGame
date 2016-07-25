define(['ko'],
    function (ko) {
        return function scannerService() {
            var self = this;

            self.theWorld = null;
            self.apiService = null;
            self.mapViewModel = null;

            self.initialize = function (theWorldArg, apiServiceArg, mapViewModelArg) {
                self.theWorld = theWorldArg
                self.apiService = apiServiceArg;
                self.mapViewModel = mapViewModelArg;
                return self;
            };

            self.useScanner = function (scanner, lat, lng) {
                self.apiService.generateDiscoveriesFromItem(scanner.Id, self.mapViewModel.getCurrentLocation(),
                    function (data) { self.getDiscoveriesSuccessCallback(data, scanner); },
                    self.getDiscoverisErrorCallback);
            };

            self.getDiscoveriesSuccessCallback = function (data, scanner) {
                for (i = 0; i < data.length; i++)
                {
                    self.theWorld.addDiscovery(data[i]);
                }
            };

            self.getDiscoverisErrorCallback = function(error) {

            };
        };
    });