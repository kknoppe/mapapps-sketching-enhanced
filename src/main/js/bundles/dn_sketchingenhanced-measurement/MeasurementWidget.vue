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
        <v-layout row class="pa-0">
            <v-card class="leftContainer">
                <v-card class="">
                    <v-checkbox class="pa-0 ma-0 measurementCheckboxes" color="primary"
                                v-show="measurements.polylineEnabled"
                                :label="i18n.measurement.showLineMeasurementsAtPolylines"
                                v-model="polylineMeasurementLineEnabled"
                                hide-details>
                    </v-checkbox>
                    <v-checkbox class="pa-0 ma-0 measurementCheckboxes" color="primary"
                                v-show="measurements.polygonEnabled"
                                :label="i18n.measurement.showLineMeasurementsAtPolygons"
                                v-model="polygonMeasurementLineEnabled"
                                hide-details>

                    </v-checkbox>
                </v-card>
                <v-flex class="unitSelectors">
                    <v-combobox
                        v-show="measurements.polylineEnabled || measurements.polygonEnabled"
                        v-model="selectedLengthItem"
                        :items="units.length"
                        label="Längeneinheit"
                        outlined
                        dense
                    ></v-combobox>
                    <v-combobox
                        v-show="measurements.polygonEnabled"
                        v-model="selectedAreaItem"
                        :items="units.area"
                        label="Flächeneinheit"
                        outlined
                        dense
                    ></v-combobox>
                </v-flex>
            </v-card>
            <v-divider
                class="mx-4"
                vertical
            ></v-divider>
            <v-card class="rightContainer">
                <v-layout class="pa-0 ma-0 measurementText" column v-for="(type, index) in types">
                    <v-layout class="pa-0 ma-0 flex justify-space-between" row v-for="(rule, index) in type.rules">
                        <p v-show="measurements[rule]">
                            <span class="measureLabel">
                                &nbsp&nbsp{{i18n.measurement[type.measure]}}
                            </span>
                            <span class="measureRecord">
                                {{measurements[type.measure]}}
                            </span>
                        </p>
                        <v-btn icon color="" v-show="measurements[rule]" @click="_copyTextToClipboard(measurements[type.measure])">
                            <v-icon class="icon-select-none">icon-select-none</v-icon>
                        </v-btn>
                    </v-layout>
                </v-layout>
            </v-card>
        </v-layout>
</template>
<script>
    export default {
        data(){
            return {
                types: [
                    {measure:"coordinates",rules:["pointEnabled"]},
                    {measure:"totalLength",rules:["polylineEnabled"]},
                    {measure:"currentLength",rules:["polygonEnabled","polylineEnabled"]},
                    {measure:"aggregateLength",rules:["polylineEnabled"]},
                    {measure:"area",rules:["polygonEnabled","areaEnabled"]},
                    {measure:"currentArea",rules:["polygonEnabled","areaEnabled"]},
                    {measure:"perimeter",rules:["polygonEnabled"]}
                ]
            }
        },
        props: {
            i18n: {type: Object, default: () => i18n.ui},
            measurements: {
                type: Object
            },
            units: {
                type: Object
            },
            value: String
        },
        computed: {
            polygonMeasurementLineEnabled: {
                get() {
                    return this.showLineMeasurementsAtPolygons;
                },
                set(val) {
                    this.$emit('update:showLineMeasurementsAtPolygons', val)
                }
            },
            polylineMeasurementLineEnabled: {
                get() {
                    return this.showLineMeasurementsAtPolylines;
                },
                set(val) {
                    this.$emit('update:showLineMeasurementsAtPolylines', val)
                }
            },
            selectedAreaItem: {
                get() {
                    return this.value || 'auto'
                },
                set(value) {
                    this.$emit('area-unit-input', value);
                },
            },
            selectedLengthItem: {
                get() {
                    return this.value || 'auto'
                },
                set(value) {
                    this.$emit('length-unit-input', value);
                },
            }
        },
        methods: {
            _copyTextToClipboard(text){
                const el = document.createElement('textarea');
                el.value = text;
                el.setAttribute('readonly', '');
                el.style = {display: 'none'};
                document.body.appendChild(el);
                el.select();
                document.execCommand("copy");
                document.body.removeChild(el);
            }
        }
    }
</script>
