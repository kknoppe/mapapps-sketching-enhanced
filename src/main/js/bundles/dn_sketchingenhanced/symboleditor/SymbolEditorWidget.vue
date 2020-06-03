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
    <v-container class="visualisationEditor pa-0">

        <v-flex v-if="!model" align-center class="mt-2">
            <!-- error banner -->
            <v-alert v-if="error" :value="error" type="error" transition="scale-transition">
                {{ i18n.notStartable }}<br/>
                {{error}}
            </v-alert>
            <!-- progress spinner -->
            <v-progress-circular
                    v-else
                    :size="70"
                    :width="7"
                    color="primary"
                    indeterminate
            ></v-progress-circular>
        </v-flex>

        <template v-else>
            <v-layout row wrap align-center justify-center class="pt-2">
                <v-flex xs12 md12 align-center justify-center>
                    <v-btn-toggle v-model="btnGroup" class="grey lighten-2 elevation-3">
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-btn v-on="on" flat class="openEditorBtn">
                                    <v-icon :class="{ visualisationEdited: scaleSettings.enabled }">
                                        icon-ruler
                                    </v-icon>
                                </v-btn>
                            </template>
                            <span>{{i18n.scaleVisibilityBtnTooltip}}</span>
                        </v-tooltip>

                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                        :disabled="!labelSettings.allowed"
                                        v-on="on" flat
                                        class="openEditorBtn">
                                    <v-icon :class="{ visualisationEdited: labelSettings.enabled }">
                                        text_format
                                    </v-icon>
                                </v-btn>
                            </template>
                            <span>{{i18n.textEditorBtnTooltip}}</span>
                        </v-tooltip>

                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                        :disabled="!symbolSettings.allowed"
                                        v-on="on" flat
                                        class="openEditorBtn">
                                    <v-icon :class="{ visualisationEdited: symbolSettings.enabled }">
                                        palette
                                    </v-icon>
                                </v-btn>
                            </template>
                            <span>{{i18n.styleEditorBtnTooltip}}</span>
                        </v-tooltip>
                    </v-btn-toggle>
                </v-flex>
            </v-layout>

            <v-container class="pa-0" v-if="btnGroup === 0">
                <scale-editor
                        v-if="scaleSettings && scaleSettings.scales && scaleSettings.scales.length"
                        :i18n="i18n.scaleEditor"
                        :settings="scaleSettings"
                        @apply="applyScaling"></scale-editor>
            </v-container>

            <v-container class="pa-0" v-if="btnGroup === 1">
                <label-editor :i18n="i18n.labelEditor" :settings="labelSettings" :globalScales="defaultScales"
                              @apply="applyLabeling"></label-editor>
            </v-container>

            <v-container class="pa-0" v-if="btnGroup === 2">
                <symbol-editor
                        :i18n="i18n.symbolEditor"
                        :settings="symbolSettings"
                        @apply="applySymboling"
                        @categoryChanged="loadUniqueValues"
                        :field-error="fieldError"
                        :selected-gradient.sync="selectedGradient"
                ></symbol-editor>
            </v-container>
        </template>
    </v-container>
</template>

<script>
    import Bindable from 'apprt-vue/mixins/Bindable';
    import LabelEditor from './components/label/LabelEditor.vue';
    import ScaleEditor from './components/scale/ScaleEditor.vue';
    import SymbolEditor from './components/symbol/SymbolEditor.vue';
    import i18n from 'dojo/i18n!./nls/bundle';

    export default {
        /*name: "layer-editor",*/
        mixins: [Bindable],
        components: {
            ScaleEditor,
            LabelEditor,
            SymbolEditor,
        },

        data() {
            return {
                btnGroup: 0,
                fieldError: null,
                selectedGradient: null,
                appliedState: null,
                scaleSettings: null,
                labelSettings: null,
                symbolSettings: null,
                error: '',
                model: null,
                registry: null,
                defaultScales: [],
            };
        },

        props: {
            i18n: {type: Object, default: () => i18n.ui},
            layer: Object,
        },

        methods: {
            applyState(state) {
                this.scaleSettings = state.scaleSettings;
                this.labelSettings = state.labelSettings;
                this.symbolSettings = state.symbolSettings;

                this.btnGroup = state.activeEditor;
                return state;
            },
            applyScaling(settings) {
                this.model.applyScaling(settings);
            },
            async applyLabeling(settings) {
                await this.model.applyLabeling(settings);
            },
            async applySymboling(settings) {
                await this.model.applySymboling(settings);
            },

            async loadUniqueValues(category) {
                this.symbolSettings.categories = [];
                this.fieldError = null;

                try {
                    this.symbolSettings.categories = await this.registry.getUniqueValues({
                        id: this.appliedState.id,
                        source: this.layer.dataSourceTitle,
                    }, category);

                    this.selectedGradient = null;
                    if (category !== 'server-categories') {
                        this.$nextTick(() => {
                            this.selectedGradient = 0;
                        });
                    }
                } catch (e) {
                    // error while fetching data -> reset selection
                    this.symbolSettings.fieldForSymbology = '';

                    if (this.i18n.errors[e.message]) {
                        this.fieldError = this.i18n.errors[e.message];
                    } else {
                        this.fieldError = e.message || 'Error occurred';
                    }
                }
            },
        },

        watch: {
            btnGroup(value) {
                if (this.appliedState) {
                    this.appliedState.activeEditor = value;
                }
            },
            visualisationEdited(edited) {
                this.$emit('update:edited', edited);
            },
        },

        computed: {
            visualisationEdited() {
                if (!this.appliedState) {
                    return false;
                }
                return this.scaleSettings.enabled || this.labelSettings.enabled || this.symbolSettings.enabled;
            },
        },
    };
</script>
