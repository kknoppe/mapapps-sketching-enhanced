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

export type MeasurementUpdateEvent = __esri.SketchViewModelUpdateEvent | __esri.SketchViewModelUndoEvent | __esri.SketchViewModelRedoEvent;

export interface MeasurementAction {
    actionType: string;
    _getMeasurements(event: __esri.SketchViewModelCreateEvent): Promise<any> | any;
    _updateMeasurements(event: MeasurementUpdateEvent): Promise<any> | any;
    deleteMeasurements(event: __esri.SketchViewModelDeleteEvent): Promise<any> | any;
}