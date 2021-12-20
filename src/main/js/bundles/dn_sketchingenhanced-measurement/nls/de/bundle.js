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
module.exports = {
    bundleName: "Sketching Enhanced Measurement",
    bundleDescription: "Sketching Enhanced Measurement",
    ui: {
        windowTitle: 'Messen',
        tabTitle: 'Messung',
        enableMeasurements: 'Messen aktivieren',

        measurement: {
            showLineMeasurementsAtPolylines: 'Zeige Länge von Linienelementen',
            showLineMeasurementsAtPolygons: 'Zeige Kantenlänge von Polygonen',
            showAngleMeasurementsAtPolylines: 'Zeige Winkel',
            coordinateSystem: 'Koordinatensystem',
            copyToClipboard: 'Kopieren',
            unitLengthSelect: 'Längeneinheit',
            unitAreaSelect: 'Flächeneinheit',
            angleUnit: {
                header: "Winkleinheit",
                unit1: "Grad",
                unit2: "Gon"
            },
            lengthUnit: {
                auto: 'auto',
                meters: 'Meter',
                kilometers: 'Kilometer',
            },
            areaUnit: {
                auto: 'auto',
                'square-meters': 'Quadratmeter',
                'square-kilometers': 'Quadratkilometer',
                hectares: 'Hektar',
            },
            coordinates: 'Koordinaten: ',
            currentLength: 'Aktuelle Teilstrecke: ',
            aggregateLength: 'Aktuelle Gesamtlänge: ',
            totalLength: 'Gesamtlänge: ',
            currentArea: 'Aktuelle Fläche: ',
            perimeter: 'Umfang: ',
            area: 'Gesamtfläche: ',

        },
    },
    tool: {
        title: 'Messen',
        tooltip: 'Messwerkzeuge',
    },
    totalLength: 'Gesamtlänge',
    area: 'Fläche',
    circumference: 'Umfang',
    locale: 'de-de',
};
