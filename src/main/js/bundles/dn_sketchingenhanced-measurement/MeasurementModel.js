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
import {Mutable, properties} from 'apprt-core/Mutable';

class MeasurementModel extends Mutable {
    constructor() {
        super();
    }
}

properties(MeasurementModel, {
    viewModel: {},
    showLineMeasurementsAtPolylines: false,
    showLineMeasurementsAtPolygons: false,
    showAngleMeasurementsAtPolylines: false,
    enableAngleMeasurement: false,
    lineMeasurementTimeout: 100, //default
    mDecimal: 2, //default
    kmDecimal: 2, //default
    spatialReference: null,

    currentLength: 0,
    aggregateLength: 0,
    totalLength: 0,
    area: 0,
    currentArea: 0,
    perimeter: 0,
    coordinates: null,

    angleUnit: "Grad",
    lengthUnit: 'auto',
    areaUnit: 'auto',

    measurementEnabled: false,
    multiMeasurement: true,

    pointEnabled: false,
    polylineEnabled: false,
    polygonEnabled: false,
    areaEnabled: false,

    textSettings: "",
    lineSettings: "",

    cursorUpdate: false,
    vertexAdded: false,
    _lastVertex: null,
    _vertices: [],

    activeTool: ""

});


export default MeasurementModel;
