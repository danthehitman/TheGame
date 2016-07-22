define(['ko', 'jqueryCookie'], function (ko) {
    var self = this;
    if (!window.console) { window.console = {}; window.console.log = function () { }; }

    ko.subscribable.fn.subscribeChanged = function (callback) {
        var previousValue;
        this.subscribe(function (_previousValue) {
            previousValue = _previousValue;
        }, undefined, 'beforeChange');
        this.subscribe(function (latestValue) {
            callback(latestValue, previousValue);
        });
    };

    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== "function") {
                // closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function () { },
                fBound = function () {
                    return fToBind.apply(this instanceof fNOP && oThis
                                           ? this
                                           : oThis,
                                         aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        };
    }

    // String.format prototype in case it doesnt exist.
    if (!String.prototype.format) {
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] !== 'undefined' ? args[number] : match;
            });
        };
    }

    // String splicing
    if (!String.prototype.splice) {
        String.prototype.splice = function (idx, rem, s) {
            return (this.slice(0, idx) + s + this.slice(idx + Math.abs(rem)));
        };
    }

    if (typeof String.prototype.startsWith != 'function') {
        // see below for better implementation!
        String.prototype.startsWith = function (str) {
            return this.indexOf(str) == 0;
        };
    }

    if (typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    var hasLocalStorage = function () {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    };

    self.getAppState = function () {
        var stateVars = self.getUriParameterByName("state"),
            stateArray1 = stateVars.split(","),
            finalState = [],
                i, thisState;
        for (i = 0; i < stateArray1.length; i++) {
            thisState = stateArray1[i].split(":");
            finalState[thisState[0]] = thisState.length > 1 ? thisState[1] : thisState[0];
        }
        return finalState;
    };

    self.getAppStateVariable = function (name) {
        return self.getAppState()[name];
    };

    self.storeSessionCookie = function (token) {
        $.cookie("thegamesessiontoken", token, { expires: 2, secure: true });
    };

    self.getSessionCookie = function () {
        return $.cookie("thegamesessiontoken");
    };

    self.deleteSessionCookie = function () {
        $.removeCookie("thegamesessiontoken");
    };

    self.storeAdminSessionCookie = function (token) {
        $.cookie("integralinkadminsessiontoken", token, { expires: 2, secure: true });
    };

    self.getAdminSessionCookie = function () {
        return $.cookie("integralinkadminsessiontoken");
    };

    self.deleteAdminSessionCookie = function () {
        $.removeCookie("integralinkadminsessiontoken");
    };

    self.storeCookie = function (key, value, expires) {
        var expiresValue = 360;
        if (expires) {
            expiresValue = expires;
        }
        $.cookie(key, value, { expires: expiresValue, secure: true });
    };

    self.getCookie = function (key) {
        return $.cookie(key);
    };

    self.deleteCookie = function (key) {
        $.removeCookie(key);
    };

    // get a param value from the UIR by name.
    self.getUriParameterByName = function (name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    //get the current host and protocol as a string.  e.g. https://dev.pipelinecloud.com
    self.getHostAndProtocolString = function () {
        return window.location.protocol + "//" + window.location.host;
    };

    // Sort an array by the objects property.  Supports nested properties of object within the array.
    var sortArrayByProp = function (prop, arr) {
        prop = prop.split('.');
        var len = prop.length;

        arr.sort(function (a, b) {
            var i = 0;
            while (i < len) { a = a[prop[i]]; b = b[prop[i]]; i++; }
            if (a < b) {
                return -1;
            }
            if (a > b) {
                return 1;
            }
            return 0;
        });
        return arr;
    };

    // Search an array by given property.  Doesnt support nested properties yet.
    var searchArrayByProp = function (arr, prop, value) {
        var i;
        for (i = 0; i < arr.length; i++) {
            if (arr[i][prop] === value) {
                return arr[i];
            }
        }
        return null;
    };

    var arrayWhere = function (arr, func) {
        var results = [];

        for (var i = 0; i < arr.length; i++) {
            if (func(arr[i]))
                results.push(arr[i]);
        }

        return results;
    };

    // Searches an array by the specified function, and return the first item where the function returns true.  Null if no items found
    var arrayFirst = function (arr, func) {
        for (var i = 0; i < arr.length; i++) {
            if (func(arr[i]))
                return arr[i];
        }
        return null;
    };

    var arraySelect = function (arr, selector) {
        var result = [];

        var select = typeof select == "function"
            ? selector
            : function (item) { return item[selector]; };

        for (var i = 0; i < arr.length; i++) {
            result.push(select(arr[i]));
        }

        return result;
    };

    var formatStation = function (station) {
        station = String(station);
        var indexOfDot = station.lastIndexOf('.');
        if (indexOfDot > 0) {
            station = station.substring(0, indexOfDot);
        }
        if (station.length < 3) {
            if (station.length === 2) {
                station = "0+" + station;
            } else if (station.length === 1) {
                station = "0+0" + station;
            }
        }
        else {
            station = station.splice(station.length - 2, 0, "+");
        }
        return station;
    };

    var formatMpFoot = function (mp, foot) {
        var formatted = mp + "+";
        var footLength = String(foot).length;
        var extraZeros = "";
        if (footLength < 4) {
            var zerosNeeded = 4 - footLength;
            for (var i = 0; i < zerosNeeded; i++) {
                extraZeros += "0";
            }
        }
        formatted += extraZeros + foot;
        return formatted;
    };

    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i) != null ? true : false;
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i) != null ? true : false;
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i) != null ? true : false;
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i) != null ? true : false;
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i) != null ? true : false;
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };

    return {
        getUriParameterByName: self.getUriParameterByName,
        getAppState: self.getAppState,
        getAppStateVariable: self.getAppStateVariable,
        sortArrayByProp: sortArrayByProp,
        searchArrayByProp: searchArrayByProp,
        formatStation: formatStation,
        formatMpFoot: formatMpFoot,
        hasLocalStorage: hasLocalStorage,
        getSessionCookie: self.getSessionCookie,
        deleteSessionCookie: self.deleteSessionCookie,
        storeSessionCookie: self.storeSessionCookie,
        getAdminSessionCookie: self.getAdminSessionCookie,
        deleteAdminSessionCookie: self.deleteAdminSessionCookie,
        storeAdminSessionCookie: self.storeAdminSessionCookie,
        storeCookie: self.storeCookie,
        getCookie: self.getCookie,
        deleteCookie: self.deleteCookie,
        isMobile: isMobile,
        getHostAndProtocolString: getHostAndProtocolString,
        arrayWhere: arrayWhere,
        arrayFirst: arrayFirst,
        arraySelect: arraySelect
    };

});