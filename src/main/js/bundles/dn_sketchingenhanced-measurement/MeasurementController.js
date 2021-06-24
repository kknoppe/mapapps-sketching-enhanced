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
import i18n from "./nls/bundle";

export default class MeasurementHandler {

    activate(){
        this.i18n = this._i18n.get();
    }

    // AREA Calculations
    /*
     * get Area of given geometry
     * @param geometry
     * @returns {string}
     * @private
     */
    getArea(geometry) {
        const locale = this.i18n.locale;
        let unit = this._model.areaUnit;
        if (unit !== 'auto'){
            return `${this.getAreaNumeric(geometry,unit).toLocaleString(this.i18n.locale)} ${this._getUnitAbbreviation(unit)}`
        } else {
            const squareMeters = this.getAreaNumeric(geometry,'square-meters');
            const useKms = squareMeters > 1000000;
            if (useKms){
                const places = this._properties.decimalPlacesKiloMeter;
                const area = this.getAreaNumeric(geometry,'square-kilometers').toFixed(places || 2);
                return `${parseFloat(area).toLocaleString(locale)} km²`
            } else {
                const places = this._properties.decimalPlacesMeter;
                const area = squareMeters.toFixed(places || 2);
                return `${parseFloat(area).toLocaleString(locale)} m²`;
            }
        }
    }

    /*
     * get Area of given geometry
     * @param area {number}
     * @returns {string}
     * @private
     */
    getAreaString(area){
        let unit = this._model.areaUnit;
        if (unit !== 'auto'){
            return `${area.toLocaleString(i18n.locale)} ${this._getUnitAbbreviation(unit)}`;
        } else {
            return area > 1000000 ?
                `${(Math.round((area / 1000000) * Math.pow(10, this._model.kmDecimal)) / Math.pow(10, this._model.kmDecimal)).toLocaleString(this.i18n.locale)} km²` :
                `${area.toLocaleString(this.i18n.locale)} m²`;
        }
    }

    /*
     * get Area of given geometry in meters squared
     * @param geometry
     * @returns {number}
     * @private
     */
    getAreaNumeric(geometry,unit) {
        if (unit === 'auto') unit = null;
        let area = (this.getMapArea(geometry, unit || 'square-meters') * Math.pow(10, this._model.mDecimal)) / Math.pow(10, this._model.mDecimal);
        return +area;
    }

    /*
     * calculates the map area depending on the spatial reference system
     * @param geometry, unit
     * @returns {number}
     * @private
     */
    getMapArea(geometry,unit) {
        const srs = this._model.spatialReference;
        if (srs.isWebMercator || srs.isWGS84){
            return geoEngine.geodesicArea(geometry, unit);
        } else {
            return geoEngine.planarArea(geometry, unit);
        }
    }

    // Length Calculations

    /*
     * get Length of given geometry
     * @param geometry
     * @returns {string}
     * @private
     */
    getLength(geometry) {
        const locale = this.i18n.locale;
        let unit = this._model.lengthUnit;
        if (unit !== 'auto'){
            return `${this.getLengthNumeric(geometry,unit).toLocaleString(this.i18n.locale)} ${this.getUnitAbbreviation(unit)}`
        } else {
            let meters = this.getLengthNumeric(geometry,'meters');
            const useKms = meters > 1000;
            if (useKms){
                const places = this._properties.decimalPlacesKiloMeter;
                let segment = this.lastLengthSegment = this.getLengthNumeric(geometry,'kilometers');
                let length = segment.toFixed(places || 2)
                return `${parseFloat(length).toLocaleString(locale)} km`;
            } else {
                const places = this._properties.decimalPlacesMeter || 2;
                let segment = this.lastLengthSegment = meters;
                let length = segment.toFixed(places || 2)
                return `${parseFloat(length).toLocaleString(locale)} m`;
            }
        }
    }

    /*
     * get Length of given geometry
     * @param length {number}
     * @returns {string}
     * @private
     */
    getLengthString(length){
        let unit = this._model.lengthUnit;
        if (unit !== 'auto'){
            return `${length.toLocaleString(this.i18n.locale)} ${this.getUnitAbbreviation(unit)}`
        } else {
            return length > 1000 ? `${((length / 1000) * Math.pow(10, this._model.kmDecimal) / Math.pow(10, this._model.kmDecimal)).toLocaleString(this.i18n.locale)} km` :
                `${length.toLocaleString(this.i18n.locale)} m`
        }
    }

    /*
     * calculates the length of the previous draw vector in meters
     * @param evt
     * @returns returns a number representing the previous laid vector in meters
     * @private
     */
    getLastSegmentLength(evt){
        // this is to get the length of the set new segment
        const update = evt.type === 'update' || evt.type === 'undo' || evt.type === 'redo';
        const graphic = update ? evt.graphics[0] : evt.graphic;
        const vertices = graphic.geometry.paths ? graphic.geometry.paths : graphic.geometry.rings;
        const lastPath = vertices[0].slice(vertices[0].length - 2)
        const spatialReference = this._model.spatialReference;
        const geometry = new Polyline(lastPath, spatialReference);
        return this.getLengthNumeric(geometry,this._model.lengthUnit)
    }

    /*
     * get Length of given geometry in meters
     * @param geometry
     * @returns {number}
     * @private
     */
    getLengthNumeric(geometry,unit) {
        if (unit === 'auto') unit = null;
        let length = (this.getMapLength(geometry, unit || 'meters') * Math.pow(10, this._model.mDecimal)) / Math.pow(10, this._model.mDecimal);
        return +length;
    }

    /*
     * calculates the linear map length depending on the spatial reference system
     * @param geometry, unit
     * @returns {number}
     * @private
     */
    getMapLength(geometry,unit) {
        const srs = this._model.spatialReference;
        if (srs.isWebMercator || srs.isWGS84){
            return geoEngine.geodesicLength(geometry, unit);
        } else {
            return geoEngine.planarLength(geometry, unit);
        }
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

    getCenterOfPoint(g){
        if (g.extent && g.extent.center){
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

    getUnitAbbreviation(unit){
        const mapping = this._properties.unitAbbreviationMapping;
        return mapping[unit];
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

    _getUnitAbbreviation(unit){
        const mapping = this._properties.unitAbbreviationMapping;
        return mapping[unit];
    }

    /*
     * gets and returns the coordinates of the drawn object
     * @param evt
     * @private
     */
    getCoordinates(evt) {
        if (evt && evt.tool === 'point') {
            if (evt.graphic){
                // get the coordinates from the graphic
                return this.getCenterOfPoint(evt.graphic.geometry);
            } else {
                return evt;
            }
        } else if (evt && evt.toolEventInfo){
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
        if (typeof id === "string"){
            graphic.setAttribute("id",id);
        } else {
            graphic.setAttribute("id",`measurement-${id}`);
        }
        graphic.setAttribute("type",graphic.symbol.type);
        return graphic;
    }

    removeGraphicsById(id) {
        const gs = this.viewModel.layer.graphics.items.filter(graphic => {
            const type = graphic.getAttribute("type");
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
            if (textGraphicId){
                return g.getAttribute("id") === id && type && type === "text" && temporary;
            }
        });
        viewModel.layer.removeMany(gs);
    }

    stringIsDuplicate(text){
        const gs = this.viewModel.layer.graphics.items.filter(graphic => {
            if (graphic.symbol){
                return graphic.symbol.text === text
            }
        });
        return gs.length > 0
    }

    setGraphicAttributes(evt,showLinesAttr){
        if (!evt.graphic.getAttribute("id")) {
            evt.graphic.setAttribute("measurementEnabled",this._model.measurementEnabled);
            const showLines = (evt.tool === 'triangle' || evt.tool === 'rectangle') ? false : this._model[showLinesAttr];
            evt.graphic.setAttribute(showLinesAttr,showLines);
            evt.graphic.setAttribute("id",`measurement-${evt.graphic.uid}`);
        }
    }

    /*
     * switch method that sets data model measurement properties with mouse cursor movement
     * @param evt from mouse cursor movement
     * @private
     */
    showActiveResultsInTab(evt){
        const update = evt.type === 'update' || evt.type === 'undo' || evt.type === 'redo';
        const graphic = update ? evt.graphics[0] : evt.graphic;
        const activeTool = evt.activeTool;
        let lastSegment, currentArea;
        switch(activeTool){
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
    showCompleteResultsInTab(evt){
        const update = evt.type === 'update' || evt.type === 'undo' || evt.type === 'redo';
        const graphic = update ? evt.graphics[0] : evt.graphic;
        const activeTool = evt.activeTool;
        const lastSegment = this.getLastSegmentLength(evt);
        this.measurements.totalLength = this.measurements.totalLength + lastSegment;
        const currentArea = this.measurements.currentArea;
        switch(activeTool){
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
    resetMeasurementResults(){
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
