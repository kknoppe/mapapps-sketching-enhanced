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
const submit = 'Apply Settings';
const discard = 'Discard Settings';
module.exports = {
    root: ({
        bundleName: 'Symbol editor',
        bundleDescription: 'Bundle to edit feature layer and graphic layer style',
        windowTitle: 'Symbol style customization',
        tool: {
            title: 'Symbol style editor',
            tooltip: 'Customize your own symbol style',
        },
        ui: {
            scaleVisibilityBtnTooltip: 'Edit Visibility Range',
            textEditorBtnTooltip: 'Edit Labeling',
            styleEditorBtnTooltip: 'Edit Symbol',
            layerEditedInfoLog: 'Layer successful edited',
            notStartable: 'Editor could not be started!',

            scaleEditor: {
                title: 'Visibility Range',
                submit,
                discard,
            },
            labelEditor: {
                title: 'Custom Labeling',
                visible: 'Visible',
                select_field: 'Select field',
                visible_scale_between: 'Visible between ${p1} and ${p2}.', // NOSONAR
                visible_scale_larger: 'Visible from ${p1} and larger.', // NOSONAR
                visible_scale_smaller: 'Visible from ${p1} and smaller.', // NOSONAR
                default_tag: 'Default',
                noFieldsForLabeling: 'No field available',
                layerLabelingWarning: 'This layer does not support labeling!',

                submit,
                discard,
            },
            symbolEditor: {
                title: 'Symbol style editor',
                layerLabel: 'Select a layer',
                fieldLabel: 'Select a field',
                methodLabel: 'Select a method',
                unique: 'Use only one color',
                classBreaks: 'Use class breaks',
                textFieldLabel: 'Values: ',
                textFieldLabelUniqueValue: 'Value',
                openFillStyleMenuTooltip: 'Fill style menu',
                openLineStyleEditorTooltip: 'Line style',
                styleModifier: 'visualize symbol Editor',
                singleSymbolLabel: 'One symbol',
                categoriesLabel: 'Categories',
                sliderLabel: 'opacity',
                colorPickerLabel: 'select a color',
                lineWeightSliderLabel: 'Line weight',
                noFillTitle: 'None',
                noLineTitle: 'None',
                colorPickerFillTooltip: 'Fill color',
                lineStyleSelectorTooltip: 'Line style',
                fillStyleSelectorTooltip: 'Fill style',
                PointSymbolSelectorTooltip: 'Point symbol',
                pointRadiusSliderLabel: 'Point radius',
                colorPickerPointTooltip: 'Point color',
                colorPickerLineTooltip: 'Line color',
                categorySelectorLabel: 'Categories',
                loadingLayerMessage: 'Loading layer...',
                loadingValuesMessage: 'Loading values...',
                scaleVisibility: 'Activate scale dependent visibility',
                layerEditingWarning: 'This layer should not be edited!',
                colorGradientLineSelectorLabel: 'Select a color gradient',
                textEditor: 'Activate text editor',

                applyChangesBtnTooltip: 'Apply changes',
                discardChangesBtnTooltip: 'Discard changes',
                colorBtnLabel: 'Color',
                lineSizeLabel: 'Size',
                getChanges: 'apply',
                undo: 'Undo',
                noFieldsForSymbology: 'No field available',
                rules: {
                    required: 'required',
                    number: 'value must be type of number',
                    string: 'value must be type of string',
                    invalidPattern: 'value must be number-number',
                },

                submit,
                discard,
            },
            errors: {
                noResultsError: 'No results found for your query!',
                'FIELD_NOT_IN_LAYER': 'The field does not exist in this layer!',
            },
        },
    }),
    'de': true,
};
