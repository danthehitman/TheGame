define(['ko', 'pubsub', 'utils', 'baseWindowViewModel', 'baseMaker'],
    function (ko, pubsub, utils, baseWindowViewModel, baseMaker) {
        baseMaker.extend(autoClosingWindowViewModel, baseWindowViewModel);
        function autoClosingWindowViewModel() {
            var self = this;
            baseMaker.initClass(self, baseWindowViewModel);
            self.windowDiv = null;

            self.initialize = function (windowKey, windowDiv) {
                autoClosingWindowViewModel.prototype.initialize.call(this, windowKey);
                this.displayWindow.subscribe(this.onDisplayWindowChanged);
                this.windowDiv = windowDiv;
                return this;
            };

            self.onDisplayWindowChanged = function () {
                if (self.displayWindow() == true) {
                    window.setTimeout(function () {
                        $("body").bind('click.' + self.windowDiv, self.onWindowFocusLoss);
                    }, 0);
                }
                else
                    $("body").unbind('click.' + self.windowDiv);
            };

            self.onWindowFocusLoss = function (e) {
                if (e.target.id == self.windowDiv) {
                    return;
                }
                if ($(e.target).parents('#' + self.windowDiv).length == 0) {
                    self.displayWindow(false);
                }
            };

            return self;
        };

        return (autoClosingWindowViewModel);
    });