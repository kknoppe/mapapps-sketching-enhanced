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
    root: ({
        bundleName: 'Sketching',
        bundleDescription: '',
        ui: {
            windowTitle: 'Measurement',
            tabTitle: 'Measurement',
            enableMeasurements: 'Enable measurements',

            measurement: {
                showLineMeasurementsAtPolylines: 'Show length of line elements',
                showLineMeasurementsAtPolygons: 'Show edge length of polygons',
                showAngleMeasurementsAtPolylines: 'Show angle',
                coordinateSystem: 'Coordinate System',
                copyToClipboard: 'Copy to Clipboard',
                unitLengthSelect: 'Length Unit',
                unitAreaSelect: 'Area Unit',
                angleUnit: {
                    header: "Angle Measurement Unit",
                    unit1: "Degree",
                    unit2: "Gradian"
                },

                coordinates: 'Coordinates: ',
                currentLength: 'Current Segment Length: ',
                aggregateLength: 'Current Total Length: ',
                totalLength: 'Total Length: ',
                currentArea: 'Current Area: ',
                perimeter: 'Perimeter: ',
                area: 'Total Area: ',                
            },
        },
        tool: {
            title: 'Measurement',
            tooltip: 'Measurement Tools',
        },
        totalLength: 'Total length',
        area: 'Area',
        circumference: 'Perimeter',
        locale: 'en-en',
    }),
    'de': true,
};
