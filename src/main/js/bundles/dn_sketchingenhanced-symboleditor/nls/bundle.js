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
    root: ({
        bundleName: "Sketching Enhanced Symboleditor",
        bundleDescription: "Sketching Enhanced Symboleditor",
        windowTitle: 'Symbol style customization',
        tool: {
            title: 'Symbol style editor',
            tooltip: 'Customize your own symbol style',
        },
        ui: {
            symbolEditor: {
                title: 'Symbol style editor',
                lineStyleSelectorTooltip: 'Line style',
                pointSymbolSelectorTooltip: 'Point symbol',
                lineWeightSliderLabel: 'Line weight',
                colorPickerPointTooltip: 'Point color',
                noFillTitle: 'None',
                noLineTitle: 'None',
                colorPickerFillTooltip: 'Fill color',
                fillStyleSelectorTooltip: 'Fill style',
                colorPickerLineTooltip: 'Line color',
                undo: 'Undo',
                pointRadiusSliderLabel: 'Point radius',
            },
            
            input: {
                sizeslider: {
                    errorSmall: 'too small',
                    errorBig: 'too big',
                    errorNumbers: 'only integer',
                    lineWeightSliderLabel: 'Line weight',
                    pointRadiusSliderLabel: 'Point radius',
                },
            },
        },
    }),
    'de': true,
};
