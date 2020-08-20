<template>
        <v-card class="pa-2">
            <v-flex class="pa-2 unitSelectors">
                <v-combobox
                    v-show="measurements.polylineEnabled || measurements.polygonEnabled"
                    v-model="selectedLengthItem"
                    :items="units.length"
                    label="Längeneinheit"
                ></v-combobox>
                <v-combobox
                    v-show="measurements.polygonEnabled"
                    v-model="selectedAreaItem"
                    :items="units.area"
                    label="Flächeneinheit"
                ></v-combobox>
            </v-flex>

            <v-layout class="pa-0 ma-0 measurementText" column v-for="(type, index) in types">
                <v-layout class="pa-0 ma-0 flex justify-space-between" row v-for="(rule, index) in type.rules">
                    <p v-show="measurements[rule]">{{i18n.measurement[type.measure]}} {{ measurements[type.measure] }}</p>
                    <v-btn icon color="" v-show="measurements[rule]" @click="_copyTextToClipboard(measurements[type.measure])">
                        <v-icon class="icon-select-none">icon-select-none</v-icon>
                    </v-btn>
                </v-layout>
            </v-layout>
        </v-card>
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
        },
        methods: {
            _copyTextToClipboard(text){
                let el = document.createElement('textarea');
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
