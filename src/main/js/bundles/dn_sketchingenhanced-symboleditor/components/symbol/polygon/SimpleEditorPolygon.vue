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
                        :tooltip="i18n.colorPickerFillTooltip"
                    ></editor-button>
                </div>

                <!-- style -->
                <editor-button
                    :active="activeTab === 1"
                    icon="texture"
                    :tooltip="i18n.fillStyleSelectorTooltip">
                    <fill-style
                        style="line-height: 0.5em"
                        v-bind="{i18n}"
                        :fillStyle="settings.style"></fill-style>
                </editor-button>
            </v-btn-toggle>

            <line-editor-buttons v-bind="{i18n}" :settings="settings.outline" :activeTab.sync="lineTab"
                                 class="ml-4"></line-editor-buttons>
        </v-layout>
        <v-layout row wrap align-center justify-center class="editor-content">
            <color-picker v-model="color" v-if="activeTab === 0"></color-picker>

            <fill-style-picker v-model="settings.style" v-if="activeTab === 1" v-bind="{i18n}"></fill-style-picker>

            <line-editor v-bind="{i18n}" :activeTab="lineTab" :settings="settings.outline"></line-editor>

        </v-layout>

    </v-container>
</template>

<script>
    import {Sketch} from 'dn_vuecolor';
    import FillStyle from './FillStyle.vue';
    import FillStylePicker from './FillStylePicker.vue';
    import LineEditorButtons from '../line/LineEditorButtons.vue';
    import LineEditor from '../line/LineEditor.vue';
    import EditorButton from '../EditorButton.vue';

    export default {

        components: {
            'color-picker': Sketch,
            EditorButton,
            FillStyle,
            FillStylePicker,
            LineEditorButtons,
            LineEditor,
        },

        props: {
            i18n: {type: Object, default: () => ({})},
            settings: {type: Object, required: true},
        },

        computed: {
            lineTab: {
                get() {
                    if (this.activeTab < 2) {
                        // unset line tabs
                        return null;
                    }

                    return this.activeTab - 2;
                },
                set(val) {
                    if (val !== null) {
                        this.activeTab = val + 2;
                    }
                },
            },
        },

        data() {
            /**
             * Data variables are only here registered as support for the GUI workflow
             */
            return {
                activeTab: 0,
                color: this.settings.color,
            };
        },
        watch: {
            color(color) {
                if (color.rgba) {
                    this.settings.color = color.rgba;
                }
            },
            'settings.color'(val) {
                this.color = val;
            },
        },
    };
</script>
