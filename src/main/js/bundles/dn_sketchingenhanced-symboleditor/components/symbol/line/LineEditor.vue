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
    <v-layout row wrap align-center justify-center class="editor-content">

        <color-picker v-model="color" v-if="activeTab === 0"></color-picker>

        <line-style-picker v-model="settings.style" v-if="activeTab === 1" :i18n="i18n"></line-style-picker>

        <size-slider v-if="activeTab === 2"
                     :label="i18n.lineWeightSliderLabel"
                     :size.sync="settings.width"
                     :max="10"
                     :min="0"
                     type="line"
                     :step="1">
        </size-slider>

    </v-layout>
</template>

<script>
    import LineSetting from '../../../model/LineSetting';
    import {Chrome} from 'dn_vuecolor';
    import LineStylePicker from './LineStylePicker.vue';
    import SizeSlider from 'dn_sketchingenhanced-symboleditor/components/input/SizeSlider.vue';

    export default {
        components: {
            'color-picker': Chrome,
            'size-slider': SizeSlider,
            LineStylePicker,
        },

        props: {
            i18n: {type: Object, default: () => ({})},
            settings: {type: LineSetting, required: true},
            activeTab: Number,
        },

        data() {
            return {
                color: '',
            };
        },

        mounted() {
            this.color = this.settings.color;
        },

        watch: {
            color(color) {
                if (color.rgba) {
                    this.settings.color = color.rgba;
                }
            },
        },
    };
</script>
