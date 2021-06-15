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

export default class PolylineMeasurementHandler {
    constructor(args){
        this._properties = args._properties;
        this.viewModel = args.viewModel;
        this._model = args._model;
        this.controller = args.controller;
        this.i18n = args.i18n;
        this.actionType = 'polyline'
    }
    _getMeasurements(evt){
        const polylineToolActive = evt.activeTool && evt.activeTool === 'drawpolylinetool';
        const activeState = polylineToolActive && evt.state === 'active';
        const completeState = polylineToolActive && evt.state === 'complete';
        if (!evt.graphic.getAttribute("id")) {
            evt.graphic.setAttribute("id",`measurement-${evt.graphic.uid}`);
        }
        if (activeState){
            if (this._model.vertexAdded && this._model.showLineMeasurementsAtPolylines){
                this._addTextForPolyline(evt, evt.graphic.geometry.paths[0][0]);
                this._addLineMeasurementsToPolylines(evt)
            }
            if (this._model.cursorUpdate){
                this._checkIfPositionHasChanged(evt);
            }
        }
        if (completeState){
            this._addLineMeasurementsToPolylines(evt);
            this._calculateTotalLineMeasurement(evt);
        }
    }

    _updateMeasurements(evt){
        if (this._model.measurementEnabled) {
            const redoUndo = evt.type === 'redo' || evt.type === 'undo';
            this._addLineMeasurementsToPolylines(evt);
            this.controller.showCompleteResultsInTab(evt);
            if (!redoUndo){
                this._calculateTotalLineMeasurement(evt);
            }
        }
    }

    /*
     * check if the current position is still the same as 2 seconds ago -> if yes show line length and (for polygons) circumference & area
     * @param evt
     * @private
     */
    _checkIfPositionHasChanged(evt) {
        const lineMeasurementTimeout = this._model.lineMeasurementTimeout;
        setTimeout(() => {
            this._calculateTotalLineMeasurement(evt);
        }, lineMeasurementTimeout);
    }

    _calculateTotalLineMeasurement(evt) {
        const update = evt.type === 'update' || evt.type === 'undo' || evt.type === 'redo';
        const graphic = update ? evt.graphics[0] : evt.graphic;
        const path = graphic.geometry.paths[0];
        const id = graphic.uid;
        graphic.setAttribute("id",`measurement-${id}`)
        if (path.length < 2) {
            return;
        }
        const viewModel = this.viewModel;
        const spatialReference = viewModel.view.spatialReference;
        const lengthString = evt.state === 'complete' ?
            `${this.i18n.totalLength}: ${this.controller.getLength(graphic.geometry)}` :
            `${this.controller.getLength(graphic.geometry)}`
        if (!this.controller.stringIsDuplicate(lengthString)){
            const pnt = new Point(path[path.length - 1], spatialReference);

            // calculate text position due to last line element
            const textPosition = this.controller.getTextPosition(path);
            const yOffset = this.controller.getYOffset(path);

            const textSymbol = this.textGraphic = new TextSymbol({
                text: lengthString,
                color: this._model.textSettings.color,
                flag: "measurementText",
                id: `measurement-${id}`,
                font: this._model.textSettings.font,
                horizontalAlignment: textPosition,
                yoffset: yOffset,
                haloColor: this._model.textSettings.haloColor,
                haloSize: this._model.textSettings.haloSize,
                temporary: this._model.cursorUpdate || this._model.vertexAdded
            });
            const textGraphic = new Graphic(pnt, textSymbol);
            textGraphic.setAttribute("id",`measurement-${id}`)
            textGraphic.setAttribute("type",textGraphic.symbol.type);
            viewModel.layer.add(textGraphic);
        }
    }

    /*
     * create and add text graphic to the measurement layer with information about line length
     * @param evt
     * @param firstPoint: only necessary for the first line element
     * @param id: uid of sketched polygon to be able to delete temporary length information on completion
     * @private
     */
    _addTextForPolyline(evt, firstPoint) {
        const viewModel = this.viewModel;
        const spatialReference = viewModel.view.spatialReference;
        const newVertex = evt.toolEventInfo.added || evt.toolEventInfo.coordinates;

        // set up array with current line
        const checkedPath = this._model._lastVertex ? [this._model._lastVertex, newVertex] : [firstPoint, newVertex];

        // calculate Distance between last two points and create graphic with textsymbol
        evt.graphic.setAttribute("id",`measurement-${evt.graphic.uid}`)
        const graphic = this.controller.createDistanceTextCursorUpdate(checkedPath, spatialReference, evt.graphic.uid);
        graphic.setAttribute("id",`measurement-${evt.graphic.uid}`)
        // add this graphic to measurement layer
        viewModel.layer.add(graphic);
        this._model._lastVertex = newVertex;
    }

    /*
     * add line measurements to a polyline after reshaping
     * @param evt
     * @private
     */
    _addLineMeasurementsToPolylines(evt) {
        // remove the graphics so they do not stack on one another
        const update = evt.type === 'update' || evt.type === 'undo' || evt.type === 'redo';
        const graphic = update ? evt.graphics[0] : evt.graphic;
        this.controller.removeGraphicsById(graphic.getAttribute("id"));
        const spatialReference = this.viewModel.view.spatialReference;
        const paths = graphic.geometry.paths[0];
        for (let i = 1; i < paths.length; i++) {
            const redoUndo = evt.type === 'redo' || evt.type === 'undo';
            const lastPassOnUndo = redoUndo && i === paths.length - 1;
            if (!lastPassOnUndo) {
                const checkedPath = [paths[i - 1], paths[i]];
                const textGraphic = this.controller.createDistanceTextCursorUpdate(checkedPath, spatialReference, graphic.uid);
                this.viewModel.layer.add(textGraphic);
            }
        }
    }
}
