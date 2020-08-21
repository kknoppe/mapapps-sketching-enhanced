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
import TextSymbol from 'esri/symbols/TextSymbol';
import Graphic from 'esri/Graphic';
import Polyline from 'esri/geometry/Polyline';
import Point from 'esri/geometry/Point';
import geoEngine from 'esri/geometry/geometryEngine';
import i18n from 'dojo/i18n!./nls/bundle';

export default class MeasurementController {

    activate() {
        this.geoEngine = geoEngine;
        this.activeToolType = null;
        this._oldVertex = null;
        this._vertexArray = [];
        this._undoRedoGraphics = [];
        const props = this._properties;
        this.mDecimal = props.decimalPlacesMeter;
        this.kmDecimal = props.decimalPlacesKiloMeter;
        this.textSettings = props.sketch.textSymbol;
        this.lineSettings = props.sketch.polylineSymbol;
        this.areaUnit = 'auto';
        this.lengthUnit = 'auto';

        this._model.showLineMeasurementsAtPolylines = props.showLineMeasurementsAtPolylines;
        this._model.showLineMeasurementsAtPolygons = props.showLineMeasurementsAtPolygons;

        this._model.pointEnabled = false;
        this._model.polylineEnabled = false;
        this._model.polygonEnabled = false;
        this._model.areaEnabled = false;

        this.coordinates = null;
        this.radiusPath = null;
        this.multiMeasurement = false;

        this.measurementBoolean = false;

        this.sketchGroup = 0;

        this._model.watch("measurementBoolean",(evt)=>{
            this._toggleMeasurementDisabledTools(evt.value);
            if (this.activeToolType){
                this.setActiveToolType(this.activeToolType);
            }
        });

        this.resetMeasurementResults();
    }

    handler(evt) {
        if (evt.activeTool){
            this.setActiveToolType(evt.activeTool)
            this._showMeasurementsAfterDrawing(evt);
        }

        if(evt.state === 'cancel' && evt.type === 'create' && evt.graphic) {
            this.resetMeasurementResults();
            this._removeMeasurementsOnCancel(evt);
            return;
        }

        this.coordinates = this._getCoordinates(evt);
        this._removeTemporaryMeasurements(evt);


        if (evt.state === 'start' && !this.multiMeasurement && this.measurementBoolean && (evt.tool && evt.tool !== 'reshape')) {
            this._removeAll(evt);
        }


        if (evt.state === 'start' && this.measurementBoolean) {
            // increase the group classification when start creating a new geometry or reshape an old one, so that the correlated measurements can be deleted on reshape
            this.sketchGroup++;
        }

        // calculate area (and circumference for circles & ellipsis)
        if (evt.state === 'complete' && this.measurementBoolean) {
            this._oldVertex = null;
            this._vertexArray = [];
            this._undoRedoGraphics = [];


            if (evt.tool === 'point' && evt.activeTool && evt.activeTool === "drawpointtool") {
                this._addPointCoordinatesTextToPoint(evt);
            } else if (evt.tool === 'reshape' || evt.tool === 'transform') {
                // add all measurements after completion of a reshape operation
                if (evt.graphics[0].geometry.type === 'point') {
                    return;
                }
                const newEvent = evt;
                evt.graphics.forEach(graphic => {
                    graphic.group = this.sketchGroup;
                    newEvent.graphic = graphic;
                    if (evt.graphics[0].geometry.type !== 'polyline') {
                        this._calculatePolygonMeasurements(newEvent);
                    } else {
                        this._model.showLineMeasurementsAtPolylines && this._addLineMeasurementsToPolylines(newEvent);
                        this._calculateTotalLineMeasurement(newEvent);
                    }
                });

            } else {
                if (evt.graphic) {
                    evt.graphic.group = this.sketchGroup;
                }
                if (evt.tool && evt.tool !== 'polyline') {
                    this._calculatePolygonMeasurements(evt);
                } else {
                    evt.tool && this._calculateTotalLineMeasurement(evt);
                }

            }
        }

        if (evt.state === 'active') {
            this._stateActiveHandler(evt);
        }

        if(this.measurementBoolean) {
            this._undoRedoHandler(evt);
        }



    }

    setActiveToolType(toolId){
        const activeTool = this.activeToolType =  toolId;
        if (!this.measurementBoolean){
            return
        }
        switch(activeTool) {
            case "drawpointtool":
                this._model.pointEnabled = true;
                this._model.polylineEnabled = false;
                this._model.polygonEnabled = false;
                this._model.areaEnabled = false;
                break;
            case "drawpolylinetool":
            case "drawfreehandpolylinetool":
                this._model.pointEnabled = false;
                this._model.polylineEnabled = true;
                this._model.polygonEnabled = false;
                this._model.areaEnabled = false;
                break;
            case "drawpolygontool":
            case "drawfreehandpolygontool":
                this._model.pointEnabled = false;
                this._model.polylineEnabled = false;
                this._model.polygonEnabled = true;
                this._model.areaEnabled = false;
                break;
            case "drawrectangletool":
            case "drawtriangletool":
            case "drawcircletool":
            case "drawellipsetool":
                this._model.pointEnabled = false;
                this._model.polylineEnabled = false;
                this._model.polygonEnabled = false;
                this._model.areaEnabled = true;
                break;
            default:
                this._model.pointEnabled = false;
                this._model.polylineEnabled = false;
                this._model.polygonEnabled = false;
                this._model.areaEnabled = false;
        }
    }

    _undoRedoHandler(evt) {
        if (evt.type === 'undo') {
            const viewModel = evt.target;
            const lastGraphic = viewModel.layer.graphics.items.slice(-1);
            if(lastGraphic && lastGraphic.length) {
                viewModel.layer.removeMany(lastGraphic);
                this._undoRedoGraphics.push(lastGraphic);
                const index = this._vertexArray.findIndex(x => x === this._oldVertex);
                this._oldVertex = this._vertexArray[index - 1];
            }
        }

        if (evt.type === 'redo') {
            const viewModel = evt.target;
            const graphic = this._undoRedoGraphics.pop();
            if(graphic && graphic.length) {
                viewModel.layer.add(graphic[0]);
                const index = this._vertexArray.findIndex(x => x === this._oldVertex);
                this._oldVertex = this._vertexArray[index + 1];
            }
        }
    }

    /**
     * gets and returns the coordinates of the drawn object
     * @param evt
     * @private
     */
    _getCoordinates(evt) {
        if (evt && evt.tool === 'point') {
            if (evt.graphic){
                // get the coordinates from the graphic
                return {
                    x: evt.graphic.geometry.extent.center.x,
                    y: evt.graphic.geometry.extent.center.y
                }
            } else {
                return evt;
            }
        } else if (evt && evt.toolEventInfo){
            return evt.toolEventInfo.coordinates;
        } else {
            return null;
        }
    }

    /**
     * if event state is active watch on vertex-add and cursor-update
     * @param evt
     * @private
     */
    _stateActiveHandler(evt) {
        if (!this.measurementBoolean) {
            return;
        }

        const type = evt.toolEventInfo.type;

        // calculate length of lines (elements of polylines & polygons)
        if (type === 'vertex-add') {
            // write length of lines
            this._calculatePathLength(evt);
        }

        if (type === 'cursor-update') {
            this._checkIfPositionHasChanged(evt);
        }

        if (type === 'reshape-start' || type === 'move-start' || type === 'rotate-start' || type === 'scale-start') {
            this._removeCorrelatedMeasurementTexts(evt);
        }

        if (type === 'vertex-remove') {
            this._removeCorrelatedMeasurementTexts(evt);
            evt.graphics[0].group = this.sketchGroup;
            evt.graphic = evt.graphics[0];
            if (evt.graphics[0].geometry.type !== 'polyline') {
                this._calculatePolygonMeasurements(evt);
            } else {
                this._addLineMeasurementsToPolylines(evt);
                this._calculateTotalLineMeasurement(evt);
            }

        }

    }

    /**
     * remove all measurement texts that are correlated to the selected geometry
     * @param evt
     * @private
     */
    _removeCorrelatedMeasurementTexts(evt) {
        const graphicGroup = evt.graphics[0].group;

        const viewModel = evt.target;
        const graphics = viewModel.layer.graphics.items;
        const gs = graphics.filter(x => x.symbol && x.symbol.group === graphicGroup);

        viewModel.layer.removeMany(gs);
    }

    _removeMeasurementsOnCancel(evt) {
        const id = evt.graphic.uid;
        const viewModel = evt.target;
        const gs = viewModel.layer.graphics.filter(graphic => graphic.symbol.name === `measurement-${id}`);
        viewModel.layer.removeMany(gs);
    }

    /**
     * check if the current position is still the same as 2 seconds ago -> if yes show line length and (for polygons) circumference & area
     * @param evt
     * @private
     */
    _checkIfPositionHasChanged(evt) {
        setTimeout(() => {
            if (this.coordinates && this.coordinates === evt.toolEventInfo.coordinates) {
            evt.tool === 'polyline' && this._calculateTotalLineMeasurement(evt, true);
            evt.tool === 'polygon' && this._calculatePolygonMeasurements(evt, true);
        }
    }, 2000);
    }

    /**
     * calculate length, area, circumference of polygons
     * @param evt
     * @param temporary Boolean parameter which is true if text should be deleted on next cursor move
     * @private
     */
    _calculatePolygonMeasurements(evt, temporary) {
        const viewModel = evt.target;
        const spatialReference = viewModel.view.spatialReference;

        // calculate area of polygon
        if (evt.tool !== 'circle' && evt.tool !== 'ellipse') {
            if (!evt.graphic) return;
            const graphic = this._calculateCircumferenceAndArea(evt.graphic.geometry, temporary);
            viewModel.layer.add(graphic);
        }
        // remove labeling of line elements so that line lengths can be added for all elements later on
        (evt.tool === 'polygon' && !temporary) && this._removePolygonMeasurements(viewModel, evt.graphic.uid);

        // add line lengths for all sides of the polygon (for circles and ellipsis area and circmference is calculated)
        this._addPolygonLineMeasurements(evt, spatialReference, temporary);
    }

    /**
     * set text for total line length
     * @param evt
     * @param temporary
     * @private
     */
    _calculateTotalLineMeasurement(evt, temporary) {
        const path = evt.graphic.geometry.paths[0];

        if (path.length < 3 && !temporary) {
            return;
        }
        const viewModel = evt.target;
        const spatialReference = viewModel.view.spatialReference;

        const lengthString = this._getLength(evt.graphic.geometry);

        const pnt = new Point(path[path.length - 1], spatialReference);

        // calculate text position due to last line element
        const textPosition = this._getTextPosition(path);
        const yOffset = this._getYOffset(path);

        const textSymbol = new TextSymbol({
            text: temporary ? lengthString : `${i18n.totalLength}: ${lengthString}`,
            color: this.textSettings.color,
            name: temporary ? 'temporary' : '',
            font: this.textSettings.font,
            horizontalAlignment: textPosition,
            yoffset: yOffset,
            haloColor: this.textSettings.haloColor,
            haloSize: this.textSettings.haloSize,
            group: this.sketchGroup,
        });


        const graphic = new Graphic(pnt, textSymbol);
        viewModel.layer.add(graphic);
    }

    _setLengthUnits(unit){
        switch(unit){
            case "meter":
            case "meters":
                this.lengthUnit = 'meters'
                break;
            case "kilometer":
            case "kilometers":
                this.lengthUnit = 'kilometers'
                break;
            default:
                this.lengthUnit = 'auto'
                break;
        }
    }

    _setAreaUnits(unit){
        switch(unit){
            case "square meters":
            case "quadratmeter":
                this.areaUnit = 'square-meters';
                break;
            case "square kilometers":
            case "quadratkilometer":
                this.areaUnit = 'square-kilometers';
                break;
            case "hectares":
            case "hektar":
                this.areaUnit = 'hectares'
            default:
                this.lengthUnit = 'auto'
                break;
        }
    }

    _getUnitAbbreviation(unit){
        const mapping = this._properties.unitAbbreviationMapping;
        return mapping[unit];
    }

    /**
     * get Length of given geometry
     * @param geometry
     * @returns {string}
     * @private
     */
    _getLength(geometry) {
        let unit = this.lengthUnit;
        if (unit !== 'auto'){
            return `${this._getLengthNumeric(geometry,unit).toLocaleString(i18n.locale)} ${this._getUnitAbbreviation(unit)}`
        } else {
            const meters = this._getLengthNumeric(geometry,'meters');
            return meters > 1000 ?
                `${this._getLengthNumeric(geometry,'kilometers').toLocaleString(i18n.locale)} km` :
                `${meters.toLocaleString(i18n.locale)} m`;
        }
    }
    /**
     * get Length of given geometry
     * @param length {number}
     * @returns {string}
     * @private
     */
    _getLengthString(length){
        let unit = this.lengthUnit;
        if (unit !== 'auto'){
            return `${length.toLocaleString(i18n.locale)} ${this._getUnitAbbreviation(unit)}`
        } else {
            return length > 1000 ? `${((length / 1000) * Math.pow(10, this.kmDecimal) / Math.pow(10, this.kmDecimal)).toLocaleString(i18n.locale)} km` :
                `${length.toLocaleString(i18n.locale)} m`
        }
    }

    /**
     * get Length of given geometry in meters
     * @param geometry
     * @returns {number}
     * @private
     */
    _getLengthNumeric(geometry,unit) {
        if (unit === 'auto') unit = null;
        return Math.round(this.geoEngine.planarLength(geometry, unit || 'meters') * Math.pow(10, this.mDecimal)) / Math.pow(10, this.mDecimal);
    }

    /**
     * get Area of given geometry
     * @param geometry
     * @returns {string}
     * @private
     */
    _getArea(geometry) {
        let unit = this.areaUnit;
        if (unit !== 'auto'){
            return `${this._getAreaNumeric(geometry,unit).toLocaleString(i18n.locale)} ${this._getUnitAbbreviation(unit)}`
        } else {
            const squareMeters = this._getAreaNumeric(geometry,'square-meters');
            return squareMeters > 1000000 ?
                `${this._getAreaNumeric(geometry,'square-kilometers').toLocaleString(i18n.locale)} km²` :
                `${squareMeters.toLocaleString(i18n.locale)} m²`;
        }
    }


    /**
     * get Area of given geometry
     * @param area {number}
     * @returns {string}
     * @private
     */
    _getAreaString(area){
        let unit = this.areaUnit;
        if (unit !== 'auto'){
            return `${area.toLocaleString(i18n.locale)} ${this._getUnitAbbreviation(unit)}`;
        } else {
            return area > 1000000 ?
                `${(Math.round((area / 1000000) * Math.pow(10, this.kmDecimal)) / Math.pow(10, this.kmDecimal)).toLocaleString(i18n.locale)} km²` :
                `${area.toLocaleString(i18n.locale)} m²`;
        }
    }

    /**
     * get Area of given geometry in meters squared
     * @param geometry
     * @returns {number}
     * @private
     */
    _getAreaNumeric(geometry,unit) {
        if (unit === 'auto') unit = null;
        return Math.round(this.geoEngine.planarArea(geometry, unit || 'square-meters') * Math.pow(10, this.mDecimal)) / Math.pow(10, this.mDecimal);
    }

    /**
     * get text position for total line length ('left'/'right'/'center')
     * @param path: line path
     * @returns {String}: ('left'/'right'/'center')
     * @private
     */
    _getTextPosition(path) {
        const m = this._calculateSlope(path);
        const textPosition = (path[path.length - 2][0] - path[path.length - 1][0]) < 0 ? 'left' : 'right';
        return (m > 2 || m < -2) ? 'center' : textPosition;
    }

    /**
     * get yoffset for total line length
     * @param path: line path
     * @returns {number}
     * @private
     */
    _getYOffset(path) {
        const m = this._calculateSlope(path);
        const yOffset = (path[path.length - 2][1] - path[path.length - 1][1]) < 0 ? 15 : -20;
        return (m < 1 && m > -1) ? 0 : yOffset;
    }

    /**
     * calculate the slope of the last part of the given path
     * @param path
     * @returns {number}
     * @private
     */
    _calculateSlope(path) {
        return (path[path.length - 2][1] - path[path.length - 1][1]) / (path[path.length - 2][0] - path[path.length - 1][0]);
    }

    /**
     * remove all temporary measurements
     * @param evt
     * @private
     */
    _removeTemporaryMeasurements(evt) {
        const viewModel = evt.target;
        const graphics = viewModel.layer.graphics.items;
        const gs = graphics.filter(x => x.symbol && x.symbol.name === 'temporary');
        viewModel.layer.removeMany(gs);
    }

    _removeAll(evt) {
        const viewModel = evt.target;
        viewModel.layer.removeAll();
    }

    /**
     * calculate path length
     * @param evt
     * @private
     */
    _calculatePathLength(evt) {
        // add length labeling for polyline elements
        if (evt.graphic && evt.graphic.geometry.type === 'polyline') {
            this._model.showLineMeasurementsAtPolylines && this._addTextForPolylinePolygon(evt, evt.graphic.geometry.paths[0][0], evt.graphic.uid);
        }
        // add temporary labeling for polygon elements
        if (evt.graphic && evt.graphic.geometry.type === 'polygon' && evt.tool === 'polygon') {
            this._model.showLineMeasurementsAtPolygons && this._addTextForPolylinePolygon(evt, evt.graphic.geometry.rings[0][0], evt.graphic.uid);
        }

        if (evt.graphic && evt.graphic.geometry.type === 'polygon' && evt.tool === 'circle') {
            this._addRadius(evt);
        }
    }

    /**
     * create and add text graphic to the measurement layer with information about line length
     * @param evt
     * @param firstPoint: only necessary for the first line element
     * @param id: uid of sketched polygon to be able to delete temporary length information on completion
     * @private
     */
    _addTextForPolylinePolygon(evt, firstPoint, id) {
        const viewModel = evt.target;
        const spatialReference = viewModel.view.spatialReference;
        const newVertex = evt.toolEventInfo.added;
        this._vertexArray.push(newVertex);

        // set up array with current line
        const checkedPath = this._oldVertex ? [this._oldVertex, newVertex] : [firstPoint, newVertex];

        // calculate Distance between last two points and create graphic with textsymbol
        const graphic = this._createTextWithDistance(checkedPath, spatialReference, id);

        // add this graphic to measurement layer
        viewModel.layer.add(graphic);
        this._oldVertex = newVertex;
    }

    /**
     * add radius line and length label for circles
     * @param evt
     * @private
     */
    _addRadius(evt) {
        const viewModel = evt.target;
        const spatialReference = viewModel.view.spatialReference;

        const center = evt.graphic.geometry.extent.center;
        const path = this.radiusPath = [evt.toolEventInfo.added, [center.x, center.y]];

        const line = new Polyline(path, spatialReference);
        const lineSymbol = {
            type: 'simple-line',
            color: this.lineSettings.color,
            width: this.lineSettings.width,
            style: this.lineSettings.style,
            group: this.sketchGroup,
        };
        const lineGraphic = new Graphic({
            geometry: line,
            symbol: lineSymbol,
        });
        viewModel.layer.add(lineGraphic);

        const graphic = this._createTextWithDistance(path, spatialReference);
        viewModel.layer.add(graphic);
    }

    /**
     * create text symbol with line length
     * @param checkedPath: path consisting of to points which define the line
     * @param spatialReference: spatial reference of the maps view
     * @param id: uid of the sketched polygon
     * @param temporary Boolean parameter which is true if text should be deleted on next cursor move
     * @private
     */
    _createTextWithDistance(checkedPath, spatialReference, id, temporary) {
        const line = new Polyline(checkedPath, spatialReference);
        const lengthString = this._getLength(line);
        const pnt = line.extent.center;
        // calculate rotation angle for text
        const degAngle = -180 / Math.PI * Math.atan((checkedPath[1][1] - checkedPath[0][1]) / (checkedPath[1][0] - checkedPath[0][0]));
        const nameString = temporary ? 'temporary' : '';

        const textSymbol = new TextSymbol({
            angle: degAngle,
            text: lengthString,
            color: this.textSettings.color,
            name: id ? `measurement-${id}` : nameString,
            font: this.textSettings.font,
            haloColor: this.textSettings.haloColor,
            haloSize: this.textSettings.haloSize,
            group: this.sketchGroup,
        });
        return new Graphic(pnt, textSymbol);
    }

    /**
     * remove temporary polygon line measurements
     * @param viewModel
     * @param id: uid of the polygon
     * @private
     */
    _removePolygonMeasurements(viewModel, id) {
        // find all help lines and remove them from the graphics layer
        const graphics = viewModel.layer.graphics.items;
        const gs = graphics.filter(x => x.symbol.name === `measurement-${id}`);
        viewModel.layer.removeMany(gs);
    }

    /**
     * add line measurements of polygons after completion
     * @param evt
     * @param spatialReference
     * @param temporary Boolean parameter which is true if text should be deleted on next cursor move
     * @private
     */
    _addPolygonLineMeasurements(evt, spatialReference, temporary) {
        if (evt.tool === 'circle' || evt.tool === 'ellipse') {
            const horizontalAlignment = (evt.tool === 'circle' && this.radiusPath) ? this._getHorizontalAlignmentForCircle() : null;
            const graphic = this._calculateCircumferenceAndArea(evt.graphic.geometry, false, horizontalAlignment);
            evt.target.layer.add(graphic);
        } else {
            this._model.showLineMeasurementsAtPolygons && evt.graphic.geometry.rings.forEach(rings => {
                for (let i = 1; i < rings.length; i++) {
	                const checkedPath = [rings[i - 1], rings[i]];
	                const graphic = this._createTextWithDistance(checkedPath, spatialReference, null, temporary);
	                evt.target.layer.add(graphic);
	            }
	        });
        }
    }

    /**
     * add point coordinates to Point Object
     * @param evt
     * @private
     */
    _addPointCoordinatesTextToPoint(evt) {
        const id = evt.graphic.uid.toString();
        const viewModel = evt.target;
        const coordinates = this.coordinates;
        const point = evt.graphic.geometry.extent.center;
        const coordString = this._getPointString(evt).then(coordString => {
            const textSymbol = new TextSymbol({
                text: coordString,
                color: this.textSettings.color,
                name: id ? `measurement-${id}` : coordString,
                font: this.textSettings.font,
                haloColor: this.textSettings.haloColor,
                haloSize: this.textSettings.haloSize,
                group: this.sketchGroup,
                horizontalAlignment: "left",
                xoffset: 10,
                yoffset: -20
            });
            this._model.coordinates = coordString;
            const graphic = new Graphic(point, textSymbol);
            viewModel.layer.add(graphic);
        });
    }

    /**
     * converts the point graphic into a readable string (asyncronous)
     * @return corrdinate string
     * @param evt
     * @private
     */
    _getPointString(evt){
        return new Promise((resolve,reject) => {
            if(evt){
                const srs = evt.graphic.geometry.spatialReference.wkid;
                const targetSrs = this._properties.pointSRS || srs;
                const places = this._properties.pointCoordPlaces || (this._srsIsPlanar(targetSrs) ? 0 : 5);
                const unitSymbolX = this._properties.pointCoordUnitSymbolX;
                const unitSymbolY = this._properties.pointCoordUnitSymbolY;
                const transformedPoint = this._transformGeom(evt.graphic.geometry, targetSrs);
                Promise.all([transformedPoint]).then(transformedPoint => {
                    const x = transformedPoint[0].x.toFixed(places);
                const y = transformedPoint[0].y.toFixed(places);
                resolve(x+unitSymbolX +" / "+y+unitSymbolY)
            });
            }else{
                resolve("");
            }
        });
    }

    /**
     * transform the point into a the desired srs
     * @return corrdinate string
     * @param geometry, targetSrs
     * @private
     */
    _transformGeom(geom, targetSrs){
        const coordinateTransformer = this._coordinateTransformer;
        if (coordinateTransformer) {
            return coordinateTransformer.transform(geom, targetSrs);
        }
    }

    /**
     * returns true if the spatial reference system is planar
     * or false if it is geodesic
     * @param srs - (WKID)
     * @private
     */
    _srsIsPlanar(srs){
        const planar = this._properties.srs.planar;
        const geodetic = this._properties.srs.geodetic;
        if(planar.indexOf(srs)!=-1){
            return true;
        }
        if(geodetic.indexOf(srs)!=-1){
            return false;
        }else{
            console.error("Could not determine if EPSG:"+srs+" is planar or geodetic. Missing entry in configuration.");
        }
    }

    /**
     * add line measurements to a polyline after reshaping
     * @param evt
     * @private
     */
    _addLineMeasurementsToPolylines(evt) {
        const viewModel = evt.target;
        const spatialReference = viewModel.view.spatialReference;

        const paths = evt.graphic.geometry.paths[0];
        for (let i = 1; i < paths.length; i++) {
            const checkedPath = [paths[i - 1], paths[i]];
            const graphic = this._createTextWithDistance(checkedPath, spatialReference, null, false);
            viewModel.layer.add(graphic);
        }
    }

    _getHorizontalAlignmentForCircle() {
        return this.radiusPath[0][0] - this.radiusPath[1][0] < 0 ? 'left' : 'right';
    }

    /**
     * calculate circumference and area of circles and ellipsis
     * @param geometry
     * @param temporary Boolean parameter which is true if text should be deleted on next cursor move
     * @param horizontalAlignment
     * @private
     */
    _calculateCircumferenceAndArea(geometry, temporary, horizontalAlignment) {
        const circumString = this._getLength(geometry);
        const areaString = this._getArea(geometry);

        const pnt = temporary ? new Point(this.coordinates, geometry.spatialReference) : geometry.extent.center;
        let textPosition = (temporary && this._oldVertex && this.coordinates[0] - this._oldVertex[0] > 0) ? 'left' : 'right';
        textPosition = temporary ? textPosition : 'center';
        textPosition = horizontalAlignment ? horizontalAlignment : textPosition;

        const textSymbol = new TextSymbol({
            text: `${i18n.area}: ${areaString} \n ${i18n.circumference}: ${circumString}`,
            color: this.textSettings.color,
            font: this.textSettings.font,
            name: temporary ? 'temporary' : '',
            horizontalAlignment: textPosition,
            haloColor: this.textSettings.haloColor,
            haloSize: this.textSettings.haloSize,
            group: this.sketchGroup,
        });
        return new Graphic(pnt, textSymbol);
    }

    /**
     * acts on draw events to begin recording measurements
     * @param evt
     * @private
     */
    _showMeasurementsAfterDrawing(evt){
        if (evt.type === "create" && evt.state === "active"){
            switch( evt.toolEventInfo.type){
                case("cursor-update"):
                    this._showActiveResultsInTab(evt);
                    break;
                case("vertex-add"):
                    this._showCompleteResultsInTab(evt);
                    break
            }

        }
    }

    /**
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
        this._model.pointEnabled = false;
        this._model.polylineEnabled = false;
        this._model.polygonEnabled = false;
        this._model.coordinates = null;
        this._model.currentLength = 0;
        this._model.aggregateLength = 0
        this._model.totalLength = 0;
        this._model.area = 0;
        this._model.currentArea = 0;
        this._model.perimeter = 0;
    }

    /**
     * switch method that sets data model measurement properties with mouse cursor movement
     * @param evt from mouse cursor movement
     * @private
     */
    _showActiveResultsInTab(evt){
        const activeTool = this.activeTool || evt.activeTool;
        let lastSegment, currentArea;
        switch(activeTool){
            case("drawpolylinetool"):
            case ("drawfreehandpolylinetool"):
                lastSegment = this.measurements.segmentLength = this._getLastSegmentLength(evt);
                this._model.currentLength = this._getLengthString(lastSegment);
                this._model.aggregateLength = this._getLengthString(lastSegment + this.measurements.totalLength);
                break;
            case("drawpolygontool"):
            case("drawfreehandpolylgontool"):
                currentArea = this.measurements.currentArea = this._getAreaNumeric(evt.graphic.geometry);
                lastSegment = this.measurements.segmentLength = this._getLastSegmentLength(evt);
                this._model.currentLength = this._getLengthString(lastSegment);
                this._model.currentArea = this._getAreaString(currentArea);
                break;
            case("drawrectangletool"):
            case("drawcircletool"):
            case("drawtriangletool"):
            case("drawellipsetool"):
                currentArea = this.measurements.currentArea = this._getAreaNumeric(evt.graphic.geometry);
                this._model.currentArea = this._getAreaString(currentArea);
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
    _showCompleteResultsInTab(evt){
        const activeTool = this.activeTool || evt.activeTool;
        this.measurements.totalLength = this.measurements.totalLength + this.measurements.segmentLength;
        const currentArea = this.measurements.currentArea;
        switch(activeTool){
            case("drawpolylinetool"):
            case("drawfreehandpolylinetool"):
                this._model.currentLength = this._getLengthString(0);
                this._model.totalLength = this._getLengthString(this.measurements.totalLength);
                break;
            case("drawpolygontool"):
            case("drawfreehandpolylgontool"):
                this._model.currentLength = this._getLengthString(0);
                this._model.perimeter = this._getLengthString(this.measurements.totalLength);
                this._model.currentArea = this._model.area = this._getAreaString(currentArea);
                break;
            case("drawrectangletool"):
            case("drawcircletool"):
            case("drawtriangletool"):
            case("drawellipsetool"):
                this._model.currentArea = this._model.area = this._getAreaString(currentArea);
                break;
            case(null):
                break;
        }
    }

    /**
     * calculates the length of the previous draw vector in meters
     * @param evt
     * @returns returns a number representing the previous laid vector in meters
     * @private
     */
    _getLastSegmentLength(evt){
        // this is to get the length of the set new segment
        let firstPoint = evt.graphic.geometry.paths ? evt.graphic.geometry.paths[0][0] : evt.graphic.geometry.rings[0][0];
        let id = evt.graphic.uid;
        const viewModel = evt.target;
        const spatialReference = viewModel.view.spatialReference;
        const newVertex = evt.toolEventInfo.added || evt.toolEventInfo.coordinates;
        this._vertexArray.push(newVertex);
        // set up array with current line
        const checkedPath = this._oldVertex ? [this._oldVertex, newVertex] : [firstPoint, newVertex];
        const geometry = new Polyline(checkedPath, spatialReference);
        return this._getLengthNumeric(geometry,this.lengthUnit)
    }

    _toggleMeasurementDisabledTools(enabled){
        const measurementDisabledTools = this._properties.disabledMeasurementTools;
        const tools = this._tools;
        measurementDisabledTools && measurementDisabledTools.forEach(id => {
            const tool = tools.filter((x) => x.id === id)[0].tool;
            tool.set("enabled",!enabled);
        });
    }

}

