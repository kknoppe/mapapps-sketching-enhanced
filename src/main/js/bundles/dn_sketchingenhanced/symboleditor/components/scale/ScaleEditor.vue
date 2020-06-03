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
    <editor-layout
            :label="i18n.title"
            :active.sync="enabled"
            :actionProps="{submittable, discardable: submittable, submitLabel: i18n.submit, discardLabel: i18n.discard}"
            @submit="applySettings"
            @discard="discardSettings">

        <v-range-slider
                style="margin: 64px 28px 0"
                v-model="range"
                :disabled="!enabled"
                thumb-label
                thumb-size="56"
                ticks="always"
                tick-size="1"
                :min="0"
                :max="tickCount"
                color="primary"
                track-color="grey lighten-2">
            <template v-slot:thumb-label="props">
                  <span>
                    {{ props.value >=0 && getScale(props.value).toLocaleString(locale) }}
                  </span>
            </template>
        </v-range-slider>

        <v-layout row>
            1 : {{ minVal >=0 && scales[minVal].toLocaleString(locale) }}
            <v-spacer></v-spacer>
            1 : {{ maxVal >=0 && scales[maxVal].toLocaleString(locale) }}
        </v-layout>
    </editor-layout>
</template>
<script>
    import kernel from 'dojo/_base/kernel';
    import SubmitDiscard from '../SubmitDiscard.vue';
    import EditorLayout from '../EditorLayout.vue';

    export default {
        components: {
            EditorLayout,
            SubmitDiscard,
        },

        props: {
            settings: Object,
            i18n: {type: Object, default: () => ({})},
        },

        data() {
            return {
                minVal: 0,
                maxVal: 1,
                tickCount: 0,
                enabled: false,
                locale: kernel.locale,
                scales: this._sortScales(this.settings.scales),
            };
        },

        watch: {
            settings(newSettings) {
                this.scales = this._sortScales(newSettings.scales);
                this._loadFromSettings(newSettings);
            },
            enabled(value) {
                if (!value) {
                    this.applySettings();
                }
            },
        },

        mounted() {
            this._loadFromSettings(this.settings);
        },

        computed: {
            submittable() {
                return this.minScale !== this.settings.maxScale || this.maxScale !== this.settings.minScale || !this.settings.enabled;
            },

            minScale() {
                return this.getScale(this.minVal);
            },
            maxScale() {
                return this.getScale(this.maxVal);
            },

            range: {
                get() {
                    return [this.minVal, this.maxVal];
                },
                set(value) {
                    this.minVal = value[0];
                    this.maxVal = value[1];

                    this.$emit('input', this.settings);
                },
            },
        },

        methods: {
            _sortScales(scales) {
                return scales.sort((a, b) => a - b);
            },

            getScale(index) {
                return this.scales && this.scales.length > index && this.scales[index];
            },

            applySettings() {
                this.$emit('apply', {
                    ...this.settings,
                    maxScale: this.minScale,
                    minScale: this.maxScale,
                    enabled: this.enabled,
                });
            },

            discardSettings() {
                this._loadFromSettings(this.settings);
            },

            _loadFromSettings(settings) {
                this.enabled = settings.enabled;
                this.tickCount = this.scales && (this.scales.length - 1) || 0;

                if (settings.minScale) {
                    this.maxVal = this.scales.findIndex(x => x === settings.minScale);
                } else if (settings.defaults.minScale === 0) {
                    // no limit
                    this.maxVal = this.scales.length - 1;
                } else {
                    const max = this.scales.findIndex(x => x === settings.defaults.minScale);
                    this.maxVal = max > -1 ? max : this.scales.length - 1;
                }

                if (settings.maxScale) {
                    this.minVal = this.scales.findIndex(x => x === settings.maxScale);
                } else if (settings.defaults.maxScale === 0) {
                    // no limit
                    this.minVal = 0;
                } else {
                    const min = this.scales.findIndex(x => x === settings.defaults.maxScale);
                    this.minVal = min > -1 ? min : 0;
                }
            },
        },
    };
</script>
