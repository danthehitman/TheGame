define(['ko', 'pubsub', 'jqueryUi'], function (ko, pubsub) {
    ko.bindingHandlers.slideVisible = {
        update: function (element, valueAccessor, allBindingsAccessor) {
            // First get the latest data that we're bound to
            var value = valueAccessor(), allBindings = allBindingsAccessor();

            // Next, whether or not the supplied model property is observable, get its current value
            var valueUnwrapped = ko.unwrap(value);

            // Grab some more data from another binding property
            var duration = allBindings.slideDuration || 200; // 200ms is default duration unless otherwise specified
            var type = null;
            if (allBindings.type != null) {
                type = allBindings.type;
            }
            if (type != null && type === "vert") {
                // Now manipulate the DOM element
                if (valueUnwrapped === true) {
                    $(element).slideDown(duration); // Make the element visible
                } else {
                    $(element).slideUp(duration);   // Make the element invisible
                }
            }
            else {
                if (type == null) {
                    type = "slide";
                }
                if (valueUnwrapped === true) {
                    $(element).show(type, { complete: function () { pubsub.publish(allBindings.slideCompleteEvent); } }, duration);
                } else {
                    $(element).hide(type, { complete: function () { pubsub.publish(allBindings.slideCompleteEvent); } }, duration);
                }
            }
        }
    };
});