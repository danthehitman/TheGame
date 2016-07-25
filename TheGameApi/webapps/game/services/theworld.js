define(['ko', 'pubsub', 'wkt', 'userGeoLocation'],
    function (ko, pubsub, Wkt, userGeoLocation) {
        return function theWorld() {
            var self = this;

            self.events = {
                lootFound: "the-world-junk-found"
            };

            self.discoveries = {};
            self.loot = {};
            self.mapViewModel = null;
            self.apiService = null;
            self.theUser = null;

            self.DISCOVERYMARKERIMAGE = { url: "/images/unknownloot.png", anchor: { x: 16, y: 16 } };
            self.FOUNDMARKERIMAGE = { url: "/images/knownloot.png", anchor: { x: 16, y: 16 } };

            self.initialize = function (mapViewModelArg, apiServiceArg, theUserArg) {
                self.mapViewModel = mapViewModelArg;
                self.apiService = apiServiceArg;
                self.theUser = theUserArg;

                self.setupEventSubscriptions();

                return self;
            };

            self.setupEventSubscriptions = function () {
                userGeoLocation.mostRecentPosition.subscribe(self.onUserLocationChanged);
            };

            self.onUserLocationChanged = function () {
                var buffer = self.mapViewModel.userBuffer;
                for (i in self.discoveries)
                {
                    if (buffer.contains(self.discoveries[i].marker.position))
                    {
                        self.onLootFound(self.discoveries[i]);
                    }
                }
            };

            self.onLootFound = function (discovery) {
                self.apiService.convertDiscoveryToLoot(discovery.Id, function (data) {
                    self.convertDiscoverySuccessHandler(data, discovery);
                },
                    self.convertDiscoveryErrorHandlers);
            };

            self.convertDiscoverySuccessHandler = function (loot, discovery) { 
                self.removeDiscovery(discovery.Id);
                self.addLoot(loot, discovery.marker.position);
                self.processFoundLoot(loot);
            };

            self.processFoundLoot = function(loot)
            {
                if (loot.LootType == "Junk")
                    self.theUser.addJunk(loot);
                else if (loot.LootType == "Item")
                    self.theUser.addItem(loot);
                else if (loot.LootType == "Gold")
                    self.theUser.addGold(loot.Ammount);

            };

            self.convertDiscoveryErrorHandler = function (message) {

            };

            self.addLoot = function (loot, point) {
                var marker = self.mapViewModel.placeMarker(point, loot.Id, self.FOUNDMARKERIMAGE,
                    function () {
                        self.removeLoot(loot.Id);
                    });
                loot.marker = marker;
                self.loot[loot.Id] = loot;
            };

            self.removeLoot = function(id){
                self.loot[id].marker.setMap(null);
                delete self.loot[id];
            };

            self.addDiscovery = function (discovery) {
                var wkt = new Wkt.Wkt();
                wkt.read(discovery.Geometry.Geometry.WellKnownText);

                var point = new google.maps.LatLng(wkt.components[0].x, wkt.components[0].y);
                var marker = self.mapViewModel.placeMarker(point, discovery.Id, self.DISCOVERYMARKERIMAGE);
                discovery.marker = marker;
                self.discoveries[discovery.Id] = discovery;
            };

            self.getDiscovery = function (id) {
                return self.discoveries[id];
            };

            self.removeDiscovery = function (id) {
                self.discoveries[id].marker.setMap(null);
                delete self.discoveries[id];
            };
        };
    });