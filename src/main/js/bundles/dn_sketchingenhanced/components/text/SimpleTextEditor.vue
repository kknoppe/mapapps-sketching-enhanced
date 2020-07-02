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

                <!-- font -->

                <div class="font-button">
                    <editor-button
                        :active="activeTab === 0"
                        icon="A"
                        type="text"
                        :tooltip="i18n.textFontButton">
                        <span class="text-preview">{{ font }}</span>
                    </editor-button>
                </div>


                <!-- text color -->
                <editor-button
                    :active="activeTab === 1"
                    icon="brush"
                    :color="settings.textColor"
                    :tooltip="i18n.textColorButton">
                </editor-button>

                <!-- text style (bold, italic, underlined) -->
                <div class="style-button">
                    <editor-button
                        :active="activeTab === 2"
                        icon="A"
                        type="text"
                        :tooltip="i18n.textStyleButton">
                        <span class="text-preview">{{ textStyle }}</span>
                    </editor-button>
                </div>

                <!-- text size -->
                <editor-button
                    :active="activeTab === 3"
                    icon="format_size"
                    type="text"
                    :tooltip="i18n.textSizeButton">
                    <span class="text-preview">{{ settings.textSize }}</span>
                </editor-button>

                <!-- highlight shadow -->
                <div class="halo-button">
                    <editor-button
                        :active="activeTab === 4"
                        icon="A"
                        :color="settings.textBlurColor"
                        :tooltip="i18n.textBlurButton">
                    </editor-button>
                </div>

                <!-- text angle -->
                <editor-button
                    :active="activeTab === 5"
                    icon="icon-rotate-cw"
                    type="text"
                    :tooltip="i18n.textAngleButton">
                    <span class="text-preview">{{ settings.angle }}</span>
                </editor-button>


            </v-btn-toggle>

        </v-layout>
        <v-layout row wrap align-center justify-center class="editor-content">

            <font-picker :fonts="fonts" v-model="settings.font" class="mt-2 elevation-1"
                         v-if="activeTab === 0"></font-picker>

            <color-picker v-model="textColor" v-if="activeTab === 1"></color-picker>

            <text-style-picker :styles="styles" :active.sync="settings.textStyle" class="mt-2 elevation-1"
                               v-if="activeTab === 2" :i18n="i18n"></text-style-picker>

            <text-size-picker :sizes="sizes" v-model="settings.textSize" class="mt-2 elevation-1"
                              v-if="activeTab === 3"></text-size-picker>

            <text-blur-picker :color.sync="blurColor" :radius.sync="blurRadius" v-if="activeTab === 4"
                              :i18n="i18n"></text-blur-picker>

            <text-angle-picker :angle.sync="settings.angle" :i18n="i18n" class="mt-2 elevation-1"
                               v-if="activeTab === 5"></text-angle-picker>

        </v-layout>

    </v-container>
</template>

<script>
    import {Sketch} from 'dn_vuecolor';
    import EditorButton from 'dn_sketchingenhanced-symboleditor/components/symbol/EditorButton.vue';
    import TextSizePicker from './TextSizePicker.vue';
    import TextStylePicker from './TextStylePicker.vue';
    import FontPicker from './FontPicker.vue';
    import TextBlurPicker from './TextBlurPicker.vue';
    import TextAnglePicker from './TextAnglePicker.vue';

    export default {

        components: {
            TextSizePicker,
            TextStylePicker,
            FontPicker,
            TextBlurPicker,
            TextAnglePicker,
            EditorButton,
            'color-picker': Sketch,
        },

        props: {
            i18n: {type: Object, default: () => ({})},
            settings: {type: Object, required: true},
        },

        mounted() {
            this.textColor = this.settings.textColor;
            this.blurColor = this.settings.textBlurColor;
            this.blurRadius = this.settings.textBlurRadius;
        },

        data() {
            /**
             * Data variables are only here registered as support for the GUI workflow
             */
            return {
                activeTab: 1,
                textColor: '',
                blurColor: '',
                blurRadius: null,
                styles: ['bold', 'italic'],
                fonts: ['Arial', 'Serif', 'Monospace'],
                sizes: [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72, 84, 96, 100],
            };
        },
        watch: {
            settings: {
                handler(val) {
                    this.$emit('settingsSelectionChanged', val);
                },
                deep: true,
                immediate: true,
            },
            textColor(color) {
                if (color.rgba) {
                    this.settings.textColor = color.rgba;
                }
            },
            blurColor(color) {
                if (color.rgba) {
                    this.settings.textBlurColor = color.rgba;
                }
            },
            blurRadius(radius) {
                this.settings.textBlurRadius = radius;
            },
        },
        computed: {
            textStyle() {
                const output = [];
                this.styles.forEach(x => {
                    if (this.settings.textStyle[x]) {
                        output.push(x.substr(0, 1).toUpperCase());
                    }
                });
                return output.join(', ');
            },
            font() {
                const index = (this.settings.font.indexOf(' ') !== -1) ? this.settings.font.indexOf(' ') : this.settings.font.length;
                return this.settings.font.substr(0, index);
            },
        },
    };
</script>
