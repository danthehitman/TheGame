define(['ko', 'utils', 'pubsub', 'baseWindowViewModel', 'baseMaker', 'geojson', 'geojsonutils', 'jqueryFileDownload'],
    function (ko, utils, pubsub, BaseWindowViewModel, BaseMaker, geojson, geoJsonUtils) {
        BaseMaker.extend(redLineViewModel, BaseWindowViewModel);
        function redLineViewModel() {
            var self = this;
            BaseMaker.initClass(self, BaseWindowViewModel);

            self.tabs = {
                edit: "Feature",
                layers: "Layers"
            };

            self.allTabs = [
                self.tabs.edit,
                self.tabs.layers
            ];

            self.drawingTools = [
                { key: null, icon: "images/hand.png" },
                { key: "marker", icon: "images/marker.png" },
                { key: "polyline", icon: "images/polyline.png" },
                { key: "polygon", icon: "images/polygon.png" }
            ];
            self.activeDrawingTool = ko.observable(self.drawingTools[0]);

            self.appViewModel = null;
            self.ilapi = null;
            self.isMobile = ko.observable(false);

            self.allLayers = ko.observableArray();
            self.activeLayer = ko.observable();

            self.activeTab = ko.observable(self.tabs.edit);

            self._zoomImportedLayer = false;

            self._selectedRecord = ko.observable();
            self.selectedRecord = ko.computed({
                read: function () {
                    return self._selectedRecord();
                },
                write: function (value) {
                    if (self._selectedRecord())
                        self._selectedRecord().isEditing(false);

                    self._selectedRecord(value);

                    if (self._selectedRecord())
                        self._selectedRecord().isEditing(true);
                    self.activateLayerByRecord(self._selectedRecord());
                },
                owner: self
            });

            self.initialize = function (ilapiArg, appViewModelArg) {
                redLineViewModel.prototype.initialize.call(this, "redline-window");
                self.ilapi = ilapiArg;
                self.appViewModel = appViewModelArg;
                self.isMobile(self.appViewModel.isMobile());

                self.defaultLayer = new self.layer("Default", null);
                self.allLayers.push(self.defaultLayer);
                self.activeLayer(self.defaultLayer);
                return self;
            };

            self.activeDrawingToolChanged = function () {
                self.appViewModel.mapViewModel.enableDrawingTools({ drawingControl: false, drawingMode: self.activeDrawingTool().key })
            };
            self.activeDrawingTool.subscribe(self.activeDrawingToolChanged);

            self.setActiveTool = function (tool) {
                self.activeDrawingTool(tool);
                //self.appViewModel.mapViewModel.enableDrawingTools({ drawingControl: false, drawingMode: self.activeDrawingTool().key })
            };

            self.toggleEnabled = function () {
                if (self.displayWindow()) {
                    //turn off
                    self.appViewModel.mapViewModel.drawingCallback = null;
                    self.appViewModel.mapViewModel.disableDrawingTools();
                    self.selectedRecord(null);
                    self.displayWindow(false);
                }
                else {
                    //turn on
                    self.appViewModel.mapViewModel.drawingCallback = self;
                    self.activeDrawingTool(self.drawingTools[1]); //Enable marker
                    self.displayWindow(true);
                }
            }

            self.drawingComplete = function (event) {
                var record = new self.record(event.type, event.overlay);
                self.activeLayer().records.push(record);

                //note: nlm - Hacky, need to prevent mapviewmodel from removing the drawing
                self.appViewModel.mapViewModel.currentDrawing = null;

                self.selectedRecord(record);
            };

            self.activateLayerByRecord = function (record) {
                if (record == null) return;

                var layer = utils.arrayFirst(self.allLayers(), function (lyr) {
                    return lyr.records.indexOf(record) >= 0;
                });

                if (layer) self.activeLayer(layer);
            };

            self.deleteSelectedRecord = function () {
                if (!self.selectedRecord()) return;

                self.activeLayer().remove(self.selectedRecord());
                self.selectedRecord().remove();
                self.selectedRecord(null);
            };

            self.exportLayer = function (layer) {
                if (layer == null) return;

                if (layer.records.length == 0) {
                    alert("This layer cannot be exported because it does not contain features.");
                    return;
                }

                var features = [];

                for (var i = 0; i < layer.records.length; i++) {
                    var feature = {
                        type: "Feature",
                        properties: {
                            name: layer.records[i].name,
                            description: layer.records[i].description
                        },
                        geometry: geoJsonUtils.toGeoJson(layer.records[i].shape)
                    }

                    features.push(feature);
                }

                var data = { "name": layer.name(), "features": features };
                self.ilapi.exportKml(data, self.exportSuccess, self.exportFailure);
            };

            self.exportSuccess = function (result) {
                pubsub.publish("notify", "Result: " + result);
                $.fileDownload("api/gis/drawings/" + result);
            };

            self.exportFailure = function (error) {
                pubsub.publish("notify", error.responseText);
            };

            self.uploadLayer = function () {
                self.appViewModel.fileUploadViewModel.showUpload({ caption: "Open Redline Layer", successCallback: self.uploadSuccess, cancelCallback: self.uploadCancel, showZoomTo: true, extensions: ".kml" });
                self.appViewModel.toolboxViewModel.displayWindow(false);
            };

            self.uploadSuccess = function (result) {
                self._zoomImportedLayer = result.zoomTo || false;
                self.importLayer(result.data);
                self.appViewModel.toolboxViewModel.displayWindow(true);
            };

            self.uploadCancel = function () {
                self.appViewModel.toolboxViewModel.displayWindow(true);
            };

            self.importLayer = function (id) {
                self.ilapi.importGeoJson(id, self.importLayerSuccess, self.importLayerFailure);
            };

            self.importLayerSuccess = function (result) {
                var layerName = result.name || null;
                if (layerName == null || layerName == "Default")
                    layerName = "New Layer"

                var features = result.features || []

                var records = [];

                for (var i = 0; i < features.length; i++) {
                    var feat = features[i];

                    var name = feat.properties.name;
                    var desc = feat.properties.description;
                    var type = self.toGoogleType(feat.geometry.type);
                    var geo = GeoJSON(feat.geometry);

                    var rec = new self.record(type, geo);
                    rec.name = name;
                    rec.description = desc;

                    records.push(rec);
                }

                var layer = new self.layer(layerName, records);
                self.allLayers.push(layer);
                layer.visible(false);
                layer.visible(true);

                if (self._zoomImportedLayer)
                    layer.zoomTo();
            };

            self.toGoogleType = function (geoJsonType) {
                switch (geoJsonType) {
                    case "Point":
                        return "marker";

                    case "LineString":
                        return "polyline";

                    case "Polygon":
                        return "polygon";

                    default:
                        return "unknown";
                }
            };

            self.importLayerFailure = function (error) {
                pubsub.publish("notify", error.responseText);
            };

            self.removeLayer = function (layer) {
                if (layer == null) return;
                layer.dispose();
                self.allLayers.remove(layer);
            };

            self.newLayer = function () {
                self.allLayers.push(new self.layer("New Layer"));
            };

            self.record = function (type, shape) {
                var me = this;
                me.type = type;
                me.shape = shape;

                me.name = null;
                me.description = null;

                me.isEditing = ko.observable(false);

                me.remove = function () {
                    google.maps.event.clearInstanceListeners(me);
                    me.shape.setMap(null);
                };

                me.setSymbol = function () {
                    if (!me.shape) return;

                    if (me.isEditing()) {
                        if (me.type == "marker")
                            me.shape.setOptions({ icon: { url: 'images/redline-circle-edit.png', anchor: new google.maps.Point(8, 8) }, draggable: true });
                        else
                            me.shape.setOptions({ strokeColor: '#FF0000', fillColor: '#FF0000', editable: true, draggable: true });
                    }
                    else {
                        if (me.type == "marker")
                            me.shape.setOptions({ icon: { url: 'images/redline-circle.png', anchor: new google.maps.Point(8, 8) }, draggable: false });
                        else
                            me.shape.setOptions({ strokeColor: '#FF0000', fillColor: '#FF0000', editable: false, draggable: false });
                    }
                };

                google.maps.event.addListener(me.shape, 'click', function () {
                    self.selectedRecord(me);
                });

                me.isEditing.subscribe(me.setSymbol);
                me.setSymbol();
            };

            self.layer = function (layerName, records) {
                var me = this;
                me.name = ko.observable(layerName);
                me.records = records || [];
                me.visible = ko.observable(true);

                me.remove = function (record) {
                    var i = this.records.indexOf(record);
                    if (i < 0) return;
                    this.records.splice(i, 1);
                };

                me.zoomTo = function () {
                    var shapes = utils.arraySelect(me.records, "shape");
                    self.appViewModel.mapViewModel.zoomToFeatures(shapes);
                };

                me.onVisibleChanged = function () {
                    var temp = me.name;
                    var toSet = me.visible()
                        ? self.appViewModel.mapViewModel.mapService.getMap()
                        : null;

                    me.setMapForRecords(toSet);

                }.bind(me);

                me.setMapForRecords = function (toSet) {
                    for (var i = 0; i < me.records.length; i++) {
                        me.records[i].shape.setMap(toSet);
                    }
                };

                me.dispose = function () {
                    for (var i = 0; i < me.records.length; i++) {
                        me.records[i].remove();
                    }
                };

                me.visible.subscribe(me.onVisibleChanged);
            }
        };

        return redLineViewModel;
    });