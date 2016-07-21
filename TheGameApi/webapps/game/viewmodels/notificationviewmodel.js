define(['ko', 'pubsub', 'utils', 'autoClosingWindowViewModel', 'baseMaker'],
    function (ko, pubsub, utils, autoClosingWindowViewModel, baseMaker) {
        baseMaker.extend(notificationViewModel, autoClosingWindowViewModel);
        function notificationViewModel() {
            var self = this;
            baseMaker.initClass(self, autoClosingWindowViewModel);

            self.displayNotification = ko.observable(false);
            self.notificationHistory = ko.observableArray([]);
            self.unprocessedNotifications = ko.observableArray([]);
            self.currentNotification = ko.observable();
            self.appViewModel = null;

            self.initialize = function (appViewModel) {
                self.appViewModel = appViewModel;
                notificationViewModel.prototype.initialize.call(this, "notificationhistory-window",
                    "notificationHistoryContainer");
                self.setEmptyNotification();
                return self;
            };

            self.notify = function (summary, logOnly, type, detail, durration, urgent) {
                window.console.log(summary);
                if (logOnly) {
                    return;
                }
                var thisNotification = new self.notification(summary, type, detail);
                self.queueNotification(thisNotification, urgent);
            };

            self.queueNotification = function (notification, urgent) {
                if (urgent) {
                    self.unprocessedNotifications.unshift(notification);
                } else {
                    self.unprocessedNotifications.push(notification);
                }
                if (self.displayNotification() === false) {
                    self.showNextNotification();
                } else if (self.unprocessedNotifications().length === 1) {
                    window.setTimeout(function () { self.showNextNotification(); }, 1000);
                }
            };

            self.showNextNotification = function () {
                if (self.currentNotification() != null && self.currentNotification().summary !== "") {
                    self.notificationHistory.unshift(self.currentNotification());
                }
                if (self.unprocessedNotifications().length > 0) {
                    self.currentNotification(self.unprocessedNotifications.shift());
                    self.displayNotification(true);
                    var duration = self.currentNotification().duration;
                    if (duration == null) {
                        if (self.unprocessedNotifications().length === 0 ||
                            self.currentNotification().urgent) {
                            duration = 5000;
                        } else {
                            duration = 1000;
                        }
                    }
                    window.setTimeout(function () { self.showNextNotification(); },
                        duration != null ? duration : 5000);
                }
                else {
                    self.displayNotification(false);
                    self.setEmptyNotification();
                }
            };

            self.closeNotification = function (forced) {
                if (forced) {
                    self.displayNotification(false);
                }
                else {
                    self.notificationCount--;
                    if (self.notificationCount < 1) {
                        self.displayNotification(false);
                    }
                }
            };

            self.setEmptyNotification = function () {
                self.currentNotification(new self.notification());
            };

            self.notification = function (summary, type, detail, duration) {
                this.type = type;
                this.summary = summary;
                this.detail = detail;
                this.duration = duration;
                this.getColor = ko.computed(function () {
                    switch (this.type) {
                        case "info":
                            return "gray";
                        case "error":
                            return "red";
                        case "warning":
                            return "yellow";
                        default:
                            return "gray";
                    }
                }.bind(this));
            };

            self.notificationType = {
                info: "info",
                error: "error",
                warning: "warning"
            };
        }

        return notificationViewModel;
    });