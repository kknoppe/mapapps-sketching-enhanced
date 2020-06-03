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
/*** SKIP-SONARQUBE-ANALYSIS ***/
/*
 * Copyright (C) con terra GmbH
 */

import AsyncTask from "apprt-core/AsyncTask";
import LayerVisibility from "selection-services/LayerVisibility";
import FindMapLayer from "./FindMapLayer"
import {getPropertySymbol} from "./GetPropertySymbol"

export default function () {
    return {
        set_searchSourceModel(sourceModel) {
            sourceModel._calculateEffectiveSources = function () {
                const model = this.mapWidgetModel;
                const visibilityOptions = {
                    useScaleForVisibility: this.useScaleForVisibility,
                    useExtentForVisibility: this.useExtentForVisibility
                };

                let target = this;
                let _sources = getPropertySymbol("Symbol(_sources)", target);
                if (!_sources) {
                    target = this.__proto__;
                    _sources = getPropertySymbol("Symbol(_sources)", target);
                }
                let _effectiveSources = getPropertySymbol("Symbol(_effectiveSources)", target);

                //extends
                this[_effectiveSources] = this[_sources].filter(source => {
                    const store = source.store;
                    if (this.respectLayerVisibility && store.layerId !== undefined) {
                        return LayerVisibility.isEffectivelyVisible(store.layerId, model, visibilityOptions);
                    } else {
                        const layer = FindMapLayer.findLayer(store, model);
                        const layerId = layer && FindMapLayer.makeLayerPath(layer);
                        return layerId && LayerVisibility.isEffectivelyVisible(layerId, model, visibilityOptions);
                    }
                })
            };

            const _triggerCalculation = getPropertySymbol("Symbol(_triggerCalculation)", sourceModel);
            sourceModel[_triggerCalculation] = AsyncTask(sourceModel._calculateEffectiveSources.bind(sourceModel)).delay.bind(sourceModel, sourceModel.recalculationDelay);
        }
    }
};
