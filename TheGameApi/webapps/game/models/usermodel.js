define(['ko', 'pubsub', 'userGeoLocation'],
    function (ko, pubsub, userGeoLocation) {
        return function theWorld() {
            var self = this;

            self.events = {
            };

            self.itemTypes = ko.observableArray();
            self.junkTypes = ko.observableArray();

            self.gold = ko.observable(0);
            self.name = ko.observable("");
            self.userId = null;
            self.mapViewModel = null;
            self.apiService = null;
            self.USERMARKERIMAGE = { url: "/images/walker.png", anchor: { x: 16, y: 16 } };

            self.initialize = function (userId, mapViewModelArg, apiServiceArg) {
                self.userId = userId;
                self.mapViewModel = mapViewModelArg;
                self.apiService = apiServiceArg;
                self.refreshUser();
                return self;
            };

            self.addGold = function (ammount) {
                self.gold(self.gold + ammount);
            };

            self.addItem = function (item) {
                var itemType = self.getItemType(item.Type.Id);
                if (itemType == null) {
                    itemType = new self.itemType(item.Type.Id, item.Type.Name);
                    self.itemTypes.push(itemType);
                }
                itemType.items.push(item);
            };

            self.addJunk = function (junk) {
                var junkType = self.getJunkType(junk.Type.Id);
                if (junkType == null) {
                    junkType = new self.junkType(junk.Type.Id, junk.Type.Name);
                    self.junkTypes.push(junkType);
                }
                junkType.junk.push(junk);
            };

            self.loadUser = function (user) {
                    self.gold(user.gold);
                    self.name(user.name);
            };

            self.refreshUser = function () {
                self.apiService.getUser(self.userId, true, self.getUserSuccessCallback, self.getUserErrorCallback);
                self.refreshUserItems();
                self.refreshUserJunk();
            };

            self.getUserSuccessCallback = function (data) {
                self.loadUser(data);
            };

            self.getUserErrorCallback = function (message) {
                alert("Error loading items: " + message);
            };

            self.refreshUserItems = function () {
                self.apiService.getItemsForUser(self.userId, self.getUserItemsSuccessCallback, self.getUserItemsErrorCallback);
            };

            self.getUserItemsSuccessCallback = function (data) {
                for (var i = 0; i < data.length; i++)
                    self.addItem(data[i]);
            };

            self.getUserItemsErrorCallback = function (message) {
                alert("Error loading items: " + message);
            };

            self.refreshUserJunk = function () {
                self.apiService.getJunkForUser(self.userId, self.getUserJunkSuccessCallback, self.getUserJunkErrorCallback);
            };

            self.getUserJunkSuccessCallback = function (data) {
                for (var i = 0; i < data.length; i++)
                    self.addJunk(data[i]);
            };

            self.getUserJunkErrorCallback = function (message) {
                alert("Error loading items: " + message);
            };

            self.getItemType = function (typeId) {
                var match = ko.utils.arrayFirst(self.itemTypes(), function (item) {
                    return typeId === item.id;
                });
                return match;
            };

            self.getJunkType = function (typeId) {
                var match = ko.utils.arrayFirst(self.junkTypes(), function (junk) {
                    return typeId === junk.id;
                });
                return match;
            };

            self.itemType = function (typeId, typeName) {
                this.expanded = ko.observable(false);
                this.id = typeId;
                this.name = typeName;
                this.items = ko.observableArray();
                this.count = ko.computed(function () { return this.items().length; }.bind(this));
                this.addItem = function (item) {
                    this.items.push(item);
                }.bind(this);
                this.removeItem = function (item) {
                    this.items.remove(item);
                }.bind(this);
            };

            self.junkType = function (typeId, typeName) {
                this.expanded = ko.observable(false);
                this.id = typeId;
                this.name = typeName;
                this.junk = ko.observableArray();
                this.count = ko.computed(function () { return this.junk().length; }.bind(this));
                this.addJunk = function (junk) {
                    this.junk.push(junk);
                }.bind(this);
                this.removeJunk = function(junk) {
                    this.junk.remove(junk);
                }.bind(this);
            };
        };
    });