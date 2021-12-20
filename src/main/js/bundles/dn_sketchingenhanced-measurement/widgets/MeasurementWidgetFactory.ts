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

import type { SketchToolExtension } from 'dn_sketchingenhanced/SketchingEnhancedTypes';
// @ts-ignore
import MeasurementWidget from './MeasurementWidget.vue';
import Binding, { Binding as BindingType } from 'apprt-binding/Binding';
import type { Mutable } from '@conterra/ct-mapapps-typings/apprt-core/Mutable';

export default class MeasurementWidgetFactory {
  _i18n: any;
  config: {
    _properties: {
      measurementUnits: any,
      measurementTools: string[],
    },
  };
  handler: BindingType;
  model: typeof Mutable

  createInstance(): SketchToolExtension {

    const props = {
      i18n: this._i18n?.get()?.ui,
      units: this.config._properties.measurementUnits,
    };

    const events = {
      created: (e) => {
        if (this.handler) {
          this.handler.remove();
        }

        const measurementValuesProperties = ['coordinates', 'currentLength', 'aggregateLength', 'currentArea', 'perimeter', 'totalLength', 'area', 'enableAngleMeasurement', 'areaEnabled'];
        const measurementOptions = ['showLineMeasurementsAtPolylines', 'showLineMeasurementsAtPolygons', 'showAngleMeasurementsAtPolylines', 'lengthUnit', 'areaUnit', 'angleUnit'];
        this.handler = Binding.for(e, this.model).sync('area', e => {
          console.log(e);
          return e
        })
          .sync('enabled', 'measurementEnabled')
          .syncToLeft(['pointEnabled', 'polylineEnabled', 'polygonEnabled'], 'activeSketchingTool',
            ([point, line, polygon]) => {
              if (point) {
                return 'point';
              } else if (line) {
                return 'polyline'
              } else if (polygon) {
                return 'polygon'
              } return null
            })
          .sync('selectedPointSrs', 'srs')
          .syncToLeft(measurementValuesProperties, 'measurementValues', (e) => measurementValuesProperties.reduce((values, prop, i) => {
            values[prop] = e[i];
            return values;
          }, {}))
          .sync("options", measurementOptions,
            e => measurementOptions.map(x => e[x]),
            e => measurementOptions.reduce((options, prop, i) => {
              options[prop] = e[i];
              return options
            }, {}))
          .syncToLeftNow()
          .enable();
      }
    }

    const response = {
      props,
      events,
      header: this._i18n?.get()?.ui.tabTitle,
      view: MeasurementWidget,
      for: this.config._properties.measurementTools,
    };

    return response;
  }
}