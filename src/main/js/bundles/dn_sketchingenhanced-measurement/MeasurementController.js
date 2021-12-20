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

        this.calculator = new MeasurementCalculator(this._model, this._coordinateTransformer, this.i18n);
        this.graphicFactory = new MeasurementGraphicFactory(this._model.textSettings);
        this.handlers.push(this._model?.watch('textSettings', ({value}) => (this.graphicFactory.textSettings = value)));
        this.angleCalculator = new AngleCalculator(this._model._mapWidgetModel, this.i18n, this._model);
    }

    deactivate() {
        this.handlers.forEach(x => x.remove());
    }

    setProperties(value) {
        this._properties = value;
        Object.assign(this.calculator.settings, value);
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

    setGraphicAttributes(evt) {
        evt?.graphic?.setAttribute("measurementEnabled", this._model.measurementEnabled);
        evt?.graphic?.setAttribute("showLineMeasurementsAtPolylines", this._model.showLineMeasurementsAtPolylines);
        evt?.graphic?.setAttribute("showAngleMeasurementsAtPolylines", this._model.showAngleMeasurementsAtPolylines);
        evt?.graphic?.setAttribute("showLineMeasurementsAtPolygons", this._model.showLineMeasurementsAtPolygons);
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
                this._model.aggregateLength =this.calculator.getLength(graphic.geometry)
                break;
            case("drawpolygontool"):
            case("drawfreehandpolylgontool"):
                this._model.currentLength = this.getLastSegmentLength(evt);
                this._model.currentArea = this.calculator.getArea(graphic.geometry);
                break;
            case("drawrectangletool"):
            case("drawcircletool"):
            case("drawtriangletool"):
            case("drawellipsetool"):
                this._model.perimeter = this.calculator.getLength(graphic.geometry);
                this._model.area = this.calculator.getArea(graphic.geometry);
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
                this._model.currentLength = '0';
                this._model.totalLength = this.calculator.getLength(graphic.geometry);
                break;
            case("drawpolygontool"):
            case("drawfreehandpolylgontool"):
                this._model.currentLength = '0';
                this._model.perimeter = this.calculator.getLength(graphic.geometry);
                this._model.area = this.calculator.getArea(graphic.geometry)
                break;
            case("drawrectangletool"):
            case("drawcircletool"):
            case("drawtriangletool"):
            case("drawellipsetool"):
                this._model.perimeter = this.calculator.getLength(graphic.geometry);
                this._model.area = this.calculator.getArea(graphic.geometry);
                break;
            case(null):
                break;
        }
    }
}
