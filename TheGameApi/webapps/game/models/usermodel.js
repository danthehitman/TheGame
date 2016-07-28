define(['ko', 'pubsub','utils', 'userGeoLocation'],
    function (ko, pubsub, utils, userGeoLocation) {
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

            self.hasItemOfClassAndEffectiveness = function (classId, minEffectiveness) {
                var validTypes = self.itemTypes().filter(function (i) {
                    return utils.searchArrayByProp(i.classes, "Id", classId) != null;
                });
                if (validTypes.length > 0) {
                    validItems = validTypes.filter(function (type) {
                        for (var i = 0; i < type.items().length; i++) {
                            if (type.items()[i].Effectiveness >= minEffectiveness)
                                return true;
                        }
                    });
                    if (validItems.length > 0)
                        return true;
                }
                return false;
            };

            self.hasJunkOfClassAndEffectiveness = function (classId, minEffectiveness) {
                var validTypes = self.junkTypes().filter(function (i) {
                    return utils.searchArrayByProp(i.classes, "Id", classId) != null;
                });
                if (validTypes.length > 0) {
                    validJunk = validTypes.filter(function (type) {
                        return type.effectiveness >= minEffectiveness;
                    });
                    if (validJunk.length > 0)
                        return true;
                }
                return false;
            };

            self.addGold = function (ammount) {
                self.gold(self.gold + ammount);
            };

            self.addItem = function (item) {
                var itemType = self.getItemType(item.Type.Id);
                if (itemType == null) {
                    itemType = new self.itemType(item);
                    self.itemTypes.push(itemType);
                }
                itemType.items.push(item);
            };

            self.addJunk = function (junk) {
                var junkType = self.getJunkType(junk.Type.Id);
                if (junkType == null) {
                    junkType = new self.junkType(junk);
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

            self.itemType = function (item) {
                this.expanded = ko.observable(false);
                this.id = item.Type.Id;
                this.name = item.Type.Name;
                this.classes = item.Type.Classes;
                this.items = ko.observableArray();
                this.count = ko.computed(function () { return this.items().length; }.bind(this));
                this.addItem = function (item) {
                    this.items.push(item);
                }.bind(this);
                this.removeItem = function (item) {
                    this.items.remove(item);
                }.bind(this);
            };

            self.junkType = function (junk) {
                this.expanded = ko.observable(false);
                this.id = junk.Type.Id;
                this.name = junk.Type.Name;
                this.classes = junk.Type.Classes;
                this.effectiveness = junk.Type.Effectiveness;
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