/*
 * Copyright (C) 2020 con terra GmbH (info@conterra.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*** SKIP-SONARQUBE-ANALYSIS ***/
/*
 * Copyright (C) con terra GmbH
 */

import d_lang from "dojo/_base/lang";
import d_aspect from "dojo/aspect"
import Handles from "esri/core/Handles";
import {nearestVertex, nearestCoordinate, planarLength, planarArea} from "esri/geometry/geometryEngine";
import Point from "esri/geometry/Point";
import ct_async from "ct/async";
import when from "apprt-core/when";

import Extent from "esri/geometry/Extent"

export default function () {
    return {
        //injected
        _highlighter: null,
        _sketchingHandler: null,
        _snappingSourceModels: [],

        // props
        tolerance: null,

        //local
        _ownHandler: new Handles(),
        _snapPointGrapic: null,
        _snapObjectGrapic: null,
        _latestSnappingObject: {},
        _checkShouldSnapping: null,
        _mandatoryWithSnappingMode: false,
        _mandatoryWithoutSnappingMode: false,
        _highlights: [],

        activate() {
            const props = this._properties;
            this.tolerance = props.tolerance || 15;

            this.snapPointSymbol = props.snapPointSymbol;
            this.snapPointObjectSymbol = props.snapPointObjectSymbol;
            this.snapPolygonObjectSymbol = props.snapPolygonObjectSymbol;
            this.snapPolylineObjectSymbol = props.snapPolylineObjectSymbol;
        },
        deactivate() {
            this._ownHandler.removeAll();
        },

        add_snappingSourceModel(snappingSourceModel) {
            this._snappingSourceModels.push(snappingSourceModel);
        },

        set_sketchingHandler(sketchingHandler) {
            this._sketchingHandler = sketchingHandler;
            ct_async(this._addCreateSketchViewModelHandler, this);
        },

        setMandatoryWithSnappingMode(evt) {
            this._mandatoryWithSnappingMode = evt.getProperty("enable");
        },

        setMandatoryWithoutSnappingMode(evt) {
            this._mandatoryWithoutSnappingMode = evt.getProperty("enable");
        },

        getLatestSnappingObject() {
            return this._latestSnappingObject;
        },

        getSnappingObject(point) {
            const searchRadius = this._getSearchRadius();
            const geometries = this._getSnappingGeometriesWithinDistance(point, searchRadius);

            let nearestPointResult = {};
            if (geometries.length) {
                nearestPointResult.objectGeometry || (nearestPointResult =
                    this._getNearestPointResult(point, geometries, "point", searchRadius));
                nearestPointResult.objectGeometry || (nearestPointResult =
                    this._getNearestPointResult(point, geometries, "polyline", searchRadius));
                nearestPointResult.objectGeometry || (nearestPointResult =
                    this._getNearestPointResult(point, geometries, "polygon", searchRadius));
            }
            this._latestSnappingObject = nearestPointResult;
            return nearestPointResult;
        },

        addSnappingGraphics(point, geometry) {
            this._highlights.push(this._highlighter.highlight({
                geometry: point,
                symbol: this.snapPointSymbol
            }));
            const symbol = this._getSymbol(geometry);
            this._highlights.push(this._highlighter.highlight({
                geometry: geometry,
                symbol: symbol
            }));
        },

        removeSnappingGraphics() {
            if (this._highlights?.length) {
                this._highlights.forEach((highlight) => {
                    highlight.remove();
                })
                this._highlights = [];
            }
        },

        _getSnappingGeometriesWithinDistance(point, searchRadius) {
            const distance = searchRadius * 2;
            const extent = new Extent({
                xmin: point.x - distance,
                ymin: point.y - distance,
                xmax: point.x + distance,
                ymax: point.y + distance,
                spatialReference: point.spatialReference
            });

            let geometries;
            this._snappingSourceModels.forEach((sourceModel) => {
                let fs = sourceModel.getGeometries();
                if (extent) {
                    fs = fs.filter(g => extent.intersects(g));
                }
                if (fs.length) {
                    if (geometries) {
                        geometries = geometries.concat(fs);
                    } else {
                        geometries = fs;
                    }
                }
            });

            return geometries || [];
        },

        _getNearestPointResult(point, geometries, type, searchRadius) {
            let nearestPointResult = {};
            const checkShouldSnapping = this._checkShouldSnapping;
            this._filterGeometriesByType(geometries, type).some(geometry => {
                // always go on if checkShouldSnapping method is undefined
                const shouldSnapping = checkShouldSnapping ? checkShouldSnapping(point, geometry) : true;
                if (!shouldSnapping) {
                    return false;
                }

                // find nearest vertex for type of point, polyline, polygon
                let nearestResult = nearestVertex(geometry, point);

                // find nearest coordinate for type of polyline, polygon
                // if nearestResult is empty or distance is greater as searchRadius
                if (type !== "point" && (nearestResult.isEmpty || nearestResult.distance > searchRadius)) {
                    nearestResult = nearestCoordinate(geometry, point);
                }

                // return false if nearestResult is empty or distance is greater as searchRadius
                if (nearestResult.isEmpty || nearestResult.distance > searchRadius) {
                    return false;
                }

                // if distances of nearestResult and nearestPointResult are the same
                if (nearestResult.distance === nearestPointResult.distance) {
                    // for polylines compare both lengths and return false if the nearestResult has a greater length
                    if (type === "polyline") {
                        const l1 = planarLength(geometry.object.geometry);
                        const l2 = planarLength(nearestPointResult.objectGeometry.object.geometry);
                        if (l1 >= l2) {
                            return false;
                        }
                    }
                    // for polygons check if both poylgons contain the point
                    else if (type === "polygon") {
                        const c1 = geometry.object.geometry.contains(point);
                        const c2 = nearestPointResult.objectGeometry.object.geometry.contains(point);
                        // if both polygon contain the point compare the areas of both polygons
                        // and return false nearestResult has a greater area
                        if (c1 && c2) {
                            const a1 = planarArea(geometry.object.geometry);
                            const a2 = planarArea(nearestPointResult.objectGeometry.object.geometry);
                            if (a1 >= a2) {
                                return false;
                            }
                        }
                        // if the new result does not contain the point return false
                        else if (c2) {
                            return false;
                        }
                    }
                }

                // nearestPointResult is undefined or nearestResult is closer as the previous one
                if (!nearestPointResult.objectGeometry || nearestResult.distance <= nearestPointResult.distance) {
                    // replace nearestPointResult
                    nearestPointResult = nearestResult;
                    nearestPointResult.objectGeometry = geometry;
                    // return true if distance is 0 to stop the some()-method
                    return !nearestResult.distance;
                }
            });
            return nearestPointResult;
        },

        _filterGeometriesByType(geometries, type) {
            return geometries.filter(geometry => geometry.object?.geometry?.type === type);
        },

        _getSymbol(geometry) {
            switch (geometry.type) {
                case "point": {
                    return this.snapPointObjectSymbol;
                }
                case "polyline": {
                    return this.snapPolylineObjectSymbol;
                }
                case "polygon": {
                    return this.snapPolygonObjectSymbol;
                }
                default: {
                    return this.snapPolylineObjectSymbol;
                }
            }
        },

        _getSearchRadius() {
            const view = this._mapWidgetModel.view;
            return this.tolerance * view.resolution;
        },

        _getSketchViewModel() {
            return this._sketchingHandler._getSketchViewModel();
        },

        _setPointCoordinate(snappingPoint, point) {
            const view = this._mapWidgetModel.view;
            if (point.type === "point") {
                point.copy(snappingPoint);
            } else if (Array.isArray(point)) {
                point[0] = snappingPoint.x;
                point[1] = snappingPoint.y;
                point[2] !== undefined && (point[2] = snappingPoint.z);
                point[3] !== undefined && (point[3] = snappingPoint.m);
            } else {
                const screenPoint = view.toScreen(snappingPoint);
                point.x = screenPoint.x;
                point.y = screenPoint.y;
            }
        },

        _createPoint(coord) {
            const view = this._mapWidgetModel.view;
            if (Array.isArray(coord)) {
                const props = {
                    x: coord[0],
                    y: coord[1],
                    spatialReference: view.spatialReference
                };
                coord[2] && (props.z = coord[2]);
                coord[3] && (props.m = coord[3]);
                return new Point(props);
            } else {
                return view.toMap(coord);
            }
        },

        _isSnapAction() {
            // TODO: What are mandatory... used for?
            if (this._mandatoryWithoutSnappingMode) {
                return false;
            } else if (this._mandatoryWithSnappingMode) {
                return true;
            } else {
                // return this._editModel.snappingEnabled;
                return false;
            }
        },

        _snappingHandler(coordinateOrPoint, showSnappingGraphics) {
            if (coordinateOrPoint && this._isSnapAction()) {
                let moverPoint = coordinateOrPoint;
                if (coordinateOrPoint.type !== "point") {
                    moverPoint = this._createPoint(coordinateOrPoint);
                }
                const nearestPoint = this.getSnappingObject(moverPoint);
                const snappingPoint = nearestPoint.coordinate;
                this.removeSnappingGraphics();
                if (snappingPoint && nearestPoint.distance !== null && nearestPoint.distance !== undefined) {
                    this._setPointCoordinate(snappingPoint, coordinateOrPoint);
                    if (showSnappingGraphics) {
                        this.addSnappingGraphics(snappingPoint, nearestPoint.objectGeometry);
                    }
                    return snappingPoint;
                }
            } else {
                !this._mandatoryWithoutSnappingMode && this.removeSnappingGraphics();
            }
        },

        _addCreateSketchViewModelHandler() {
            const that = this;
            const viewModel = this._getSketchViewModel();

            this._ownHandler.add(d_aspect.before(viewModel, "reset", d_lang.hitch(this, this.removeSnappingGraphics)));
            this._ownHandler.add(d_aspect.after(viewModel, "_getReshape", res => {
                that._ownHandler.remove("after_getReshape");
                when(res, reshape => {
                    that._ownHandler.add(d_aspect.before(reshape, "_onGraphicMoveStopCallback",
                        d_lang.hitch(that, that._onGraphicMoveStopHandler)), "after_getReshape");
                })
                return res;
            }));

            this._ownHandler.add(d_aspect.after(viewModel, "create", (res) => {
                // eslint-disable-next-line no-unused-vars
                when(res, create => {
                    viewModel.activeComponent && that._addChangeDrawActiveActionHandler(viewModel.activeComponent);
                });
                return res;
            }));
        },

        _addChangeDrawActiveActionHandler(activeComponent) {
            this._ownHandler.remove("changeActiveAction");
            const activeAction = activeComponent && activeComponent.activeAction;
            if (activeAction) {
                const that = this;

                if (activeAction.__cursorScreenPoint === undefined) {
                    activeAction.__cursorScreenPoint = activeAction._cursorScreenPoint;
                    delete activeAction._cursorScreenPoint;
                    Object.defineProperty(activeAction, "_cursorScreenPoint", {
                        get: function () {
                            return this.__cursorScreenPoint;
                        }, set: function (e) {
                            this.__cursorScreenPoint = e;
                            e && setTimeout(function () {
                                that._onUpdateCursorHandler(activeAction.__cursorScreenPoint);
                            }, 0);
                        }
                    });
                }

                if (activeAction._addVertex) {
                    this._ownHandler.add(d_aspect.before(activeAction, "_addVertex",
                        d_lang.hitch(this, this._onAddVertexHandler)), "changeActiveAction");
                } else {
                    this._ownHandler.add(d_aspect.before(activeAction, "_completeDrawing", () => {
                        that._onAddVertexHandler(activeAction.coordinates);
                    }), "changeActiveAction");
                }
            }
        },

        _onUpdateCursorHandler(moverCoordinate) {
            this._snappingHandler(moverCoordinate, true);
        },

        _onAddVertexHandler(moverCoordinate) {
            this._snappingHandler(moverCoordinate, false);
        },

        _onGraphicMoveStopHandler(graphicMove) {
            const geometry = graphicMove.graphic.geometry;
            geometry.type === "point" && this._snappingHandler(geometry, false);
        }
    }
}
