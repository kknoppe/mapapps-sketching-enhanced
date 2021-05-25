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

import TextSymbol from "esri/symbols/TextSymbol";
import Graphic from "esri/Graphic";

export default class PointMeasurementHandler {
    constructor(args){
        this._properties = args._properties;
        this.coordinateTransformer = args.coordinateTransformer;
        this.viewModel = args.viewModel;
        this._model = args._model;
        this.controller = args.controller;
        this.i18n = args.i18n;
        this.actionType = 'point'
    }
    _getMeasurements(evt){
        if (evt.activeTool && evt.activeTool === "drawpointtool"){
            this._addPointCoordinatesTextToPoint(evt);
        }
    }

    /**
     * add point coordinates to Point Object
     * @param evt
     * @private
     */
    _addPointCoordinatesTextToPoint(evt) {
        const id = evt.graphic.uid;
        const viewModel = this.viewModel;
        const point = evt.graphic.geometry;
        this._getPointString(evt).then(coordString => {
            this._model.coordinates = coordString;
            const textSymbol = new TextSymbol({
                text: coordString,
                color: this._model.textSettings.color,
                name: `measurement-${id}`,
                font: this._model.textSettings.font,
                haloColor: this._model.textSettings.haloColor,
                haloSize: this._model.textSettings.haloSize,
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
                const targetSrs = this._model.srs && this._model.srs.systemWkid ? this._model.srs.systemWkid : srs;
                const places = this._properties.pointCoordPlaces || 2;
                const unitSymbolX = this._properties.systemsWithUnits.includes(targetSrs.toString()) ? this._properties.pointCoordUnitSymbolX : '';
                const unitSymbolY = this._properties.systemsWithUnits.includes(targetSrs.toString()) ? this._properties.pointCoordUnitSymbolY : '';
                const transformedPoint = this._transformGeom(evt.graphic.geometry, targetSrs);
                Promise.all([transformedPoint]).then(transformedPoint => {
                    let x = transformedPoint[0].x.toFixed(places);
                    let y = transformedPoint[0].y.toFixed(places);
                    if(this._model.srs && this._model.srs.transform && this._model.srs.transform === 'dms') {
                        const newX = this._toDMS(x, unitSymbolX.length > 1 ? unitSymbolX[1] : unitSymbolX);
                        const newY = this._toDMS(y, unitSymbolY.length > 1 ? unitSymbolY[1] : unitSymbolY);
                        resolve(newX+ " / "+newY);
                    }
                    resolve(x+unitSymbolX +" / "+y+unitSymbolY);
                });
            } else{
                resolve("");
            }
        });
    }

    _updateMeasurements(evt){

    }

    /**
     * transform the point into a the desired srs
     * @return corrdinate string
     * @param geom, targetSrs
     * @private
     */
    _transformGeom(geom, targetSrs){
        if (this.coordinateTransformer) {
            return this.coordinateTransformer.transform(geom, targetSrs);
        }
    }

    /**
     * converts decimal degrees to degree/minutes/seconds
     * @param input: coordinate in decimal degree (wgs84)
     * @param unitSymbol: (N,E,S,W)
     * @returns {string}
     * @private
     */
    _toDMS(input, unitSymbol) {
        const coordinate = Math.abs(input);
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
