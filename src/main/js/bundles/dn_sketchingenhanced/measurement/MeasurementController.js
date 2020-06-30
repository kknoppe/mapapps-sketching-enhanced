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
        this._oldVertex = null;
        const props = this._properties;
        this.textSettings = props.sketch.textSymbol;
        this.lineSettings = props.sketch.polylineSymbol;

        this.coordinates = null;
        this.radiusPath = null;
        this.multiMeasurement = false;

        this.measurementBoolean = false;
    }

    handler(evt) {

        this.coordinates = this._getCoordinates(evt);
        this._removeTemporaryMeasurements(evt);


        if(evt.state === 'start' && !this.multiMeasurement && this.measurementBoolean && (evt.tool && evt.tool !== 'reshape')) {
            this._removeAll(evt);
        }


        // calculate area (and circumference for circles & ellipsis)
        if (evt.state === 'complete' && this.measurementBoolean) {
            this._oldVertex = null;
            if(evt.tool === 'point') {
                return;
            } else if(evt.tool === 'reshape') {
                if(evt.graphics[0].geometry.type === 'point')  {
                    return;
                }
                const newEvent = evt;
                evt.graphics.forEach(graphic => {
                    newEvent.graphic = graphic;
                    if (evt.graphics[0].geometry.type !== 'polyline') {
                        this._calculatePolygonMeasurements(newEvent);
                    } else {
                        this._calculateTotalLineMeasurement(newEvent);
                    }
                });

            } else {

                if (evt.tool !== 'polyline') {
                    this._calculatePolygonMeasurements(evt);
                } else {
                    this._calculateTotalLineMeasurement(evt);
                }

            }
        }

        if(evt.state === 'active') {
            this._stateActiveHandler(evt);
        }

    }

    _getCoordinates(evt) {
        return (evt && evt.toolEventInfo) ? evt.toolEventInfo.coordinates : null;
    }

    /**
     * if event state is active watch on vertex-add and cursor-update
     * @param evt
     * @private
     */
    _stateActiveHandler(evt) {
        if(!this.measurementBoolean) {
            return;
        }
        // calculate length of lines (elements of polylines & polygons)
        if (evt.toolEventInfo.type === 'vertex-add' ) {
            // write length of lines
            this._calculatePathLength(evt);
        }

        if (evt.toolEventInfo.type === 'cursor-update') {
            this._checkIfPositionHasChanged(evt);
        }
    }

    /**
     * check if the current position is still the same as 2 seconds ago -> if yes show line length and (for polygons) circumference & area
     * @param evt
     * @private
     */
    _checkIfPositionHasChanged(evt) {
        setTimeout(() => {
            if(this.coordinates && this.coordinates === evt.toolEventInfo.coordinates) {
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

        if(path.length < 3 && !temporary) {
            return;
        }
        const viewModel = evt.target;
        const spatialReference = viewModel.view.spatialReference;

        const lengthString = this._getLength(evt.graphic.geometry);

        const pnt = new Point(path[path.length-1],spatialReference);

        // calculate text position due to last line element
        const textPosition = this._getTextPosition(path);
        const yOffset = this._getYOffset(path);

        const textSymbol = new TextSymbol({
            text: temporary ? lengthString : `${i18n.totalLength}: ${lengthString}`,
            color: this.textSettings.color,
            name: temporary ? 'temporary' :'',
            font: this.textSettings.font,
            horizontalAlignment: textPosition,
            yoffset: yOffset,
            haloColor: this.textSettings.haloColor,
            haloSize: this.textSettings.haloSize,
        });


        const graphic = new Graphic(pnt, textSymbol);
       viewModel.layer.add(graphic);
    }

    /**
     * get Length of given geometry
     * @param geometry
     * @returns {string}
     * @private
     */
    _getLength(geometry) {
        const length = Math.round(this.geoEngine.planarLength(geometry,'meters') *100) / 100;
        return length > 1000 ?
            `${(Math.round(this.geoEngine.planarLength(geometry,'kilometers')*100)/100).toLocaleString(i18n.locale)} km` :
            `${length.toLocaleString(i18n.locale)} m`;
    }

    /**
     * get Area of given geometry
     * @param geometry
     * @returns {string}
     * @private
     */
    _getArea(geometry) {
        const area = Math.round(this.geoEngine.planarArea(geometry, 'square-meters')*100)/100;
        return area > 1000000 ?
            `${Math.round(this.geoEngine.planarArea(geometry,'square-kilometers')*100/100).toLocaleString(i18n.locale)} km²` :
            `${area.toLocaleString(i18n.locale)} m²`;
    }

    /**
     * get text position for total line length ('left'/'right'/'center')
     * @param path: line path
     * @returns {String}: ('left'/'right'/'center')
     * @private
     */
    _getTextPosition(path) {
        const m = this._calculateSlope(path);
        const textPosition = (path[path.length-2][0]-path[path.length-1][0]) < 0 ? 'left' : 'right';
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
        const yOffset =  (path[path.length-2][1]-path[path.length-1][1]) < 0 ? 15 : -20;
        return (m < 1 && m > -1) ? 0 : yOffset;
    }

    /**
     * calculate the slope of the last part of the given path
     * @param path
     * @returns {number}
     * @private
     */
    _calculateSlope(path) {
       return (path[path.length-2][1]-path[path.length-1][1])/ (path[path.length-2][0]-path[path.length-1][0]);
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
        if(evt.graphic && evt.graphic.geometry.type === 'polyline') {
            this._addTextForPolylinePolygon(evt, evt.graphic.geometry.paths[0][0]);
        }
        // add temporary labeling for polygon elements
        if(evt.graphic.geometry.type === 'polygon' && evt.tool === 'polygon') {
            this._addTextForPolylinePolygon(evt, evt.graphic.geometry.rings[0][0], evt.graphic.uid);
        }

        if(evt.graphic.geometry.type === 'polygon' && evt.tool === 'circle') {
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
        const degAngle = -180/Math.PI * Math.atan((checkedPath[1][1] - checkedPath[0][1])/(checkedPath[1][0]-checkedPath[0][0]));
        const nameString = temporary ? 'temporary' : '';

        const textSymbol = new TextSymbol({
            angle: degAngle,
            text: lengthString,
            color: this.textSettings.color,
            name: id ?  `measurement-${id}` : nameString,
            font: this.textSettings.font,
            haloColor: this.textSettings.haloColor,
            haloSize: this.textSettings.haloSize,
        });
        return new Graphic(pnt, textSymbol);
    }

    /**
     * remove temporary polygon line measurements
     * @param viewModel
     * @param id: uid of the polygon
     * @private
     */
    _removePolygonMeasurements(viewModel,id) {
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
        if(evt.tool === 'circle' || evt.tool === 'ellipse') {
            const horizontalAlignment = (evt.tool === 'circle' && this.radiusPath) ? this._getHorizontalAlignmentForCircle() : null;
            const graphic = this._calculateCircumferenceAndArea(evt.graphic.geometry, false, horizontalAlignment);
            evt.target.layer.add(graphic);
        } else {
            const rings = evt.graphic.geometry.rings[0];
            for (let i = 1; i < rings.length; i++) {
                const checkedPath = [rings[i - 1], rings[i]];
                const graphic = this._createTextWithDistance(checkedPath, spatialReference, null, temporary);
                evt.target.layer.add(graphic);
            }
        }
    }

    _getHorizontalAlignmentForCircle() {
        return this.radiusPath[0][0]-this.radiusPath[1][0] < 0 ? 'left' : 'right';
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
        });
        return new Graphic(pnt, textSymbol);
    }

}

