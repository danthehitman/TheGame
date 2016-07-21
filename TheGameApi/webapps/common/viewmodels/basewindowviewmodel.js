define(['ko', 'pubsub', 'utils'],
    function (ko, pubsub, utils) {
        baseWindowViewModel.prototype = new function () { }();
        baseWindowViewModel.prototype.constructor = baseWindowViewModel;
        function baseWindowViewModel() {
            var self = this;
            self.windowKey = null;
            // Constants
            self.WINDOWTRAVELTIME = 400;


            self.initialize = function (windowKey) {
                this.windowKey = windowKey;
                return this;
            };

            self.displayWindow = ko.observable(false);

            self.toggleOrSetDisplay = function (display) {
                if (display != null) {
                    self.displayWindow(display);
                } else {
                    self.displayWindow(!self.displayWindow());
                }
            };

        };

        return baseWindowViewModel;
    });