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
import Polyline from "esri/geometry/Polyline";
import { MeasurementCalculator } from "./MeasurementCalculator";
import { MeasurementGraphicFactory } from "./MeasurementGraphicFactory";
import { AngleCalculator } from "./AngleCalculator";

export default class MeasurementHandler {

    handlers = [];

    activate() {
        if (!this.i18n) {
            this.i18n = this._i18n?.get();
        }
        this.calculator = new MeasurementCalculator(this._model, this.i18n);
        this.graphicFactory = new MeasurementGraphicFactory(this._model.textSettings);
        this.handlers.push(this._model?.watch('textSettings', ({value}) => (this.graphicFactory.textSettings = value)));
    }

    deactivate() {
        this.handlers.forEach(x => x.remove());
    }

    setProperties(value) {
        this._properties = value;
        Object.assign(this.calculator.settings, value);
    }

    // AREA Calculations
    /*
     * get Area of given geometry
     * @param geometry
     * @returns {string}
     * @private
     */
    getArea(geometry) {
        return this.calculator.getArea(geometry, this._model.areaUnit);
    }

    // Length Calculations

    /*
     * get Length of given geometry
     * @param geometry
     * @returns {string}
     * @private
     */
    getLength(geometry) {
        return this.calculator.getLength(geometry, this._model.lengthUnit);
    }

    /*
     * get Length of given geometry
     * @param length {number}
     * @returns {string}
     * @private
     */
    getLengthString(length) {
        return this.calculator.getLengthString(length, this._model.lengthUnit);
    }

    /*
     * calculates the length of the previous draw vector in meters
     * @param evt
     * @returns returns a number representing the previous laid vector in meters
     * @private
     */
    getLastSegmentLength(evt) {
        // this is to get the length of the set new segment
        const update = evt.type === 'update' || evt.type === 'undo' || evt.type === 'redo';
        const graphic = update ? evt.graphics[0] : evt.graphic;
        const vertices = graphic.geometry.paths ? graphic.geometry.paths : graphic.geometry.rings;
        const lastPath = vertices[0].slice(vertices[0].length - 2)
        const spatialReference = this._model.spatialReference;
        const geometry = new Polyline(lastPath, spatialReference);
        return this.calculator.getLength(geometry, this._model.lengthUnit);
    }

    // Other Calculations

    /*
     * get text position for total line length ('left'/'right'/'center')
     * @param path: line path
     * @returns {String}: ('left'/'right'/'center')
     * @private
     */
    getTextPosition(path) {
        const m = this.calculateSlope(path);
        const textPosition = (path[path.length - 2][0] - path[path.length - 1][0]) < 0 ? 'left' : 'right';
        return (m > 2 || m < -2) ? 'center' : textPosition;
    }

    getCenterOfPoint(g) {
        if (g.extent && g.extent.center) {
            return g.extent.center
        } else {
            return {
                x: g.x,
                y: g.y
            }
        }
    }

    /*
     * get yoffset for total line length
     * @param path: line path
     * @returns {number}
     * @private
     */
    getYOffset(path) {
        const m = this.calculateSlope(path);
        const yOffset = (path[path.length - 2][1] - path[path.length - 1][1]) < 0 ? 15 : -20;
        return (m < 1 && m > -1) ? 0 : yOffset;
    }

    /*
     * calculate the slope of the last part of the given path
     * @param path
     * @returns {number}
     * @private
     */
    calculateSlope(path) {
        return (path[path.length - 2][1] - path[path.length - 1][1]) / (path[path.length - 2][0] - path[path.length - 1][0]);
    }

    /*
     * gets and returns the coordinates of the drawn object
     * @param evt
     * @private
     */
    getCoordinates(evt) {
        if (evt && evt.tool === 'point') {
            if (evt.graphic) {
                // get the coordinates from the graphic
                return this.getCenterOfPoint(evt.graphic.geometry);
            } else {
                return evt;
            }
        } else if (evt && evt.toolEventInfo) {
            return evt.toolEventInfo.added || evt.toolEventInfo.coordinates
        } else {
            return null;
        }
    }

    /*
     * create text symbol with line length on cursor moves
     * @param checkedPath: path consisting of to points which define the line
     * @param spatialReference: spatial reference of the maps view
     * @param id: uid of the sketched polygon
     */
    createDistanceTextCursorUpdate(checkedPath, spatialReference, id) {
        const line = new Polyline(checkedPath, spatialReference);
        const lengthString = this.getLength(line);
        // calculate rotation angle for text
        const degAngle = -180 / Math.PI * Math.atan((checkedPath[1][1] - checkedPath[0][1]) / (checkedPath[1][0] - checkedPath[0][0]));
        const pnt = line.extent.center;

        return this.graphicFactory.createGraphic(lengthString, pnt, id, this._model.cursorUpdate, degAngle);
    }

    /*
     * create text symbol with line length on cursor moves
     * @param checkedPath: path consisting of to points which define the line
     * @param id: uid of the sketched polygon
     */
    createAngleTextCursorUpdate(p1, p2, p3, anglePoint, id) {
        const calculator = new AngleCalculator(p1, p2, p3, anglePoint, this._model._mapWidgetModel);
        const angleText = calculator.getAngle();

        let resultStringWithUnit;
        if (this._model.angleUnit === this.i18n.ui.angleUnit.unit1) {
            resultStringWithUnit = angleText + " °"
        } else {
            let number = parseInt(angleText);
            number = number / 360 * 400;
            resultStringWithUnit = number.toFixed(0) + " gon";
        }

        const graphic = this.graphicFactory.createGraphic(resultStringWithUnit, calculator.getPoint(), id, this._model.cursorUpdate, undefined);
        graphic.setAttribute("type", "angle");
        return graphic;
    }

    removeGraphicsById(id) {
        const gs = this.viewModel.layer.graphics.items.filter(graphic => {
            const textGraphicId = graphic.getAttribute("id");
            if (textGraphicId) {
                return textGraphicId === id;
            }
        });
        this.viewModel.layer.removeMany(gs);
    }

    removeTextGraphicsById(id) {
        const gs = this.viewModel.layer.graphics.items.filter(graphic => {
            const type = graphic.getAttribute("type");
            const textGraphicId = graphic.getAttribute("id");
            if (textGraphicId) {
                return textGraphicId === id && type && type === "text";
            }
        });
        this.viewModel.layer.removeMany(gs);
    }

    removeGraphicsByIdAndType(id, type) {
        const gs = this.viewModel.layer.graphics.items.filter(graphic => {
            const graphicType = graphic.getAttribute("type");
            const textGraphicId = graphic.getAttribute("id");
            if (textGraphicId && graphicType) {
                return textGraphicId === id && graphicType === type;
            }
        });
        this.viewModel.layer.removeMany(gs);
    }

    removeTemporaryMeasurements(evt) {
        const update = evt.type === 'update' || evt.type === 'undo' || evt.type === 'redo';
        const graphic = update ? evt.graphics[0] : evt.graphic;
        if (!graphic) return;
        const id = graphic.getAttribute("id") || `measurement-${graphic.uid}`;
        const viewModel = this.viewModel;
        const gs = viewModel.layer.graphics.items.filter(g => {
            const type = g.getAttribute("type");
            const textGraphicId = g.getAttribute("id");
            const temporary = g.symbol?.temporary;
            if (textGraphicId) {
                return g.getAttribute("id") === id && type && type === "text" && temporary;
            }
        });
        viewModel.layer.removeMany(gs);
    }

    stringIsDuplicate(text) {
        const gs = this.viewModel.layer.graphics.items.filter(graphic => {
            if (graphic.symbol) {
                return graphic.symbol.text === text;
            }
        });
        return gs.length > 0;
    }

    setGraphicAttributes(evt, showLinesAttr) {
        if (!evt.graphic.getAttribute("id")) {
            evt.graphic.setAttribute("id", `measurement-${evt.graphic.uid}`);
        }
        evt.graphic.setAttribute("measurementEnabled", this._model.measurementEnabled);
        if (showLinesAttr) {
            const showLines = (evt.tool === 'triangle' || evt.tool === 'rectangle') ? false
                : this._model[showLinesAttr];
            evt.graphic.setAttribute(showLinesAttr, showLines);
        }
    }

    /*
     * switch method that sets data model measurement properties with mouse cursor movement
     * @param evt from mouse cursor movement
     * @private
     */
    showActiveResultsInTab(evt) {
        const update = evt.type === 'update' || evt.type === 'undo' || evt.type === 'redo';
        const graphic = update ? evt.graphics[0] : evt.graphic;
        const activeTool = evt.activeTool;
        
        switch (activeTool) {
            case("drawpolylinetool"):
            case ("drawfreehandpolylinetool"):
                this._model.currentLength = this.getLastSegmentLength(evt);
                this._model.aggregateLength =this.getLength(graphic.geometry)
                break;
            case("drawpolygontool"):
            case("drawfreehandpolylgontool"):
                this._model.currentLength = this.getLastSegmentLength(evt);
                this._model.currentArea = this.getArea(graphic.geometry);
                break;
            case("drawrectangletool"):
            case("drawcircletool"):
            case("drawtriangletool"):
            case("drawellipsetool"):
                this._model.perimeter = this.getLength(graphic.geometry);
                this._model.area = this.getArea(graphic.geometry);
                break;
            case(null):
                break;
        }
    }

    /**
     * switch method that sets data model measurement properties with mouse cursor movement
     * @param evt after shape drawn (click)
     * @private
     */
    showCompleteResultsInTab(evt) {
        const update = evt.type === 'update' || evt.type === 'undo' || evt.type === 'redo';
        const graphic = update ? evt.graphics[0] : evt.graphic;
        const activeTool = evt.activeTool;

        switch (activeTool) {
            case("drawpolylinetool"):
            case("drawfreehandpolylinetool"):
                this._model.currentLength = this.getLengthString(0);
                this._model.totalLength = this.getLength(graphic.geometry);
                break;
            case("drawpolygontool"):
            case("drawfreehandpolylgontool"):
                this._model.currentLength = this.getLengthString(0);
                this._model.perimeter = this.getLength(graphic.geometry);
                this._model.area = this.getArea(graphic.geometry)
                break;
            case("drawrectangletool"):
            case("drawcircletool"):
            case("drawtriangletool"):
            case("drawellipsetool"):
                this._model.perimeter = this.getLength(graphic.geometry);
                this._model.area = this.getArea(graphic.geometry);
                break;
            case(null):
                break;
        }
    }

    /*
     * resets all measurements on the data model
     * @param none
     * @public
     */
    resetMeasurementResults() {
        this._model._lastVertex = null;
        this._model.coordinates = null;
        this._model.currentLength = 0;
        this._model.aggregateLength = 0
        this._model.totalLength = 0;
        this._model.area = 0;
        this._model.currentArea = 0;
        this._model.perimeter = 0;
    }
}
