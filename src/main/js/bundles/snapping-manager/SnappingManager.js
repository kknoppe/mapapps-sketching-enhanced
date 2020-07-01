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
import geometryEngine from "esri/geometry/geometryEngine";
import Point from "esri/geometry/Point";
import {fromJSON} from "esri/symbols/support/jsonUtils";
import ct_async from "ct/async";
import ct_when from "ct/_when";

import Extent from "esri/geometry/Extent"

export default function () {
    return {
        //injected
        _highlightHandler: null,
        _sketchingHandler: null,
        _snappingSourceModels: [],

        // props
        alwaysSnap: null,
        snapKeys: null,
        tolerance: null,

        //local
        _ownHandler: new Handles(),
        _snapPointGrapic: null,
        _snapObjectGrapic: null,
        _latestSnappingObject: {},
        _checkShouldSnapping: null,
        _mandatoryWithSnappingMode: false,
        _mandatoryWithoutSnappingMode: false,

        activate() {
            const props = this._properties;
            this.alwaysSnap = !!props.alwaysSnap;
            this.snapKeys = props.snapKeys || ["alt"];
            this.tolerance = props.tolerance || 15;

            this.snapPointSymbol = fromJSON(props.snapPointSymbol);
            this.snapPointObjectSymbol = fromJSON(props.snapPointObjectSymbol);
            this.snapPolygonObjectSymbol = fromJSON(props.snapPolygonObjectSymbol);
            this.snapPolylineObjectSymbol = fromJSON(props.snapPolylineObjectSymbol);
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

        getGeometries(extent) {
            let geometries;
            this._snappingSourceModels.forEach((sourceModel) => {
                let fs = sourceModel.getGeometries();
                extent && (fs = fs.filter(geo => {
                    return extent.intersects(geo.object && geo.object.geometry || geo);
                }));
                if (fs.length) {
                    geometries ? (geometries = geometries.concat(fs)) : geometries = fs;
                }
            });

            return geometries || [];
        },

        getLatestSnappingObject() {
            return this._latestSnappingObject;
        },

        getSnappingObject(point) {
            const searchRadius = this._getSearchRadius();
            const distance = searchRadius + searchRadius;
            const extent = new Extent({
                xmin: point.x - distance,
                ymin: point.y - distance,
                xmax: point.x + distance,
                ymax: point.y + distance,
                spatialReference: point.spatialReference
            });

            const geometries = this.getGeometries(extent);

            let nearestPointResult = {};
            if (geometries.length) {
                nearestPointResult.objectGeometry || (nearestPointResult = this._getSnappingObject(point, geometries, "point", searchRadius));
                nearestPointResult.objectGeometry || (nearestPointResult = this._getSnappingObject(point, geometries, "polyline", searchRadius));
                nearestPointResult.objectGeometry || (nearestPointResult = this._getSnappingObject(point, geometries, "polygon", searchRadius));
            }
            this._latestSnappingObject = nearestPointResult;
            return nearestPointResult;
        },

        _getSnappingObject(point, geometries, type, searchRadius) {
            const nearestPointResult = {};
            const checkShouldSnapping = this._checkShouldSnapping;
            this._filterGeometries(geometries, type).some(geometry => {
                const shouldSnapping = !checkShouldSnapping || checkShouldSnapping(point, geometry);
                if (!shouldSnapping) {
                    return false;
                }

                //point, polyline, polygon
                let nearestResult = geometryEngine.nearestVertex(geometry, point);

                //polyline, polygon
                if (type !== "point" && (nearestResult.isEmpty || nearestResult.distance > searchRadius)) {
                    nearestResult = geometryEngine.nearestCoordinate(geometry, point);
                }

                //point, polyline, polygon
                if (nearestResult.isEmpty || nearestResult.distance > searchRadius) {
                    return false;
                }

                //polyline, polygon
                if (nearestResult.distance === nearestPointResult.distance) {
                    if (type === "polyline") {
                        const l1 = geometryEngine.planarLength(geometry.object.geometry);
                        const l2 = geometryEngine.planarLength(nearestPointResult.objectGeometry.object.geometry);
                        if (l1 >= l2) {
                            return false;
                        }
                    } else if (type === "polygon") {
                        const c1 = geometry.object.geometry.contains(point);
                        const c2 = nearestPointResult.objectGeometry.object.geometry.contains(point);
                        if (c1 && c2) {
                            const a1 = geometryEngine.planarArea(geometry.object.geometry);
                            const a2 = geometryEngine.planarArea(nearestPointResult.objectGeometry.object.geometry);
                            if (a1 >= a2) {
                                return false;
                            }
                        } else if (c2) {
                            return false;
                        }
                    }
                }

                //point, polyline, polygon
                if (!nearestPointResult.objectGeometry || nearestResult.distance <= nearestPointResult.distance) {
                    d_lang.mixin(nearestPointResult, nearestResult, {objectGeometry: geometry});
                    return !nearestResult.distance;
                }
            });
            return nearestPointResult;
        },

        _filterGeometries(geometries, type) {
            return geometries.filter(geometry => {
                return !geometry._moveSelf && (!geometry.object || !geometry.object.geometry || geometry.object.geometry.type === type);
            });
        },

        addSnappingGraphics(point, geometry) {
            this._snapPointGrapic = this._createGraphic(point, this.snapPointSymbol);
            this._snapObjectGrapic = this._createGraphic(geometry);
            this._snapPointGrapic.layer.addMany([this._snapObjectGrapic, this._snapPointGrapic]);
        },

        removeSnappingGraphics() {
            if (this._snapPointGrapic) {
                this._snapPointGrapic.layer.removeMany([this._snapPointGrapic, this._snapObjectGrapic]);
                this._snapPointGrapic = null;
                this._snapObjectGrapic = null;
            }
        },

        _createGraphic(geometry, symbol) {
            if (!symbol) {
                switch (geometry.type) {
                    case "point" : {
                        symbol = this.snapPointObjectSymbol;
                        break;
                    }
                    case "polyline" : {
                        symbol = this.snapPolylineObjectSymbol;
                        break;
                    }
                    case "polygon" :
                        symbol = this.snapPolygonObjectSymbol;
                        break;
                    default: {
                        symbol = this.snapPolylineObjectSymbol;
                        break;
                    }
                }
            }

            return this._highlightHandler._createGraphic(geometry, {snapping: true}, symbol);
        },

        _getSearchRadius() {
            const view = this._getSketchViewModel().view;
            return this.tolerance * view.resolution;
        },

        _getSketchViewModel() {
            return this._sketchingHandler._getSketchViewModel();
        },

        _setPointCoordinate(coord, point, view) {
            if (point.type === "point") {
                point.copy(coord);
            } else if (Array.isArray(point)) {
                point[0] = coord.x;
                point[1] = coord.y;
                point[2] !== undefined && (point[2] = coord.z);
                point[3] !== undefined && (point[3] = coord.m);
            } else {
                const screenPoint = view.toScreen(coord);
                point.x = screenPoint.x;
                point.y = screenPoint.y;
            }
            return point;
        },

        _createPoint(coord, view) {
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
            if (this._mandatoryWithoutSnappingMode) {
                return false;
            } else if (this._mandatoryWithSnappingMode) {
                return true;
            } else {
                const snapMode = this.alwaysSnap;
                const hasSnapKeyDown = false;
                return snapMode && !hasSnapKeyDown || !snapMode && hasSnapKeyDown;
            }
        },

        _snappingHandler(moverCoordinate, showSnappingGraphics, moveToSnapPoint = true) {
            if (moverCoordinate && this._isSnapAction() && moverCoordinate.type !== "multipoint") {
                const viewModel = this._getSketchViewModel();
                const moverPoint = moverCoordinate.type === "point" ? moverCoordinate : this._createPoint(moverCoordinate, viewModel.view);
                const nearestPoint = this.getSnappingObject(moverPoint);
                const snapCoordinate = nearestPoint.coordinate;
                this.removeSnappingGraphics();
                if (snapCoordinate && nearestPoint.distance !== null && nearestPoint.distance !== undefined) {
                    moveToSnapPoint && this._setPointCoordinate(snapCoordinate, moverCoordinate, viewModel.view);
                    showSnappingGraphics && this.addSnappingGraphics(snapCoordinate, nearestPoint.objectGeometry);
                    return snapCoordinate;
                }
            } else {
                !this._mandatoryWithoutSnappingMode && this.removeSnappingGraphics();
            }
        },

        _addCreateSketchViewModelHandler() {
            let that = this;
            const viewModel = this._getSketchViewModel();

            //viewMondel
            this._ownHandler.add(d_aspect.before(viewModel, "reset", d_lang.hitch(this, this.removeSnappingGraphics)));
            this._ownHandler.add(d_aspect.before(viewModel, "_emitUpdateEvent", d_lang.hitch(this, this._onUpdateHandler)));
            this._ownHandler.add(d_aspect.after(viewModel, "_getReshape", res => {
                that._ownHandler.remove("after_getReshape");
                ct_when(res, reshape => {
                    // that._ownHandler.add(d_aspect.before(reshape, "_onGraphicMoveCallback", d_lang.hitch(that, that._onGraphicMoveHandler)), "after_getReshape");
                    that._ownHandler.add(d_aspect.before(reshape, "_onGraphicMoveStopCallback", d_lang.hitch(that, that._onGraphicMoveStopHandler)), "after_getReshape");
                });
                return res;
            }));


            this._ownHandler.add(d_aspect.after(viewModel, "create", (res) => {
                const operationHandle = viewModel._operationHandle;
                operationHandle && that._addChangeDrawActiveActionHandler(operationHandle.activeComponent);
                return res;
            }));
        },

        _addChangeDrawActiveActionHandler(activeComponent) {
            this._ownHandler.remove("changeActiveAction");
            const activeAction = activeComponent && activeComponent.activeAction;
            if (activeAction) {
                const that = this;
                // this._ownHandler.add(d_aspect.before(activeAction, "_updateCursor", () => {
                //     activeAction._cursorScreenPoint && that._onUpdateCursorHandler(activeAction._cursorScreenPoint);
                // }), "changeActiveAction");

                // this._ownHandler.add(activeAction.watch("_cursorScreenPoint", () => {
                //     activeAction._cursorScreenPoint && that._onUpdateCursorHandler(activeAction._cursorScreenPoint);
                // }), "changeActiveAction");

                if (activeAction.__cursorScreenPoint === undefined) {
                    activeAction.__cursorScreenPoint = activeAction._cursorScreenPoint;
                    delete activeAction._cursorScreenPoint;
                    Object.defineProperty(activeAction, "_cursorScreenPoint", {
                        get: function () {
                            return this.__cursorScreenPoint;
                        }, set: function (e) {
                            this.__cursorScreenPoint = e;
                            e && setTimeout(function(){that._onUpdateCursorHandler(activeAction.__cursorScreenPoint);},0);
                        }
                    });
                }


                if (activeAction._addVertex) {
                    this._ownHandler.add(d_aspect.before(activeAction, "_addVertex", d_lang.hitch(this, this._onAddVertexHandler)), "changeActiveAction");
                } else {
                    this._ownHandler.add(d_aspect.before(activeAction, "_completeDrawing", () => {
                        that._onAddVertexHandler(activeAction.coordinates);
                    }), "changeActiveAction");
                }
            }
        },

        _setMoveSelfPoint(gemetry) {
            gemetry.type === "point" && this.getGeometries().forEach((g) => {
                g.type === "point" && g.distance(gemetry) < 0.1 && (g._moveSelf = true);
            });
        },

        _onUpdateCursorHandler(moverCoordinate) {
            this._snappingHandler(moverCoordinate, true);
        },

        _onAddVertexHandler(moverCoordinate) {
            this._snappingHandler(moverCoordinate, false);
        },

        _onGraphicMoveHandler(graphicMove) {
        },

        _onGraphicMoveStopHandler(graphicMove) {
            const geometry = graphicMove.graphic.geometry;
            geometry.type === "point" && this._snappingHandler(geometry, false);
        },

        _onUpdateHandler(evt) {
            const tool = evt.tool;
            const toolEventInfo = evt.toolEventInfo;

            const mover = toolEventInfo && toolEventInfo.mover;
            const toolEventType = toolEventInfo && toolEventInfo.type;
            const isStop = toolEventType && toolEventType.includes("-stop");
            const isStart = toolEventType && toolEventType.includes("-start");
            if (isStart || isStop || !mover || !this._isSnapAction()) {
                this.removeSnappingGraphics();
                isStart && mover && this._setMoveSelfPoint(mover.geometry);
            } else if (tool === "move") {
                this._snappingHandler(mover.geometry, !isStop);
            } else if (tool === "reshape" && toolEventType.includes("reshape")) {
                const moverPoint = mover.geometry;
                const coordinate = this._snappingHandler(moverPoint, !isStop, isStop);
                if (coordinate) {
                    const attributes = mover.attributes;
                    const graphics = evt.graphics || [evt.graphic];
                    const graphicGeometry = graphics[0].geometry;
                    const rings = graphicGeometry.type === "polygon" ? graphicGeometry.rings : graphicGeometry.paths;
                    const ring = rings[attributes.pathIndex];
                    const graphicPoint = ring[attributes.pointIndex];

                    this._setPointCoordinate(coordinate, graphicPoint);
                    if (graphicGeometry.type === "polygon") {
                        attributes.pointIndex === 0 && this._setPointCoordinate(coordinate, ring[ring.length - 1]);
                        attributes.pointIndex === ring.length - 1 && this._setPointCoordinate(coordinate, ring[0]);
                    }
                }
            }
        }
    }
}
