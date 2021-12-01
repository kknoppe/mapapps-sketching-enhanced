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
import { MeasurementGraphicFactory } from "dn_sketchingenhanced-measurement/MeasurementGraphicFactory";

export default class PolylineMeasurementHandler {
    constructor(args) {
        this._properties = args._properties;
        this.viewModel = args.viewModel;
        this._model = args._model;
        this.controller = args.controller;
        this.i18n = args.i18n;
        this.actionType = 'polyline';
    }

    _getMeasurements(evt) {
        const polylineToolActive = evt.activeTool && evt.activeTool === 'drawpolylinetool';
        this.controller.setGraphicAttributes(evt);

        if (polylineToolActive && evt.state === 'active') {
            this._addAngleMeasurementForPolylines(evt);
            this._addLineMeasurementsToPolylines(evt)

            if (this._model.cursorUpdate) {
                this._checkIfPositionHasChanged(evt);
            }
        }
        if (polylineToolActive && evt.state === 'complete') {
            this.controller.removeTemporaryMeasurements(evt);
            this._calculateTotalLineMeasurement(evt);
        }
    }

    _updateMeasurements(evt) {
        if (evt.graphics[0].getAttribute('measurementEnabled') === true || this._model.measurementEnabled) {
            if (!evt.graphics[0].attributes?.id) {
                return;
            }
            this._calculateTotalLineMeasurement(evt);
            this._addLineMeasurementsToPolylines(evt);
            this._addAngleMeasurementForPolylines(evt, evt.aborted);
            this.controller.showCompleteResultsInTab(evt);
        }
    }

    _showLineMeasurementsOnPolylines() {
        return this._model.showLineMeasurementsAtPolylines;
    }

    _showAngleMeasurementsOnPolylines() {
        return this._model.showAngleMeasurementsAtPolylines;
    }

    /**
     * check if the current position is still the same as 2 seconds ago
     * -> if yes show line length and (for polygons) circumference & area
     *
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
        const id = graphic.getAttribute('id') || `measurement-${graphic.uid}`;
        this.controller.removeGraphicsByIdAndType(id, "fullLength");
        graphic.setAttribute("id", id)
        if (path.length < 2) {
            return;
        }
        const viewModel = this.viewModel;
        const spatialReference = viewModel.view.spatialReference;
        const lengthString = evt.state === 'complete' ?
            `${this.i18n.totalLength}: ${this.controller.getLength(graphic.geometry)}` :
            `${this.controller.getLength(graphic.geometry)}`
        if (!this.controller.stringIsDuplicate(lengthString)) {
            const pnt = new Point(path[path.length - 1], spatialReference);

            // calculate text position due to last line element
            const textPosition = this.controller.getTextPosition(path);
            const yOffset = this.controller.getYOffset(path);
            const textGraphic = (new MeasurementGraphicFactory(this._model.textSettings).createGraphic(lengthString, pnt, parseInt(id.substring(12)), this._model.cursorUpdate || this._model.vertexAdded, undefined, {horizontalAlignment: textPosition, yoffset: yOffset}));
            
            textGraphic.setAttribute("type", "fullLength");
            viewModel.layer.add(textGraphic);
        }
    }

    /**
     * add line measurements to a polyline
     *
     * @param evt
     * @param aborted
     * @private
     */
    _addLineMeasurementsToPolylines(evt, aborted) {
        // remove the graphics so they do not stack on one another
        const update = evt.type === 'update' || evt.type === 'undo' || evt.type === 'redo';
        const graphic = update ? evt.graphics[0] : evt.graphic;
        const id = graphic.getAttribute("id") || `measurement-${graphic.uid}`;
        this.controller.removeGraphicsByIdAndType(id, "measurement");

        if (this._showLineMeasurementsOnPolylines() && !aborted) {
            const spatialReference = this.viewModel.view.spatialReference;
            const paths = graphic.geometry.paths[0];
            for (let i = 1; i < paths.length; i++) {
                const redoUndo = evt.type === 'redo' || evt.type === 'undo';
                const lastPassOnUndo = redoUndo && i === paths.length - 1;
                if (!lastPassOnUndo) {
                    const checkedPath = [paths[i - 1], paths[i]];
                    const textGraphic =
                        this.controller.createDistanceTextCursorUpdate(checkedPath, spatialReference, id);
                    textGraphic.setAttribute("type", "measurement");
                    this.viewModel.layer.add(textGraphic);
                }
            }
        }
    }

    /**
     * add angle texts to polyline
     *
     * @param evt
     * @param aborted
     * @private
     */
    _addAngleMeasurementForPolylines(evt, aborted) {
        // remove the graphics so they do not stack on one another
        const update = evt.type === 'update' || evt.type === 'undo' || evt.type === 'redo';
        const graphic = update ? evt.graphics[0] : evt.graphic;
        const id = graphic.getAttribute("id") || `measurement-${graphic.uid}`;
        this.controller.removeGraphicsByIdAndType(id, "angle");

        // const viewModel = this.viewModel;
        const geometryToTransform = graphic.geometry;
        const spatialReference = geometryToTransform.spatialReference;

        if (this._showAngleMeasurementsOnPolylines(evt) && !aborted) {
            this.controller._coordinateTransformer.transform(geometryToTransform, 3857).then(transformedGeometry => {
                const paths = transformedGeometry.paths[0];
                if (paths.length >= 3) {
                    for (let i = 2; i < paths.length; i++) {
                        const p2 = new Point(paths[i]);
                        const p1 = new Point(paths[i - 1]);
                        const p3 = new Point(paths[i - 2]);

                        const orgPath = geometryToTransform.paths[0];
                        const pointCoordinates = orgPath[i - 1];
                        const point = new Point({
                            spatialReference: spatialReference,
                            x: pointCoordinates[0],
                            y: pointCoordinates[1]
                        });

                        const angleGraphic = this.controller.createAngleTextCursorUpdate(p1, p2, p3, point, id);
                        this.viewModel.layer.add(angleGraphic);
                    }
                }
            });
        }
    }
}
