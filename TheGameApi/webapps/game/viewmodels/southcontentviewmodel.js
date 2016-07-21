define(['ko'],
    function (ko, ChartViewModel) {
        return function southContentViewModel() {
            var self = this;


            self.activeViewModel = ko.observable(null);
            self.isVisible = ko.observable(false);
            self.height = ko.observable(220); //220 is default height when visible
            self.heightPx = ko.computed(function () {
                if (self.isVisible())
                    return self.height() + "px";
                else
                    return "0px";
            });

            self.initialize = function (ilapi, appViewModel) {
            };

            self.toggleOrSetIsVisible = function (optVisible) {
                var toSet = optVisible || !self.isVisible();
                self.isVisible(toSet);
            };

            self.reset = function () {
                self.isVisible(false);
            };

            self.close = function () {
                self.isVisible(false);
            };

            self.windowResized = function () {
            };
        };
    });