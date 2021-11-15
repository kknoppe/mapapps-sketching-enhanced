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
            <color-picker v-bind:label="i18n.symbolEditor.colorPickerFillTooltip" :color.sync="color" :disable-alpha="options && options.disablePolygonAlpha"></color-picker>
            <color-picker v-bind:label="i18n.symbolEditor.colorPickerLineTooltip" :color.sync="outlineColor" :disable-alpha="options && options.disablePolygonOutlineAlpha"></color-picker>
            <size-picker v-bind:label="i18n.symbolEditor.lineWeightSliderLabel" :size.sync="size" type="line"></size-picker>
        </v-layout>
        <v-layout column style="flex: 0 0 auto!important;">
            <style-picker style="flex: inherit;" v-bind:label="i18n.symbolEditor.fillStyleSelectorTooltip" :shape.sync="shape" type="polygon" :i18n="i18n"></style-picker>
            <style-picker style="flex: inherit;" v-bind:label="i18n.symbolEditor.lineStyleSelectorTooltip" :shape.sync="lineStyle" type="line" :i18n="i18n"></style-picker>
        </v-layout>
    </v-layout>
</template>

<script>

import ColorPicker from './ColorPicker.vue';
import StylePicker from './StylePicker.vue';
import SizePicker from './SizePicker.vue';

export default {
    components: {
        ColorPicker,
        StylePicker,
        SizePicker,
    },
    props: {
        settings: Object,
        i18n: {
            type: Object,
        },
        options: Object,
    },
    computed: {
        color: {
            get() {
                return this.settings.color;
            },
            set(val) {
                if(val && val.rgba) {
                    const settings = this.settings;
                    settings.color = val.rgba;
                    this.$emit('update:settings', settings);
                }
            },
        },
        outlineColor: {
            get() {
                return this.settings.outline?.color;
            },
            set(val) {
                if(val && val.rgba && this.settings.outline) {
                    this.settings.outline.color = val.rgba;
                    this.$emit('update:settings', this.settings);
                }
            },
        },
        shape: {
            get() {
                return this.settings.style;
            },
            set(val) {
                const settings = this.settings;
                settings.style = val;
                this.$emit('update:settings', settings);
            }
        },
        lineStyle: {
            get() {
                return this.settings.outline?.style;
            },
            set(val) {
                if (this.settings.outline){
                    this.settings.outline.style = val;
                    this.$emit('update:settings', this.settings);
                }

            }
        },
        size: {
            get() {
                return this.settings.outline?.width;
            },
            set(val) {
                if (this.settings.outline){
                    this.settings.outline.width = val;
                    this.$emit('update:settings', this.settings);
                }
            }
        }
    },
}

</script>
