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

type MeasurementLabelType = 'totalLength' | 'area' | 'circumference';
type MeasurementLabelDefinition = { [day in MeasurementLabelType]: string };
type MeasurementLabelDefinitionWithLocale = { locale: string } & MeasurementLabelDefinition;
type MeasurementLabelDeifinitionCollection = { [key: string]: MeasurementLabelDefinition; }


export class MeasurementLabelProvider {
    private measurementLabels: MeasurementLabelDeifinitionCollection;
    private i18n: MeasurementLabelDefinitionWithLocale;

    constructor(measurementLabels: MeasurementLabelDeifinitionCollection, i18n: MeasurementLabelDefinitionWithLocale) {
        this.measurementLabels = measurementLabels;
        this.i18n = i18n;
    }

    private getConfiguredLabel(type: MeasurementLabelType): string {
        return this.measurementLabels?.[this.i18n?.locale]?.[type] || this.i18n?.[type];
    }

    public getLabel(value: string, type: MeasurementLabelType) {
        const label = this.getConfiguredLabel(type);
        return `${label}: ${value}`;
    }
}