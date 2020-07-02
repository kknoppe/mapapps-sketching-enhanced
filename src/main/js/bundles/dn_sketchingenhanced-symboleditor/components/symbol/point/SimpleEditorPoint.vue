<!--

    Copyright (C) 2020 con terra GmbH (info@conterra.de)

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

-->
<template>
    <v-container class="simpleSymbolEditor">
        <v-layout row wrap align-center justify-center class="btnGroupSimpleSymbol">

            <v-btn-toggle v-model="activeTab" active-class="btnGroupSingleSymbol"
                          class="grey lighten-2 elevation-3">

                <!-- color -->
                <div class="fill_color">
                    <editor-button
                        :active="activeTab === 0"
                        icon="format_color_fill"
                        :color="settings.color"
                        :tooltip="i18n.colorPickerPointTooltip"
                    ></editor-button>
                </div>

                <!-- shape -->
                <editor-button
                    :active="activeTab === 1"
                    icon="format_color_fill"
                    :tooltip="i18n.PointSymbolSelectorTooltip">
                    <template slot="icon">
                        <point-shape :shape="settings.shape"></point-shape>
                    </template>
                    <!-- no preview -->
                    <div></div>
                </editor-button>

                <!-- size -->
                <editor-button
                    :active="activeTab === 2"
                    icon="fullscreen"
                    type="text"
                    :tooltip="i18n.pointRadiusSliderLabel">
                    <span class="text-preview">{{ settings.radius }}</span>
                </editor-button>
            </v-btn-toggle>
        </v-layout>

        <v-layout row wrap align-center justify-center class="editor-content">

            <color-picker v-model="color" v-if="activeTab === 0"></color-picker>

            <point-shape-picker v-model="settings.shape" class="mt-2 elevation-1"
                                v-if="activeTab === 1"></point-shape-picker>

            <size-slider v-if="activeTab === 2"
                         :label="i18n.pointRadiusSliderLabel"
                         :size.sync="settings.radius"
                         :max="maximumPointSize"
                         :min="1"
                         type="point"
                         :step="1">
            </size-slider>
        </v-layout>

    </v-container>
</template>

<script>
    import {Sketch} from 'dn_vuecolor';
    import PointShapePicker from './PointShapePicker.vue';
    import PointShape from './PointShape.vue';
    import EditorButton from '../EditorButton.vue';
    import SizeSlider from 'dn_sketchingenhanced-symboleditor/components/input/SizeSlider.vue';

    export default {
        components: {
            'color-picker': Sketch,
            'size-slider': SizeSlider,
            EditorButton,
            PointShape,
            PointShapePicker,
        },

        props: {
            i18n: {type: Object, default: () => ({}),},
            settings: Object,
        },

        data() {
            /**
             * Data variables are only here registered as support for the GUI workflow
             */
            return {
                activeTab: 0,
                color: '',
            };
        },

        mounted() {
            this.color = this.settings.color;
        },
        computed: {
            maximumPointSize() {
                return this.settings.maxPointSize ? this.settings.maxPointSize : 255;
            },
        },
        watch: {
            color(color) {
                if (color.rgba) {
                    this.settings.color = color.rgba;
                    // reset picture url
                    this.settings.url = null;
                }
            },
        },
    };
</script>
