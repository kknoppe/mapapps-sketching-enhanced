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
        bundleName: 'Sketching Enhanced',
        bundleDescription: 'Sketching Enhanced',
        ui: {
            windowTitle: 'Sketching',
            noActiveTool: 'Please select a tool or move the map.',
            activeConstructionLength: 'Length',
            activeConstructionAngle: 'Angle',
            turnOnVisibility: 'Show drawings',
            turnOffVisibility: 'Hide drawings',
            addNewSketchingLayer: 'Create new layer',
            notAddNewSketchingLayer: 'No Tool selected',
            layerLimitReached: 'Layer limit reached',
            profileLoaded: 'Currently recording',
            enableMeasurements: 'Enable measurements',
            settings: 'Settings',
            disableKeepMeasurements: 'disable keeping measurements',
            enableKeepMeasurements: 'enable keeping measurements',
            noDrawings: "No drawings",
            textEditor: {
                bold: 'Bold',
                italic: 'Italic',
                underlined: 'Underlined',
                blurSize: 'Size',
                textFontButton: 'Text Font',
                textColorButton: 'Text Color',
                textStyleButton: 'Text Style',
                textSizeButton: 'Text Size',
                textBlurButton: 'Text Blur',
                textAngleButton: 'Text rotation',
                angle: 'Angle',
                rules: {
                    required: 'required',
                    number: 'value must be type of number',
                    string: 'value must be type of string',
                    invalidPattern: 'value must be number-number',
                    tooBig: 'Maximum 360°',
                    tooSmall: 'Minimum 0°',
                },
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
            },
            measurement: {
                showLineMeasurementsAtPolylines: 'Show length of line elements',
                showLineMeasurementsAtPolygons: 'Show edge length of polygons',
                coordinates: 'Coordinates: ',
                coordinateSystem: 'Coordinate System',
                totalLength: 'Total Length: ',
                currentLength: 'Current Segment Length: ',
                aggregateLength: 'Current Total Length: ',
                area: 'Total Area: ',
                currentArea: 'Current Area: ',
                perimeter: 'Perimeter: ',
                copyToClipboard: 'Copy to Clipboard',
                unitLengthSelect: 'Length Unit',
                unitAreaSelect: 'Area Unit',
                drawTab: 'Appearance',
                measureTab: 'Measurement',
                constructionTab: 'Construction'
            },
            layerEditor: {
                header: 'Sketching Layer',
                noProfiles: 'No profiles defined yet.',
                noProfileTemplates: 'No profile templates defined yet.',
                allProfilesFiltered: 'All profiles have been filtered.',
                tab_profiles: 'Personal',
                tab_templates: 'Templates',
                noDescription: 'No Description',

                // Tooltips
                tooltip_import: 'Import',
                tooltip_addProfile: 'Create a new Layer',
                tooltip_edit: 'Rename Layer',
                tooltip_edit_save: 'Save',
                tooltip_edit_cancel: 'Cancel',
                tooltip_delete: 'Delete Layer',
                tooltip_copy: 'Copy Layer',
                tooltip_setAsDefault: 'Set Layer as default',
                tooltip_download: 'Export Layer',
                tooltip_sort: 'Sort list',
                tooltip_selection_start: 'Start selection mode',
                tooltip_selection_stop: 'Stop selection mode',
                tooltip_addToMyThemes: 'Add to MyThemes',
                tooltip_removeFromMyThemes: 'Remove from MyThemes',
                tooltip_recordInLayer: 'Record into Layer',
                tooltip_pauseRecordingInLayer: 'Stop Recording',

                // Profile properties
                createdAt: 'Created at ${p1} ${p2}', //NOSONAR
                modifiedAt: 'Modified at ${p1}, ${p2}', //NOSONAR
                title: 'Name',
                description: 'Description',

                // Store
                profileStore: 'Capacity',

                // Edit page
                editProfile_header: 'Create a new Layer',
                editProfile_saveAs: 'Save as',
                editProfile_optPersonal: 'Personal Template',
                editProfile_optTemplate: 'Template',
                editProfile_optional: 'optional',
                copy_appendix: ' (Copy)',
                editProfile_setAsDefault: 'Set as default',

                // Rules
                title_required: 'Name is required',
                title_maxlength: 'Max ${p1} characters allowed', //NOSONAR
                title_unique: 'A profile with this name already exists!',
                description_maxlength: 'Max ${p1} characters allowed', //NOSONAR

                // Delete dialog
                deleteProfile_header: 'Delete Layer?',
                deleteProfile_text: 'Do you really want to delete the profile "${p1}"? This process cannot be undone.', //NOSONAR
                deleteProfile_multiheader: 'Delete Layers?',
                deleteProfile_multitext: 'Do you really want to delete these ${p1} profiles? This process cannot be undone.', //NOSONAR
                deleteProfile_confirm: 'Yes',
                deleteProfile_cancel: 'Cancel',

                // Set as default profile dialog
                setAsDefaultProfile_header: 'Set Layer as default?',
                setAsDefaultProfile_text: 'Do you really want to set the profile "${p1}" as default?', //NOSONAR
                setAsDefaultProfile_confirm: 'Yes',
                setAsDefaultProfile_cancel: 'Cancel',

                // Sort items
                sort_title: 'By Name',
                sort_creationdate: 'By Date',

                // Import page
                importProfile_header: 'Import Layer',
                importProfile_cancel: 'Cancel',
                importProfile_invalidFile: 'Invalid file!',

                // Download page
                downloadProfile_header: 'Download Layer',
                downloadProfile_cancel: 'Cancel',
                downloadProfile_filename: 'File name',
                downloadProfile_emptyFilename: 'File name is required!',
                downloadProfile_invalidFilename: 'Invalid file name!',
                downloadProfile_summary_single: 'The following profile will be exported:',
                downloadProfile_summary: 'The following ${p1} profiles will be exported:', //NOSONAR
            },
        },
        tool: {
            title: 'Sketching',
            tooltip: 'Sketching Tools',
        },
    }),
    'de': true,
};
