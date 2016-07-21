define(['ko', 'baseWindowViewModel', 'baseMaker'],
    function (ko, baseWindowViewModel, baseMaker) {
        baseMaker.extend(toolboxViewModel, baseWindowViewModel);
        function toolboxViewModel() {
            var self = this;
            self.appViewModel = null;

            self.emptyTool = {
                key: "defaultTool",
                caption: "Select a tool...",
                activeIcon: "url(images/wrench_30X30.png)",
                inactiveIcon: "url(images/wrench_30X30.png)"
            };

            self.activeTool = ko.observable(self.emptyTool);

            self.allTools = ko.observableArray();

            baseMaker.initClass(self, baseWindowViewModel);

            self.initialize = function (appViewModel) {
                toolboxViewModel.prototype.initialize.call(this, "toolbox-window");
                self.appViewModel = appViewModel;

                self.allTools([
                    new self.measureTool(),
                    new self.redlineTool()
                ]);

                self.activeTool.subscribeChanged(self.onActiveToolChanged);
                return self;
            };

            self.setActiveTool = function (activeTool) {
                if (activeTool === self.activeTool()) {
                    self.activeTool(self.emptyTool);
                } else {
                    self.activeTool(activeTool);
                }
            };

            self.onActiveToolChanged = function (newVal, oldVal) {
                if (oldVal && oldVal.deactivate)
                    oldVal.deactivate();

                if (newVal && newVal.activate)
                    newVal.activate();
            };

            self.reset = function () {
                self.setActiveTool(self.emptyTool);
                self.displayWindow(false);
            };

            self.measureTool = function () {
                var me = this;
                me.key = "measureTool";
                me.caption = "Measure";
                me.activeIcon = "url(images/ruler_30X30_red.png)";
                me.inactiveIcon = "url(images/ruler_30X30_black.png)";

                me.activate = function () {
                    self.appViewModel.mapViewModel.measureToolViewModel.setIsMeasuring(true);
                };

                me.deactivate = function () {
                    self.appViewModel.mapViewModel.measureToolViewModel.setIsMeasuring(false);
                };
            }

            self.redlineTool = function () {
                var me = this;
                me.key = "redlineTool";
                me.caption = "Redline";
                me.activeIcon = "url(images/pencil_red.png)";
                me.inactiveIcon = "url(images/pencil.png)";

                me.activate = function () {
                    self.appViewModel.redlineViewModel.toggleEnabled();
                };

                me.deactivate = function () {
                    self.appViewModel.redlineViewModel.toggleEnabled();
                };
            }

            return self;
        };

        return toolboxViewModel;
    });