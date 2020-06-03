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
    <div>
        <v-slider
                :label="sliderLabel"
                v-model="transparency"
                :max="max"
                :step="step"
                hide-details
                @input="onChange"
                v-bind:style="{marginTop: '5px', marginBottom: '5px'}">
        </v-slider>
    </div>
</template>
<script>
    import i18n from 'dojo/i18n!../nls/bundle';

    export default {
        props: {
            layerOpacity: {
                type: Number,
                required: true,
            },
            i18n: {
                type: Object,
                // default i18n
                default: () => i18n.ui.control.transparencySlider,
            },
            maxTransparency: {
                type: Number,
                required: false,
            },
        },
        data() {
            return {
                // calculate corresponding transparency
                transparency: 100 - this.layerOpacity * 100,
                // set maximum transparency or use default of 100
                max: this.maxTransparency ? this.maxTransparency : 100,
                // set slider step
                step: 1,
            };
        },
        computed: {
            sliderLabel() {
                const output = Math.round(this.transparency) < 10 ? ' \u00A0\u00A0 ' + Math.round(this.transparency) : Math.round(this.transparency);
                return  `${this.i18n.transparency}: ${output}%`;
            },
        },
        methods: {
            onChange(value) {
                // calculate corresponding opacity and trigger as output
                const opacity = value / -100 + 1;
                this.$emit('opacity-changed', opacity);
            },
        },
        watch: {
            layerOpacity() {
                 this.transparency = 100 - this.layerOpacity * 100;
            },
        },
    };
</script>
