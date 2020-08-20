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
        <v-card class="pa-2">
            <v-flex class="pa-2 unitSelectors">
                <v-combobox
                    v-show="measurements.polylineEnabled"
                    v-show="measurements.polygonEnabled"
                    v-model="selectedLengthItem"
                    :items="measurements.units.length"
                    label="Längeneinheit"
                ></v-combobox>
                <v-combobox
                    v-show="measurements.polygonEnabled"
                    v-model="selectedAreaItem"
                    :items="measurements.units.area"
                    label="Flächeneinheit"
                ></v-combobox>
            </v-flex>
            <v-layout class="pa-0 ma-0 measurementText" column v-show="measurements.pointEnabled">
                <p>{{i18n.measurement.coordinates}} {{ measurements.coordinates }}</p>
            </v-layout>
            <v-layout class="pa-0 ma-0 measurementText" column v-show="measurements.polylineEnabled">
                <p>{{i18n.measurement.totalLength}} {{ measurements.totalLength }}</p>
                <p>{{i18n.measurement.currentLength}} {{ measurements.currentLength }}</p>
                <p>{{i18n.measurement.currentTotalLength}} {{ measurements.aggregateLength }}</p>
            </v-layout>
            <v-layout class="pa-0 ma-0 measurementText" column v-show="measurements.polygonEnabled">
                <p>{{i18n.measurement.currentLength}} {{ measurements.currentLength }}</p>
                <p>{{i18n.measurement.totalArea}} {{ measurements.area }}</p>
                <p>{{i18n.measurement.currentArea}} {{ measurements.currentArea }}</p>
                <p>{{i18n.measurement.perimeter}} {{ measurements.perimeter }}</p>
            </v-layout>
            <v-layout class="pa-0 ma-0 measurementText" column v-show="measurements.areaEnabled">
                <p>{{i18n.measurement.currentArea}} {{ measurements.currentArea }}</p>
                <p>{{i18n.measurement.totalArea}} {{ measurements.area }}</p>
            </v-layout>
        </v-card>
</template>

<script>
    export default {
        props: {
            i18n: {type: Object, default: () => i18n.ui},
            measurements: {
                type: Object
            },
            value: String
            // unitAbbreviation: String
        },
        computed: {
            selectedAreaItem: {
                get() {
                    return this.value
                },
                set(value) {
                    this.$emit('area-unit-input', value);
                },
            },
            selectedLengthItem: {
                get() {
                    return this.value
                },
                set(value) {
                    this.$emit('length-unit-input', value);
                },
            }
        }
    }
</script>
