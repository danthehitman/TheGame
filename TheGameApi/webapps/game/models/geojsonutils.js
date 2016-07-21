define(['geojson'], function (geoJson) {
    var self = this;

    self.getFirstPoint = function (geojson) {
        if (geojson == null) return null;
        if (geojson.coordinates == null) return null;

        var x;
        var y;

        switch (geojson.type) {
            case "Point":
                x = geojson.coordinates[0];
                y = geojson.coordinates[1];
                break;

            case "MultiPoint":
                x = geojson.coordinates[0][0];
                y = geojson.coordinates[0][1];
                break;

            case "LineString":
                x = geojson.coordinates[0][0];
                y = geojson.coordinates[0][1];
                break;

            case "MultiLineString":
                x = geojson.coordinates[0][0][0];
                y = geojson.coordinates[0][0][1];
                break;

            case "Polygon":
                x = geojson.coordinates[0][0][0];
                y = geojson.coordinates[0][0][1];
                break;

            case "MultiPolygon":
                x = geojson.coordinates[0][0][0];
                y = geojson.coordinates[0][0][1];
                break;

            default:
                return null;

        }

        return {
            "type": "Point",
            "coordinates": [x, y]
        };
    };

    self.toGeoJson = function (googleShape) {

        if (googleShape.hasOwnProperty("position")) {
            return {
                type: "Point",
                coordinates: [googleShape.position.lng(), googleShape.position.lat()]
            };
        }

        if (!googleShape.hasOwnProperty("latLngs")) return null;
        if (googleShape.latLngs.length != 1) return null;


        var coords = [];
        var path = googleShape.latLngs.getAt(0);
        for (var i = 0; i < path.length; i++) {
            var pos = path.getAt(i);
            coords.push([pos.lng(), pos.lat()]);
        }

        var type = googleShape["getPaths"] == null ? "LineString" : "Polygon";

        return {
            type: type,
            coordinates: coords
        };
    };

    return {
        getFirstPoint: self.getFirstPoint,
        toGeoJson: self.toGeoJson
    };
});