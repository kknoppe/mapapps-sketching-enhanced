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
    <v-layout row>
        <v-layout column>
            <font-component v-bind:label="i18n.textEditor.textFontButton" :font.sync="font" :i18n="i18n"></font-component>
            <color-picker v-bind:label="i18n.textEditor.textColorButton" :color.sync="color" :i18n="i18n"></color-picker>
            <blur-component v-bind:label="i18n.textEditor.textStyleButton" :color.sync="blurColor" :radius.sync="blurRadius" :i18n="i18n"></blur-component>
        </v-layout>
        <v-layout column>
            <text-style-component v-bind:label="i18n.textEditor.textStyleButton" :textStyle.sync="textStyle" :i18n="i18n"></text-style-component>
            <font-size-component v-bind:label="i18n.textEditor.textSizeButton" :fontSize.sync="fontSize" :i18n="i18n"></font-size-component>
            <text-angle-component v-bind:label="i18n.textEditor.textAngleButton" :angle.sync="textAngle" :i18n="i18n"></text-angle-component>
        </v-layout>
    </v-layout>
</template>

<script>

    import i18n from 'dojo/i18n!../../nls/bundle';
    import ColorPicker from './ColorPicker.vue';
    import FontComponent from './FontComponent.vue'
    import TextStyleComponent from './TextStyleComponent.vue';
    import FontSizeComponent from './FontSizeComponent.vue';
    import BlurComponent from './BlurComponent.vue';
    import TextAngleComponent from './TextAngleComponent.vue';

    export default {
        components: {
            FontSizeComponent,
            ColorPicker,
            FontComponent,
            TextStyleComponent,
            BlurComponent,
            TextAngleComponent,
        },
        props: {
            settings: Object,
            i18n: {type: Object, default: () => i18n.ui},
        },
        computed: {
            color: {
                get() {
                    return this.settings.textColor;
                },
                set(val) {
                    if(val && val.rgba) {
                        const settings = this.settings;
                        settings.textColor = val.rgba;
                        this.$emit('update:settings', settings);
                    }
                },
            },
            blurColor: {
                get() {
                    return this.settings.textBlurColor;
                },
                set(val) {
                    if(val && val.rgba) {
                        const settings = this.settings;
                        settings.textBlurColor = val.rgba;
                        this.$emit('update:settings', settings);
                    }
                },
            },
            blurRadius: {
                get() {
                    return this.settings.textBlurRadius;
                },
                set(val) {
                    const settings = this.settings;
                    settings.textBlurRadius = val;
                    this.$emit('update:settings', settings);
                }
            },
            font: {
                get() {
                    return this.settings.font;
                },
                set(val) {
                    const settings = this.settings;
                    settings.font = val;
                    this.$emit('update:settings', settings);
                }
            },
            textStyle: {
                get() {
                    return this.settings.textStyle;
                },
                set(val) {
                    const settings = this.settings;
                    settings.textStyle = val;
                    this.$emit('update:settings', settings);
                },
            },
            fontSize: {
                get() {
                    return this.settings.textSize;
                },
                set(val) {
                    const settings = this.settings;
                    settings.textSize = val;
                    this.$emit('update:settings', settings);
                }
            },
            textAngle: {
                get() {
                    return this.settings.angle;
                },
                set(val) {
                    const settings = this.settings;
                    settings.angle = val;
                    this.$emit('update:settings', settings);
                }
            },
        },
    }


</script>
