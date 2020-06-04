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

        <v-card elevation="1" color="transparent">
            <v-flex>
                <v-alert :value="mySettings.warning" type="error" transition="scale-transition"
                         class="py-1 mb-2 caption">
                    {{ i18n.layerEditingWarning }}
                </v-alert>
            </v-flex>

            <v-tabs class="editorTabs" v-model="activeTab" grow slider-color="primary">
                <v-tab key="single">{{ i18n.singleSymbolLabel }}</v-tab>
                <v-tab-item key="single">
                    <simple-editor :settings="mySettings.defaultSymbol" v-bind="{i18n}"></simple-editor>
                </v-tab-item>

                <v-tab key="category">{{ i18n.categorySelectorLabel }}</v-tab>

                <v-tab-item key="category">
                    <v-flex>
                        <v-container pa-2>
                            <v-select
                                    @change="changeCategory"
                                    :items="mySettings.fields"
                                    v-model="mySettings.fieldForSymbology"
                                    :loading="loading"
                                    :label="i18n.fieldLabel"
                                    item-value="name"
                                    item-text="alias"
                                    :no-data-text="i18n.noFieldsForSymbology"
                                    :menu-props="{'content-class': 'visualisationEditor-menu'}"
                                    :error-messages="fieldError">
                                <template v-slot:item="{ item, index }">
                                    <v-layout column class="px-3"
                                              :class="{'special-entry': item.name === 'server-categories'}">
                                        {{item.alias}}
                                    </v-layout>
                                </template>

                            </v-select>

                            <color-gradient-menu
                                    :i18n="i18n"
                                    v-model="selectedG"
                                    :disabled="!mySettings.fieldForSymbology || loading"
                                    :key="selectedG"
                                    @input="_applyGradientToItems"></color-gradient-menu>

                        </v-container>

                        <v-container grid-list-md fluid class="pa-1 uniqeValueList">
                            <v-flex v-if="mySettings.categories.length">
                                <template v-for="(uniqueValue, index) in mySettings.categories">
                                    <unique-value-widget :key="index" :settings="uniqueValue" :i18n="i18n"/>

                                    <v-divider v-if="index < mySettings.categories.length - 1"></v-divider>
                                </template>

                                <template
                                        v-if="mySettings.defaultSymbol && mySettings.defaultSymbol.defaultLabel">
                                    <v-divider></v-divider>
                                    <default-value :settings="mySettings.defaultSymbol"></default-value>
                                </template>
                            </v-flex>
                        </v-container>
                    </v-flex>
                </v-tab-item>
            </v-tabs>
        </v-card>
    </editor-layout>
</template>
<script>
    import SubmitDiscard from '../SubmitDiscard.vue';
    import EditorLayout from '../EditorLayout.vue';
    import SimpleEditor from './SimpleEditor.vue';
    import ColorGradientMenu from './ColorGradient.vue';
    import UniqueValueWidget from './UniqueValueWidget.vue';
    import DefaultValue from './DefaultValue.vue';
    import SymbolSettings from '../../SymbolSettings';
    import SymbolCategory from '../../model/SymbolCategory';

    export default {
        components: {
            EditorLayout,
            SimpleEditor,
            SubmitDiscard,
            ColorGradientMenu,
            UniqueValueWidget,
            DefaultValue,
        },

        props: {
            settings: SymbolSettings,
            i18n: {type: Object, default: () => ({})},
            fieldError: {type: String, default: null},
            selectedGradient: null,
        },

        data() {
            return {
                //lastValue: null,
                loading: false,
                mySettings: null,
                enabled: false,
                dirty: false,
            };
        },

        mounted() {
            this._loadFromSettings(this.settings);
        },

        watch: {
            mySettings: {
                handler() {
                    this.dirty = true;
                }, deep: true,
            },
            enabled(value) {
                if (!value) {
                    this.applySettings();
                }
            },

            settings(value) {
                this._loadFromSettings(value);
            },
            'settings.enabled'(value) {
                if (!value) {
                    // deactivate custom settings
                    this.applySettings();
                }
            },

            'settings.categories'(categories) {
                if (categories && categories.length > 0) {
                    this.loading = false;

                    this.mySettings.categories = categories.map(x => new SymbolCategory(x));
                }
            },
            'settings.fieldForSymbology'(selectedField) {
                if (!selectedField) {
                    this.loading = false;
                }
            },
            selectedGradient(gradient) {
                this._applyGradientToItems(gradient);
            },
        },

        created() {
            this._loadFromSettings(this.settings);
        },

        computed: {
            selectedG: {
                get() {
                    return this.selectedGradient;
                },

                set(selectedG) {
                    this.$emit('update:selectedGradient', selectedG);
                },
            },
            activeTab: {
                get() {
                    return this.mySettings.type === 'single' ? 0 : 1;
                },
                set(val) {
                    this.mySettings.type = val === 0 ? 'single' : 'category';
                },
            },

            submittable() {
                return this.dirty || !this.settings.enabled;
            },
        },

        methods: {
            _loadFromSettings(settings) {
                this.enabled = settings.enabled;
                this.mySettings = new SymbolSettings(settings);
                this.$nextTick(() => (this.dirty = false));
            },
            _applyGradientToItems(gradient) {
                if (gradient !== null) {
                    this._changeColorGradient(gradient);
                }
            },

            applySettings() {
                this.$emit('apply', Object.assign(this.mySettings, {enabled: this.enabled}));
                this.$nextTick(() => this.dirty = false);
            },

            discardSettings() {
                this.mySettings = new SymbolSettings(this.settings);
                this.$nextTick(() => (this.dirty = false));
            },

            changeCategory(category) {
                this.loading = true;
                this.$emit('categoryChanged', category);
            },

            /**
             * Listen the color-gradient selection event, call the interpolation function to calculate the new range's colors and assign to every unique value a new color.
             * @param colorGradient
             */
            _changeColorGradient() {
                const categories = this.mySettings.categories.concat([{symbol: this.mySettings.defaultSymbol}]);
                categories.map((uniqueValueWidget, i) => {
                    const rgb = this._interpolateGradientColors(categories.length, i);
                    Object.assign(uniqueValueWidget.symbol.color, {...rgb, a: 1});
                });
            },

            /**
             * Interpolation of RGB colors to find out which colour assign to the specified index (count)
             * @param steps
             * @param count
             * @returns {{r: *, b: *, g: *}}
             * @private
             */
            _interpolateGradientColors(steps, count) {
                let endRGB;
                const startRGB = {r: 0, g: 128, b: 0,};
                // Starting colours is always green, while the last colours of the gradient depends on the selected gradient.
                // If selectedGradient is 0, the color gradient is green-red, otherwise is green-yellow.
                if (this.selectedGradient === 0) {
                    endRGB = {r: 255, g: 0, b: 0,};
                } else {
                    endRGB = {r: 255, g: 255, b: 0,};
                }
                const r = this._interpolate(startRGB.r, endRGB.r, steps, count);
                const g = this._interpolate(startRGB.g, endRGB.g, steps, count);
                const b = this._interpolate(startRGB.b, endRGB.b, steps, count);
                return {r, g, b,};
            },

            /**
             * Interpolate RGB gradient colours with a predefined number of steps
             * @param start
             * @param end
             * @param steps
             * @param count
             * @returns {number}
             * @private
             */
            _interpolate(start, end, steps, count) {
                const final = start + (((end - start) / steps) * count);
                return Math.floor(final);
            },
        },
    };
</script>
