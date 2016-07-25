define(['ko', 'pubsub', 'baseWindowViewModel', 'baseMaker'],
    function (ko, pubsub, baseWindowViewModel, baseMaker) {
        baseMaker.extend(backpackViewModel, baseWindowViewModel);
        function backpackViewModel() {
            var self = this;

            self.tabs = {
                junk: "Junk",
                items: "Items"
            };

            self.allTabs = [
                self.tabs.junk,
                self.tabs.items
            ];

            self.activeTab = ko.observable();

            self.appViewModel = null;
            self.theWorld = null;
            self.theUser = null;

            baseMaker.initClass(self, baseWindowViewModel);

            self.initialize = function (appViewModelArg, theWorldArg, theUserArg) {
                backpackViewModel.prototype.initialize.call(this, "backpack-window");
                self.appViewModel = appViewModelArg;
                self.theWorld = theWorldArg,
                self.theUser = theUserArg,
                self.setupEventSubscriptions();
                self.activeTab(self.tabs.junk);
            };

            self.setupEventSubscriptions = function () {
            };

            return self;
        };

        return backpackViewModel;
    });