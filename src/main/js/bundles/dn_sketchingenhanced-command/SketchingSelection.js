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
import {fromJSON} from "esri/symbols/support/jsonUtils";
import * as geometryEngine from "esri/geometry/geometryEngine";

export default function () {
    return {
        //injected
        _sketchingHandler: null,
        _sketchingCommand: null,
        _snappingManager: null,

        //props
        geometryTypes: null,
        pointSymbol: null,
        polygonSymbol: null,
        polylineSymbol: null,
        snapPointPMSymbol: null,
        snapPolylinePlusObjectSymbol: null,
        snapPolylineMinusObjectSymbol: null,

        //local
        _highlightGraphics: null,
        _sketchType: null,
        _sketchState: null,
        _viewModel: null,
        _pointerHandler: null,
        _pointerEvt: null,
        _mandatoryWithSnappingMode: null,
        _mandatoryWithSnappingModeTool: null,

        activate() {
            const props = this._properties;
            this.geometryTypes = props.geometryTypes;
            this.pointSymbol = fromJSON(props.pointSymbol);
            this.polygonSymbol = fromJSON(props.polygonSymbol);
            this.polylineSymbol = fromJSON(props.polylineSymbol);
            this.snapPointPMSymbol = fromJSON(props.snapPointPMSymbol);
            this.snapPolylineReshapeSymbol = fromJSON(props.snapPolylineReshapeSymbol);
            this.snapPolylinePlusObjectSymbol = fromJSON(props.snapPolylinePlusObjectSymbol);
            this.snapPolylineMinusObjectSymbol = fromJSON(props.snapPolylineMinusObjectSymbol);
            this.snapPolylineIntersectObjectSymbol = fromJSON(props.snapPolylineIntersectObjectSymbol);
        },

        deactivate() {
            this._pointerHandler && this._pointerHandler.remove();
        },

        set_sketchingHandler(sketchingHandler) {
            this._sketchingHandler = sketchingHandler;
        },

        set_snappingManager(snappingManager) {
            this._snappingManager = snappingManager;

            this._mandatoryWithSnappingMode = snappingManager._mandatoryWithSnappingMode;
            this.snapPointSymbol = snappingManager.snapPointSymbol;
            this.snapPointObjectSymbol = snappingManager.snapPointObjectSymbol;
            this.snapPolygonObjectSymbol = snappingManager.snapPolygonObjectSymbol;
            this.snapPolylineObjectSymbol = snappingManager.snapPolylineObjectSymbol;
            this.snap_fun_filterGeometries = snappingManager._filterGeometries;
            this.snap_fun_checkShouldSnapping = snappingManager._checkShouldSnapping;
            this.snap_fun_getSnappingObject = d_lang.hitch(snappingManager, snappingManager._getSnappingObject);
        },

        ACTIVATE_drawreshape1tool() {
            this._setSnappingSelectProps();
            const snappingManager = this._snappingManager;
            snappingManager.snapPolylineObjectSymbol = this.snapPolylineReshapeSymbol;
            snappingManager._checkShouldSnapping = d_lang.hitch(this, this._checkShouldSnappingReshapeUnselectedGraphics);
            snappingManager._filterGeometries = this.snap_fun_filterGeometries;
        },

        ACTIVATE_drawreshape2tool() {
            this._setSnappingSelectProps();
            const snappingManager = this._snappingManager;
            snappingManager.snapPolylineObjectSymbol = this.snapPolylineReshapeSymbol;
            snappingManager._checkShouldSnapping = d_lang.hitch(this, this._checkShouldSnappingReshapeGraphics);
            snappingManager._filterGeometries = this.snap_fun_filterGeometries;
        },

        ACTIVATE_drawselectioncreateuniontool() {
            this._setSnappingSelectProps();
            const snappingManager = this._snappingManager;
            snappingManager.snapPolylineObjectSymbol = this.snapPolylinePlusObjectSymbol;
            snappingManager._checkShouldSnapping = d_lang.hitch(this, this._checkShouldSnappingPlus);
        },

        ACTIVATE_drawselectioncreatedifferencetool() {
            this._setSnappingSelectProps();
            const snappingManager = this._snappingManager;
            snappingManager.snapPolylineObjectSymbol = this.snapPolylineMinusObjectSymbol;
            snappingManager._checkShouldSnapping = d_lang.hitch(this, this._checkShouldSnappingMinus);
        },

        ACTIVATE_drawselectioncreateintersecttool() {
            this._setSnappingSelectProps();
            const snappingManager = this._snappingManager;
            snappingManager.snapPolylineObjectSymbol = this.snapPolylineIntersectObjectSymbol;
            snappingManager._checkShouldSnapping = d_lang.hitch(this, this._checkShouldSnappingMinus);
        },

        ACTIVATE_drawselectiontool() {
            this._setSnappingSelectProps();
            const snappingManager = this._snappingManager;
            snappingManager.snapPolylineObjectSymbol = this.snapPolylinePlusObjectSymbol;
            snappingManager._filterGeometries = this.snap_fun_filterGeometries;
        },

        DEACTIVATE_drawselectiontool() {
            this._resetSnappingProps();
        },

        _setSnappingSelectProps() {
            const snappingManager = this._snappingManager;
            this._mandatoryWithSnappingMode = snappingManager._mandatoryWithSnappingMode;
            this._mandatoryWithSnappingModeTool = true;
            snappingManager._mandatoryWithSnappingMode = true;
            snappingManager.snapPointSymbol = this.snapPointPMSymbol;
            snappingManager.snapPointObjectSymbol = this.pointSymbol;
            snappingManager.snapPolygonObjectSymbol = this.polygonSymbol;
            snappingManager.snapPolylineObjectSymbol = this.polylineSymbol;
            snappingManager._filterGeometries = d_lang.hitch(this, this._filterGeometries);
            snappingManager._getSnappingObject = d_lang.hitch(this, this._getSnappingObject);
        },

        _resetSnappingProps() {
            const snappingManager = this._snappingManager;
            this._mandatoryWithSnappingModeTool = false;
            snappingManager._mandatoryWithSnappingMode = this._mandatoryWithSnappingMode;
            snappingManager.snapPointSymbol = this.snapPointSymbol;
            snappingManager.snapPointObjectSymbol = this.snapPointObjectSymbol;
            snappingManager.snapPolygonObjectSymbol = this.snapPolygonObjectSymbol;
            snappingManager.snapPolylineObjectSymbol = this.snapPolylineObjectSymbol;
            snappingManager._filterGeometries = this.snap_fun_filterGeometries;
            snappingManager._checkShouldSnapping = this.snap_fun_checkShouldSnapping;
            snappingManager._getSnappingObject = this.snap_fun_getSnappingObject;
        },

        _filterGeometries(geometries, type) {
            return !this._checkShouldSelectByGeometryType(type) ? [] : this.snap_fun_filterGeometries(geometries, type);
        },

        _checkShouldSelectByGeometryType(type) {
            const types = this.geometryTypes || [];
            return !types.length || types.includes(type);
        },

        _checkShouldSnappingReshapeGraphics(point, geometry) {
            return this._sketchType === "update" && this._sketchState === "active" || geometry.object.declaredClass === "esri.Graphic";
        },

        _checkShouldSnappingReshapeUnselectedGraphics(point, geometry) {
            let should = this._sketchType === "update" && this._sketchState === "active";
            if (!should && geometry.object.declaredClass === "esri.Graphic") {
                const viewModel = this._getSketchViewModel();
                const selectedGraphics = viewModel._getSelectedGraphics();
                should = !viewModel._selectedGraphicsActive || selectedGraphics.length === 0 || geometry.object.uid !== selectedGraphics[0].uid;
            }
            return should;
        },

        _checkShouldSnappingPlus(point, geometry) {
            return this._checkShouldSnappingByGeometryType(point, geometry)
                && !this._checkShouldSnappingByPoint(point, geometry)
                && !this._checkShouldSnappingByOperator(point, geometry, "contains");
        },

        _checkShouldSnappingMinus(point, geometry) {
            return this._checkShouldSnappingByGeometryType(point, geometry)
                && !this._checkShouldSnappingByPoint(point, geometry)
                && this._checkShouldSnappingByOperator(point, geometry, "intersects")
                && !this._checkShouldSnappingByOperator(point, geometry, "touches");
        },

        _checkShouldSnappingByGeometryType(point, geometry) {
            const viewModel = this._getSketchViewModel();
            const selectedGraphics = viewModel._getSelectedGraphics();
            if (!viewModel._selectedGraphicsActive || !selectedGraphics.length) {
                return true;
            } else {
                const oType = geometry.object.geometry.type;
                const sType = selectedGraphics[0].geometry.type;
                return oType.includes(sType) || sType.includes(oType);
            }
        },

        _checkShouldSnappingByPoint(point, geometry) {
            const geo = geometry.object.geometry;
            return geo.type === "polygon" && disjoint(geo, point);
        },

        _checkShouldSnappingByOperator(point, geometry, operator) {
            const geo = geometry.object.geometry;
            const viewModel = this._getSketchViewModel();
            const selectedGraphics = viewModel._getSelectedGraphics();
            return selectedGraphics.some(selectedGraphic => {
                return geometryEngine[operator](selectedGraphic.geometry, geo);
            });
        },

        _getSnappingObject(point, geometries, type, searchRadius) {
            const nearestPointResult = this.snap_fun_getSnappingObject(point, geometries, type, searchRadius);
            if (!nearestPointResult.objectGeometry && type === "polygon") {
                let geo = null;
                let area = -1;
                const checkShouldSnapping = this._snappingManager._checkShouldSnapping;
                this._filterGeometries(geometries, type).forEach(geometry => {
                    if (!checkShouldSnapping || checkShouldSnapping(point, geometry)) {
                        const oGeo = geometry.object.geometry;
                        if (oGeo.contains(point)) {
                            const a = geometryEngine.planarArea(oGeo);
                            if (area === -1 || area > a) {
                                area = a;
                                geo = geometry;
                            }
                        }
                    }
                });

                if (geo) {
                    const nearestResult = geometryEngine.nearestCoordinate(geo.object.geometry, point);
                    d_lang.mixin(nearestPointResult, nearestResult, {objectGeometry: geo});
                }
            }

            return nearestPointResult;
        },

        activateObject() {
            const viewModel = this._getSketchViewModel();
            viewModel._selectedGraphicsActive = true;
            viewModel.reset();
            this._addHighlightGraphics(viewModel._getSelectedGraphics());
        },

        deactivateObject() {
            const viewModel = this._getSketchViewModel();
            viewModel._selectedGraphicsActive = false;
            viewModel.reset();
            this._removeHighlightGraphics();
        },

        setActiveObject(graphics) {
            this._setSelectedGraphics(graphics);
        },

        removeActiveObject() {
            this._removeSelectedGraphics();
        },

        _getSketchViewModel() {
            return this._sketchingHandler._getSketchViewModel();
        },

        _getSymbol(geometry) {
            return this[geometry.type + "Symbol"] || this.pointSymbol;
        },

        _setSelectedGraphics(selectedGraphics) {
            const viewModel = this._getSketchViewModel();
            viewModel._setSelectedGraphics(selectedGraphics);
            viewModel._selectedGraphicsActive = true;
            viewModel.reset();
            this._addHighlightGraphics(selectedGraphics);
        },
        _removeSelectedGraphics() {
            const viewModel = this._getSketchViewModel();
            const selectedGraphics = viewModel._getSelectedGraphics();
            if (viewModel._selectedGraphicsActive) {
                viewModel.layer.removeMany(selectedGraphics);
                viewModel._selectedGraphicsActive = false;
                viewModel._setSelectedGraphics([]);
                viewModel.reset();
            }
            this._removeHighlightGraphics();
        },
        _getGeometryBySelectedGraphics() {
            const viewModel = this._getSketchViewModel();
            return !viewModel._selectedGraphicsActive ? [] : viewModel._getSelectedGraphics().map(selectedGraphic => {
                return selectedGraphic.geometry;
            })
        },

        _getGeometryBySnappingObject(snapPoint) {
            return snapPoint.objectGeometry ? snapPoint.objectGeometry.object.geometry : null;
        },

        _addHighlightGraphics(selectedGraphics) {
            if (selectedGraphics.length) {
                const context = {"selected": true, sketching: true};
                const highlightHandler = this._highlightHandler;
                this._highlightGraphics = selectedGraphics.map(graphic => {
                    return highlightHandler._createGraphic(graphic.geometry, context, this._getSymbol(graphic.geometry));
                });
                highlightHandler.addManyGraphics(this._highlightGraphics);
            }
        },
        _removeHighlightGraphics() {
            if (this._highlightGraphics && this._highlightGraphics.length) {
                const highlightHandler = this._highlightHandler;
                this._highlightGraphics.length && highlightHandler._removeGraphics(this._highlightGraphics);
                this._highlightGraphics = [];
            }
        },

        _setViewModel(viewModel) {
            if (!this._viewModel) {
                this._viewModel = viewModel;
                this._pointerHandler = viewModel.view.on("pointer-move", (evt) => {
                    this._pointerEvt = evt;
                });
            }
        },

        _getLastPointerGeoPoint() {
            const pointer = this._pointerEvt;
            if (pointer) {
                const view = this._viewModel.view;
                return view.toMap({
                    x: pointer.x,
                    y: pointer.y
                });
            }
        },

        _handler(operator) {
            const snapPoint = this._snappingManager.getLatestSnappingObject();
            const geo = this._getGeometryBySnappingObject(snapPoint);
            if (geo) {
                const sketchingHandler = this._sketchingHandler;
                const sketchingCommand = this._sketchingCommand;
                if (operator === "selectReshape") {
                    sketchingHandler._update([snapPoint.objectGeometry.object], false, "reshape");
                } else if (operator === "selectTransform") {
                    sketchingHandler._update([snapPoint.objectGeometry.object], false, "transform");
                } else if (operator === "selectCopy" || operator === "selectBuffer") {
                    sketchingCommand._resetAndAddAndUpdate(sketchingCommand._getGeometry(geo, operator));
                } else {
                    const geometry = sketchingCommand._getGeometry(geo, operator, this._getGeometryBySelectedGraphics());
                    !geometry && tool.set("active", false);
                    this._removeSelectedGraphics();
                    geometry && this._setSelectedGraphics([sketchingHandler._addGraphic(geometry)]);
                }
            }
        },

        handler(evt) {
            const type = this._sketchType = evt.type;
            const state = this._sketchState = evt.state;
            const viewModel = this._sketchingHandler.sketchViewModel;
            const graphics = evt.graphics || [evt.graphic];
            const firstGraphic = graphics.length && graphics[0];
            const snappingManager = this._snappingManager;

            const tool = viewModel.tool;
            const operator = tool && tool.type || "";
            const selectedGraphics = viewModel._getSelectedGraphics();

            this._setViewModel(viewModel);
            if (type === "remove") {
                this._removeHighlightGraphics();
                viewModel._selectedGraphicsActive && this._addHighlightGraphics(viewModel._getSelectedGraphics());
            } else if (type === "update" && firstGraphic && selectedGraphics && selectedGraphics.length) {
                if (state !== "active" && selectedGraphics[0].uid === firstGraphic.uid) {
                    state === "start" && this.deactivateObject();
                    (state === "cancel" || state === "complete") && this.activateObject();
                }
                if ((state === "cancel" || state === "complete") && operator.startsWith("select")) {
                    const point = this._getLastPointerGeoPoint();
                    if (point) {
                        setTimeout(() => {
                            snappingManager.getSnappingObject(point);
                            this._handler(operator);
                            this._mandatoryWithSnappingModeTool && (snappingManager._mandatoryWithSnappingMode = true);
                        }, 10);
                    }
                }
            } else if (type === "create" && state === "complete" && firstGraphic && operator.startsWith("select")) {
                // if sketching object was selected -> save symbol for copying
                const geoEngine = geometryEngine;
                viewModel.layer.graphics.items.forEach(graphic => {
                    if (graphic.geometry && graphic.geometry.contains && graphic.geometry.contains(evt.graphic.geometry)) {
                        this._sketchingCommand.selectedSymbol = graphic.symbol;
                    } else if (graphic.geometry && graphic.geometry !== evt.graphic.geometry && geoEngine.intersect(graphic.geometry, evt.graphic.geometry)) {
                        this._sketchingCommand.selectedSymbol = graphic.symbol;
                    }
                });
                viewModel.get("layer").removeMany(graphics);
                setTimeout(() => {
                    this._mandatoryWithSnappingModeTool && (snappingManager._mandatoryWithSnappingMode = this._mandatoryWithSnappingMode);
                    this._handler(operator);
                }, 10);
            }
        }
    }
}
