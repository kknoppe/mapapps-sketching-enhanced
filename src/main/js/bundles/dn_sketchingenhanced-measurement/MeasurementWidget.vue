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
        <v-layout row class="pa-0" height="100%">
            <v-card class="leftContainer">
                <v-card class="">
                    <v-switch class="pa-1 ma-0 measurementCheckboxes" color="primary"
                                v-show="measurements.polylineEnabled"
                                :label="i18n.measurement.showLineMeasurementsAtPolylines"
                                v-model="polylineMeasurementLineEnabled"
                                hide-details>
                    </v-switch>
                    <v-switch class="pa-1 ma-0 measurementCheckboxes" color="primary"
                                v-show="measurements.polygonEnabled"
                                :label="i18n.measurement.showLineMeasurementsAtPolygons"
                                v-model="polygonMeasurementLineEnabled"
                                hide-details>

                    </v-switch>
                </v-card>
                <v-flex class="unitSelectors">
                    <v-combobox
                        v-show="measurements.polylineEnabled || measurements.polygonEnabled"
                        v-model="selectedLengthItem"
                        :items="units.length"
                        :label="i18n.measurement.unitLengthSelect"
                        outlined
                        dense
                    ></v-combobox>
                    <v-combobox
                        v-show="measurements.polygonEnabled"
                        v-model="selectedAreaItem"
                        :items="units.area"
                        :label="i18n.measurement.unitAreaSelect"
                        outlined
                        dense
                    ></v-combobox>
                    <v-select
                        class="srsSelect"
                        v-show="measurements.pointEnabled"
                        v-model="selectedPointItem"
                        :items="coordinateSystems"
                        :label="i18n.measurement.coordinateSystem"
                        outlined
                        dense
                    ></v-select>
                </v-flex>
            </v-card>
            <v-divider
                class="mx-1"
                vertical
            ></v-divider>
            <v-card class="rightContainer">
                <v-layout class="pa-0 ma-0 measurementText" column v-for="(type, index) in types">
                    <v-layout class="pa-0 ma-0 flex justify-space-between" row v-for="(rule, index) in type.rules">
                        <div v-show="measurements[rule]">
                            <div class="measureLabel">
                                &nbsp&nbsp{{i18n.measurement[type.measure]}}
                            </div>
                            <div class="measureRecord">
                                {{measurements[type.measure]}}
                            </div>
                        </div>

                        <v-tooltip top>
                            <v-btn icon color=""
                                   v-show="measurements[rule]"
                                   @click="_copyTextToClipboard(measurements[type.measure])"
                                    slot="activator"
                            >
                                <v-icon class="icon-select-none">icon-select-none</v-icon>
                            </v-btn>
                            <span>{{i18n.measurement.copyToClipboard}}</span>
                        </v-tooltip>



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
                    {measure:"currentLength",rules:["polygonEnabled","polylineEnabled"]},
                    {measure:"aggregateLength",rules:["polylineEnabled"]},
                    {measure:"totalLength",rules:["polylineEnabled"]},
                    {measure:"currentArea",rules:["polygonEnabled","areaEnabled"]},
                    {measure:"perimeter",rules:["polygonEnabled"]},
                    {measure:"area",rules:["polygonEnabled","areaEnabled"]}
                ]
            }
        },
        mounted() {
            if(this.units && this.units.point && this.units.point.length) {
                this.$emit('coordinate-system-input', this.units.point[0]);
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
                    return this.measurements.showLineMeasurementsAtPolygons;
                },
                set(val) {
                    const measurements = this.measurements;
                    measurements.showLineMeasurementsAtPolygons = val;
                    this.$emit('update:measurements', measurements);
                }
            },
            polylineMeasurementLineEnabled: {
                get() {
                    return this.measurements.showLineMeasurementsAtPolylines;
                },
                set(val) {
                    const measurements = this.measurements;
                    measurements.showLineMeasurementsAtPolylines = val;
                    this.$emit('update:measurements', measurements);
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
            },
            selectedPointItem: {
                get() {
                    return this.units.point[0].systemLabel;
                },
                set(value) {
                    const system = this.units.point.filter(x => x.systemLabel === value);
                    this.$emit('coordinate-system-input', system.length ? system[0] : null);
                }
            },
            coordinateSystems() {
                const array = [];
                this.units.point.forEach(x => {
                    array.push(x.systemLabel);
                });
                return array;
            },
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
