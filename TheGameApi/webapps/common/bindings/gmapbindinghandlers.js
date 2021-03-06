﻿define(['ko', 'async!https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=places,visualization'], function (ko) {
    ko.bindingHandlers.map = {
        init: function (element, valueAccessor) {

            var mapObj = ko.utils.unwrapObservable(valueAccessor());
            var latLng = new google.maps.LatLng(
                ko.utils.unwrapObservable(mapObj.lat),
                ko.utils.unwrapObservable(mapObj.lng));
            var mapOptions = {
                tilt: 0,
                center: latLng,
                zoom: 6,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            mapObj.googleMap = new google.maps.Map(element, mapOptions);

            mapObj.marker = new google.maps.Marker({
                map: mapObj.googleMap,
                position: latLng,
                title: "You Are Here",
                draggable: true
            });

            mapObj.onChangedCoord = function () {
                latLng = new google.maps.LatLng(
                    ko.utils.unwrapObservable(mapObj.lat),
                    ko.utils.unwrapObservable(mapObj.lng));
                mapObj.googleMap.setCenter(latLng);
            };

            mapObj.onMarkerMoved = function () {
                latLng = mapObj.marker.getPosition();
                mapObj.lat(latLng.lat());
                mapObj.lng(latLng.lng());
            };

            mapObj.lat.subscribe(mapObj.onChangedCoord);
            mapObj.lng.subscribe(mapObj.onChangedCoord);

            google.maps.event.addListener(mapObj.marker, 'dragend', mapObj.onMarkerMoved);

            $("#" + element.getAttribute("id")).data("mapObj", mapObj);
        }
    };
});

