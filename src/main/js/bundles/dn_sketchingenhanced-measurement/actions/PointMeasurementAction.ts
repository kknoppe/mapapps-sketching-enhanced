///
/// Copyright (C) 2020 con terra GmbH (info@conterra.de)
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///         http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import type Graphic from "esri/Graphic";
import type { MeasurementLayer } from "dn_sketchingenhanced-measurement/MeasurementLayer";
import type Point from 'esri/geometry/Point';
import type { MeasurementAction, MeasurementUpdateEvent } from './MeasurementAction';
import type { MeasurementCalculator } from 'dn_sketchingenhanced-measurement/MeasurementCalculator';

type PointMeasurementModel = {
    coordinates: string;
};

export default class PointMeasurementAction implements MeasurementAction {
    public actionType = 'point';
    private layer: MeasurementLayer;
    private model: PointMeasurementModel;
    private calculator: MeasurementCalculator;


    constructor(model: PointMeasurementModel, layer: MeasurementLayer, calculator: MeasurementCalculator) {
        this.layer = layer;
        this.model = model;
        this.calculator = calculator;
    }

    public async _getMeasurements(evt: __esri.SketchViewModelCreateEvent): Promise<void> {
        // @ts-ignore //TODO: typing for custom SketchViewModelCreateEvent
        if (evt.activeTool === "drawpointtool" && evt?.graphic) {
            return this._addPointCoordinatesTextToPoint(evt.graphic);
        }
    }

    public async _updateMeasurements(evt: MeasurementUpdateEvent): Promise<void[]> {
        this.layer.removeManyMeasurements(evt.graphics);

        if (evt?.type === "undo" || evt?.type === "redo") {
            return;
        }

        if (evt.state === "complete") {
            return Promise.all(evt.graphics.map(g => this._addPointCoordinatesTextToPoint(g)));
        }
    }

    public deleteMeasurements(evt: __esri.SketchViewModelDeleteEvent): void {
        this.layer.removeManyMeasurements(evt?.graphics);
    }

    /**
     * add point coordinates to Point Object
     * @param evt
     * @private
     */
    private async _addPointCoordinatesTextToPoint(graphic: Graphic): Promise<void> {
        const point = graphic.geometry as Point;
        const coordString = await this.calculator.getPointString(point);

        this.model.coordinates = coordString;
        this.layer.addMeasurement(point, graphic, { text: coordString, horizontalAlignment: 'left', xoffset: 10, yoffset: -20 });
    }
}
