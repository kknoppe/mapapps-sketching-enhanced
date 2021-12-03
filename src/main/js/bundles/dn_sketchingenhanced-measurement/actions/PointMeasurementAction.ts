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

import type CoordinateTransformer from 'ct/api/coordinatetransformer/CoordinateTransformer';
import type Geometry from "esri/geometry/Geometry";
import type Graphic from "esri/Graphic";
import type { MeasurementLayer } from "dn_sketchingenhanced-measurement/MeasurementLayer";
import type SpatialReference from "esri/geometry/SpatialReference";
import type Point from 'esri/geometry/Point';

export interface PointMeasurementActionProperties {
    pointCoordPlaces: number;
    systemsWithUnits: string[];
    pointCoordUnitSymbolY: string;
    pointCoordUnitSymbolX: string;
}

export default class PointMeasurementAction {

    layer: MeasurementLayer;
    coordinateTransformer: typeof CoordinateTransformer;
    _properties: PointMeasurementActionProperties;
    _model: any; //TODO typing
    actionType = 'point';

    constructor(args, layer: MeasurementLayer) {
        this._properties = args._properties;
        this.coordinateTransformer = args.coordinateTransformer;
        this.layer = layer;
        this._model = args._model;
    }

    public _getMeasurements(evt: __esri.SketchViewModelCreateEvent): void {
        // @ts-ignore //TODO: typing for custom SketchViewModelCreateEvent
        if (evt.activeTool === "drawpointtool" && evt?.graphic) {
            this._addPointCoordinatesTextToPoint(evt.graphic);
        }
    }

    public _updateMeasurements(evt: __esri.SketchViewModelUpdateEvent): void {
        this.layer.removeManyMeasurements(evt.graphics);

        if (evt.state === "complete") {
            evt.graphics.forEach(g => this._addPointCoordinatesTextToPoint(g));
        }
    }

    /**
     * add point coordinates to Point Object
     * @param evt
     * @private
     */
    private async _addPointCoordinatesTextToPoint(graphic: Graphic): Promise<void> {
        const point = graphic.geometry;
        const coordString = await this._getPointString(graphic?.geometry);
        this._model.coordinates = coordString;
        this.layer.addMeasurement(point, graphic, { text: coordString, horizontalAlignment: 'left', xoffset: 10, yoffset: -20 });
    }

    /**
     * converts the point graphic into a readable string (asyncronous)
     * @return corrdinate string
     * @param evt
     * @private
     */
    private async _getPointString(geometry: Geometry): Promise<string> {
        if (!geometry) {
            return '';
        }

        const srs = geometry.spatialReference.wkid;
        const targetSrs = this._model.srs?.systemWkid ? this._model.srs.systemWkid : srs;
        const places = this._properties.pointCoordPlaces || 2;
        const unitSymbolX = this._properties.systemsWithUnits.includes(targetSrs.toString()) ? this._properties.pointCoordUnitSymbolX : '';
        const unitSymbolY = this._properties.systemsWithUnits.includes(targetSrs.toString()) ? this._properties.pointCoordUnitSymbolY : '';
        const transformedPoint = await this._transformGeom(geometry, targetSrs);

        if (!transformedPoint) {
            return null;
        }
        let x = transformedPoint.x.toFixed(places);
        let y = transformedPoint.y.toFixed(places);
        if (this._model.srs?.transform === 'dms') {
            const newX = this._toDMS(x, unitSymbolX.length > 1 ? unitSymbolX[1] : unitSymbolX);
            const newY = this._toDMS(y, unitSymbolY.length > 1 ? unitSymbolY[1] : unitSymbolY);
            return (newX + " / " + newY);
        }
        return (x + unitSymbolX + " / " + y + unitSymbolY);
    }

    /**
     * transform the point into a the desired srs
     * @return {Promise<string>} coordinate
     * @param geom, targetSrs
     * @private
     */
    private async _transformGeom(geom: Geometry, targetSrs: SpatialReference): Promise<Point> {
        return this.coordinateTransformer?.transform(geom, targetSrs);
    }

    /**
     * converts decimal degrees to degree/minutes/seconds
     * @param input: coordinate in decimal degree (wgs84)
     * @param unitSymbol: (N,E,S,W)
     * @returns {string}
     * @private
     */
    private _toDMS(input: string, unitSymbol: string): string {
        const coordinate = Math.abs(parseFloat(input));
        const degree = Math.floor(coordinate);
        const decimalMinutes = coordinate - degree;
        const degreeMinutes = decimalMinutes * 60;
        const minutes = Math.floor(degreeMinutes);
        const decimalSeconds = degreeMinutes - minutes;
        const degreeSeconds = decimalSeconds * 60;
        const seconds = Math.floor(degreeSeconds);
        return `${degree}° ${minutes}' ${seconds}'' ${unitSymbol}`;
    }
}
