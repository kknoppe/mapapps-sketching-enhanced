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
import * as geoEngine from 'esri/geometry/geometryEngine';
import TextSymbol from "esri/symbols/TextSymbol";
import Graphic from "esri/Graphic";
import ct_geometry from "ct/mapping/geometry";
import Point from "esri/geometry/Point";
import { MeasurementCalculator } from "./MeasurementCalculator";

export default class MeasurementHandler {

    activate() {
        if (!this.i18n) {
            this.i18n = this._i18n?.get();
        }
        this.calculator = new MeasurementCalculator(this._model, this.i18n);
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

    /*
     * get Area of given geometry
     * @param area {number}
     * @returns {string}
     * @private
     */
    getAreaString(area) {
        return this.calculator.getAreaString(area, this._model.areaUnit);
    }

    /*
     * get Area of given geometry in meters squared
     * @param geometry
     * @returns {number}
     * @private
     */
    getAreaNumeric(geometry, unit) {
        return this.calculator.getAreaNumeric(geometry, unit);        
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
        return this.calculator.getLengthNumeric(geometry, this._model.lengthUnit);
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
        const textSymbol = new TextSymbol({
            angle: degAngle,
            text: lengthString,
            flag: "measurementText",
            color: this._model.textSettings.color,
            id: `measurement-${id}`,
            font: this._model.textSettings.font,
            haloColor: this._model.textSettings.haloColor,
            haloSize: this._model.textSettings.haloSize,
            temporary: this._model.cursorUpdate
        });
        const graphic = new Graphic(pnt, textSymbol);
        if (typeof id === "string") {
            graphic.setAttribute("id", id);
        } else {
            graphic.setAttribute("id", `measurement-${id}`);
        }
        graphic.setAttribute("type", graphic.symbol.type);
        return graphic;
    }

    /*
     * create text symbol with line length on cursor moves
     * @param checkedPath: path consisting of to points which define the line
     * @param spatialReference: spatial reference of the maps view
     * @param id: uid of the sketched polygon
     */
    createAngleTextCursorUpdate(p1, p2, p3, anglePoint, spatialReference, id) {
        // calculate quadrant relative to p1
        const p2quadrant = this._getQuadrant(p2, p1);
        const p3quadrant = this._getQuadrant(p3, p1);
        const quadrantsString = [p2quadrant, p3quadrant].join(' ');

        const angleText = this._calculateAngle(p1, p2, p3, quadrantsString);
        let resultStringWithUnit;
        if (this._model.angleUnit === this.i18n.ui.angleUnit.unit1) {
            resultStringWithUnit = angleText + " °"
        } else {
            let number = parseInt(angleText);
            number = number / 350 * 400;
            resultStringWithUnit = number.toFixed(0) + " gon";
        }
        const textSymbol = new TextSymbol({
            text: resultStringWithUnit,
            flag: "measurementText",
            color: this._model.textSettings.color,
            id: `measurement-${id}`,
            font: this._model.textSettings.font,
            haloColor: this._model.textSettings.haloColor,
            haloSize: this._model.textSettings.haloSize,
            temporary: this._model.cursorUpdate,
            group: this._model.sketchGroup
        });

        const point = this._calcPointInQuadrant(quadrantsString, anglePoint, spatialReference);
        const graphic = new Graphic(point, textSymbol);

        if (typeof id === "string") {
            graphic.setAttribute("id", id);
        } else {
            graphic.setAttribute("id", `measurement-${id}`);
        }
        graphic.setAttribute("type", "angle");
        return graphic;
    }

    _calcPointInQuadrant(quadrantsString, anglePoint, spatialReference) {
        let manipulateX = 0;
        let manipulateY = 0;
        const pixelDistance = 25; // pixel

        // calc the distance
        const mapPointNew = this._calcGeoPointForPixelDistance(anglePoint, pixelDistance, pixelDistance);
        const line = new Polyline({
            spatialReference: spatialReference
        });
        line.addPath([anglePoint, mapPointNew])
        // get distance between p1 and the new mapPoint
        const geomDistance = geoEngine.planarLength(line);


        switch (quadrantsString) {
            case '1 1':
            case '4 2':
                manipulateX -= geomDistance;
                manipulateY -= geomDistance;
                break;
            case '2 1':
                // angle must be <= 180°
                break;
            case '4 1':
                manipulateY -= geomDistance;
                break;
            case '1 2':
                manipulateX -= geomDistance;
                break;
            case '2 2':
            case '1 3':
                manipulateX -= geomDistance;
                manipulateY += geomDistance;
                break;
            case '3 2':
                // angle must be <= 180°
                break;
            case '2 3':
                manipulateY += geomDistance;
                break;
            case '3 3':
            case '2 4':
                manipulateX += geomDistance;
                manipulateY += geomDistance;
                break;
            case '4 3':
                // angle must be <= 180°
                break;
            case '1 4':
                // angle must be <= 180°
                break;
            case '3 4':
                manipulateX += geomDistance;
                break;
            case '4 4':
            case '3 1':
                manipulateX += geomDistance;
                manipulateY -= geomDistance;
                break;
            default:
                console.warn("error");
                break;
        }
        return ct_geometry.createPoint(anglePoint.x + manipulateX, anglePoint.y + manipulateY, spatialReference);
    }

    /*
     * calculate angles using points
     * @param p1, p2, p3: points used for calulation
     * @private
     */
    _calculateAngle(p1, p2, p3, quadrantsString) {

        // construction of right triangles from p1, p2 and p1, p3
        // calculating angle at p1
        const a = Math.atan((Math.abs(p2.y - p1.y) / Math.abs(p2.x - p1.x))) * 180 / Math.PI;
        const b = Math.atan((Math.abs(p3.y - p1.y) / Math.abs(p3.x - p1.x))) * 180 / Math.PI;

        switch (quadrantsString) {
            case '1 1':
                this._angleButton_meas = (Math.abs(b - a));
                if (b < a) this._angleButton_meas = (360 - this._angleButton_meas);
                break;
            case '2 1':
                this._angleButton_meas = 360 - (360 - (a + b));
                break;
            case'3 1':
                this._angleButton_meas = 360 - (180 + a - b);
                break;
            case'4 1':
                this._angleButton_meas = 360 - (180 - (a + b));
                break;
            case'1 2':
                this._angleButton_meas = 360 - (a + b);
                break;
            case'2 2':
                this._angleButton_meas = (Math.abs(a - b));
                if (a < b) this._angleButton_meas = (360 - this._angleButton_meas);
                break;
            case'3 2':
                this._angleButton_meas = 360 - (360 - (180 - (a + b)));
                break;
            case'4 2':
                this._angleButton_meas = 360 - (180 - a + b);
                break;
            case'1 3':
                this._angleButton_meas = 360 - (180 + a - b);
                break;
            case'2 3':
                this._angleButton_meas = 360 - (180 - (a + b));
                break;
            case'3 3':
                this._angleButton_meas = (Math.abs(b - a));
                if (b < a) this._angleButton_meas = (360 - this._angleButton_meas);
                break;
            case'4 3':
                this._angleButton_meas = 360 - (360 - (a + b));
                break;
            case'1 4':
                this._angleButton_meas = 360 - (360 - (180 - (a + b)));
                break;
            case'2 4':
                this._angleButton_meas = 360 - (180 - a + b);
                break;
            case'3 4':
                this._angleButton_meas = 360 - (a + b);
                break;
            case'4 4':
                this._angleButton_meas = (Math.abs(a - b));
                if (a < b) this._angleButton_meas = (360 - this._angleButton_meas);
                break;
            default:
                console.warn("error");
                break;
        }

        return this._angleButton_meas.toFixed(0).toString();
    }

    _getQuadrant(point, relativeTo) {
        const tempPoint = {
            x: point.x - relativeTo.x,
            y: point.y - relativeTo.y
        };
        if (tempPoint.x >= 0 && tempPoint.y >= 0) return 1;
        if (tempPoint.x >= 0 && tempPoint.y <= 0) return 2;
        if (tempPoint.x <= 0 && tempPoint.y <= 0) return 3;
        if (tempPoint.x <= 0 && tempPoint.y >= 0) return 4;
    }

    _calcGeoPointForPixelDistance(srcPoint, distanceInPxX, distanceInpxY) {
        this.mapWidgetModel = this._model._mapWidgetModel;

        const screenPointOfP1 = this.mapWidgetModel.view.toScreen(srcPoint);
        const newPoint = this.mapWidgetModel.view.toMap({
            x: screenPointOfP1.x + distanceInPxX,
            y: screenPointOfP1.y + distanceInpxY
        });
        return new Point(newPoint, this.mapWidgetModel.spatialReference);
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
        let lastSegment, currentArea;
        switch (activeTool) {
            case("drawpolylinetool"):
            case ("drawfreehandpolylinetool"):
                lastSegment = this.measurements.segmentLength = this.getLastSegmentLength(evt);
                this._model.currentLength = this.getLengthString(lastSegment);
                this._model.aggregateLength = this.getLengthString(lastSegment + this.measurements.totalLength);
                break;
            case("drawpolygontool"):
            case("drawfreehandpolylgontool"):
                currentArea = this.measurements.currentArea = this.getAreaNumeric(graphic.geometry);
                lastSegment = this.measurements.segmentLength = this.getLastSegmentLength(evt);
                this._model.currentLength = this.getLengthString(lastSegment);
                this._model.currentArea = this.getAreaString(currentArea);
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
        const lastSegment = this.getLastSegmentLength(evt);
        this.measurements.totalLength = this.measurements.totalLength + lastSegment;
        const currentArea = this.measurements.currentArea;
        switch (activeTool) {
            case("drawpolylinetool"):
            case("drawfreehandpolylinetool"):
                this._model.currentLength = this.getLengthString(0);
                // this._model.totalLength = this.getLengthString(this.measurements.totalLength);
                this._model.totalLength = this.getLength(graphic.geometry);
                break;
            case("drawpolygontool"):
            case("drawfreehandpolylgontool"):
                this._model.currentLength = this.getLengthString(0);
                this._model.perimeter = this.getLength(graphic.geometry);
                // this._model.currentArea = this._model.area = this.getAreaString(currentArea);
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
        this.measurements = {
            totalLength: 0,
            segmentLength: 0,
            currentArea: 0,
            area: 0
        }
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
