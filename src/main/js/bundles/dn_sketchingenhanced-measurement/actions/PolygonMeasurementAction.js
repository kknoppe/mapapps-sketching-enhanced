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

import Point from "esri/geometry/Point";
import TextSymbol from "esri/symbols/TextSymbol";
import Graphic from "esri/Graphic";

export default class PolygonMeasurementAction {
    constructor(args){
        this._properties = args._properties;
        this.viewModel = args.viewModel;
        this._model = args._model;
        this.controller = args.controller;
        this.i18n = args.i18n;
        this.actionType = 'polygon';
    }
    _getMeasurements(evt){
        const isDrawpolygontool = this.isDrawpolygontool = evt.activeTool && evt.activeTool === 'drawpolygontool';
        const polygonToolActive = evt.graphic && evt.graphic.geometry.type === 'polygon';
        const activeState = polygonToolActive && evt.state === 'active';
        const completeState = polygonToolActive && evt.state === 'complete';
        if (activeState){
            if (this._model.vertexAdded && this._model.showLineMeasurementsAtPolygons && isDrawpolygontool){
                this._addTextForPolygon(evt, evt.graphic.geometry.rings[0][0], evt.graphic.uid);
                this._addPolygonLineMeasurements(evt);
            }
            if (this._model.cursorUpdate && isDrawpolygontool){
                this._addPolygonLineMeasurements(evt);
            }
        }
        if (completeState){
            this._addPolygonLineMeasurements(evt);
            this._calculatePolygonMeasurements(evt);
        }
    }

    _updateMeasurements(evt){
        this._addPolygonLineMeasurements(evt);
        this._calculatePolygonMeasurements(evt);
    }

    /*
     * create and add text graphic to the measurement layer with information about line length
     * @param evt
     * @param firstPoint: only necessary for the first line element
     * @param id: uid of sketched polygon to be able to delete temporary length information on completion
     * @private
     */
    _addTextForPolygon(evt, firstPoint, id) {
        const viewModel = this.viewModel;
        const spatialReference = viewModel.view.spatialReference;
        const newVertex = evt.toolEventInfo.added;

        // set up array with current line
        const checkedPath = this._model._lastVertex ? [this._model._lastVertex, newVertex] : [firstPoint, newVertex];
        // calculate Distance between last two points and create graphic with textsymbol
        const graphic = this.controller.createDistanceTextCursorUpdate(checkedPath, spatialReference, id);

        // add this graphic to measurement layer
        viewModel.layer.add(graphic);
        this._model._lastVertex = newVertex;
    }

    /*
     * check if the current position is still the same as 'n' seconds ago -> if yes show line length and (for polygons) circumference & area
     * @param evt
     * @private
     */
    _checkIfPositionHasChanged(evt) {
        const lineMeasurementTimeout = this._model.lineMeasurementTimeout;
        setTimeout(() => {
            this._addPolygonLineMeasurements(evt);
        }, lineMeasurementTimeout);
    }

    /*
     * calculate length, area, circumference of polygons
     * @param evt
     * @param temporary Boolean parameter which is true if text should be deleted on next cursor move
     * @private
     */
    _calculatePolygonMeasurements(evt) {
        const viewModel = this.viewModel;
        // calculate area of polygon
        const update = evt.type === 'update' || evt.type === 'undo';
        const graphic = update ? evt.graphics[0] : evt.graphic;
        if (evt.tool !== 'circle' && evt.tool !== 'ellipse') {
            if (!graphic) return;
            this._calculateCircumferenceAndArea(evt);
        }
    }

    /*
     * calculate circumference and area of circles and ellipsis
     * @param geometry
     * @param temporary Boolean parameter which is true if text should be deleted on next cursor move
     * @param horizontalAlignment
     * @private
     */
    _calculateCircumferenceAndArea(evt) {
        const update = evt.type === 'update' || evt.type === 'undo';
        const graphic = update ? evt.graphics[0] : evt.graphic;
        const geometry = graphic.geometry;
        const id = graphic.uid;
        const circumString = this.controller.getLength(geometry);
        const areaString = this.controller.getArea(geometry);

        const pnt = this._model.cursorUpdate ? new Point(this.controller.getCoordinates(evt), geometry.spatialReference) : this.controller.getCenterOfPoint(geometry);

        let textPosition = (this._model._lastVertex && this._model.coordinates[0] - this._model._lastVertex[0] > 0) ? 'left' : 'right';
        textPosition = evt.state === 'complete' ? 'center' : textPosition;
        const areaText = (this._properties.measurementLabels && this._properties.measurementLabels[this.i18n.locale]) ?
            this._properties.measurementLabels[this.i18n.locale].area : this.i18n.circumference;
        const circumferenceText = (this._properties.measurementLabels  && this._properties.measurementLabels[this.i18n.locale]) ?
            this._properties.measurementLabels[this.i18n.locale].circumference : this.i18n.circumference;
        const text = `${areaText}: ${areaString} \n ${circumferenceText}: ${circumString}`
        if (!this.controller.stringIsDuplicate(text)){
            const textSymbol = new TextSymbol({
                text: text,
                color: this._model.textSettings.color,
                font: this._model.textSettings.font,
                flag: "measurementText",
                name: `measurement-${id}`,
                horizontalAlignment: textPosition,
                haloColor: this._model.textSettings.haloColor,
                haloSize: this._model.textSettings.haloSize,
                temporary: this._model.cursorUpdate || this._model.vertexAdded
            });
            const textGraphic = new Graphic(pnt, textSymbol);
            this.viewModel.layer.add(textGraphic);
        }
    }

    /*
     * add line measurements of polygons after completion
     * @param evt
     * @param spatialReference
     * @param temporary Boolean parameter which is true if text should be deleted on next cursor move
     * @private
     */
    _addPolygonLineMeasurements(evt) {
        // remove the graphics so they do not stack on one another
        const update = evt.type === 'update' || evt.type === 'undo';
        const graphic = update ? evt.graphics[0] : evt.graphic;
        this.controller.removeGraphicsByName(graphic.uid);
        if (this._model.showLineMeasurementsAtPolygons && this.isDrawpolygontool) {
            const spatialReference = this.viewModel.view.spatialReference;
            const rings = graphic.geometry.rings;
            rings.forEach(rings => {
                for (let i = 1; i < rings.length; i++) {
                    const checkedPath = [rings[i - 1], rings[i]];
                    const textGraphic = this.controller.createDistanceTextCursorUpdate(checkedPath, spatialReference, graphic.uid);
                    this.viewModel.layer.add(textGraphic);
                }
            });
        }
    }
}
