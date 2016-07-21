define([],
    function () {

        var extend = function (childClass, BaseClass) {
            childClass.prototype = new BaseClass();
            childClass.prototype.constructor = childClass;
        };

        var initClass = function (childClass, baseClass, args) {
            if (args == null) {
                args = [];
            }
            baseClass.apply(childClass, args);
        };

        return ({ extend: extend, initClass: initClass });
    });