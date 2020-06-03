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
        bundleName: 'custom_components',
        bundleDescription: '',
        ui: {
            control: {
                transparencySlider: {
                    transparency: 'Transparency',
                },
            },
            form: {
                dropzone: {
                    placeholder: 'Drag and drop a file here or click',
                    err_invalid_file: 'Invalid file',
                },
            },
            input: {
                quickfilter: {
                    label: 'Insert search term',
                },
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
