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
    <v-container class="fullwidthAndHeight" pa-0>
        <v-toolbar dense pa-0 class="SketchingToolsBar">
        </v-toolbar>

        <v-layout row>
            <navigation @onToolClick="onToolClickHandler" :tools="tools" :firstToolGroupIds="firstToolGroupIds"></navigation>
            <v-tabs v-model="tab" slider-color="primary">
                <v-tab v-for="item in tabs">
                    {{item}}
                </v-tab>
                <v-tabs-items>
                    <template v-for="(item, index) in tabs">
                        <v-tab-item :key="index">
                            <illustration class="flex grow pa-2" v-if="item === 'Darstellung'" :settings.sync="settings" :tool="currentTool"></illustration>
                            <v-flex grow pa-1 v-if="item === 'Messung'">
                                <measurement-toggle v-if="measurement" :measurementBoolean.sync="enableMeasurement" :showKeepMeasurements="showKeepMeasurements" :i18n="i18n"
                                                    :bus="eventBus"></measurement-toggle>
                                <v-flex v-show="measurementEnabled">
                                    <measurement :measurements="measurements"
                                                 :i18n="i18n"
                                                 @length-unit-input="_setLengthUnits"
                                                 @area-unit-input="_setAreaUnits"
                                    ></measurement>
                                </v-flex>
                            </v-flex>
                            <construction-panel class="flex grow pa-2" v-if="item === 'Konstruktion'" :constructionModel="constructionModel" :i18n="i18n"></construction-panel>
                        </v-tab-item>
                    </template>
                </v-tabs-items>
            </v-tabs>
        </v-layout>
    </v-container>
</template>

<script>
    import Bindable from 'apprt-vue/mixins/Bindable';
    import i18n from 'dojo/i18n!./nls/bundle';
    import Illustration from './components/Illustration.vue';
    import MeasurementWidget from '../dn_sketchingenhanced-measurement/MeasurementWidget.vue'
    import MeasurementFooter from '../dn_sketchingenhanced-measurement/MeasurementFooter.vue';
    import Navigation from './components/Navigation.vue';
    import ConstructionPanel from './components/construction/ConstructionPanel.vue';
    import PointSetting from 'dn_sketchingenhanced-symboleditor/model/PointSetting';
    import LineSetting from 'dn_sketchingenhanced-symboleditor/model/LineSetting';
    import PolygonSetting from 'dn_sketchingenhanced-symboleditor/model/PolygonSetting';
    import TextSetting from './model/TextSetting';

    export default {
        mixins: [Bindable],
        components: {
            Navigation,
            Illustration,
            ConstructionPanel,
            'measurement': MeasurementWidget,
            'measurement-toggle': MeasurementFooter
        },
        data() {
            return {
                symbolSettings: new PolygonSetting(),
                currentTool: null,
                tab: 0,
                eventBus: this,

                measurementEnabled: this.measurementBoolean,
                showLineMeasurementsAtPolylines: false,
                showLineMeasurementsAtPolygons: false,
                showKeepMeasurements: true,

                coordinates: null,
                currentLength: null,
                aggregateLength: null,
                totalLength: null,
                area: null,
                currentArea: null,
                perimeter: null,

                pointEnabled: false,
                polylineEnabled: false,
                polygonEnabled: false,
                areaEnabled: false
            }
        },
        props: {
            i18n: {type: Object, default: () => i18n.ui},
            tools: Array,
            firstToolGroupIds: Array,
            currentSymbol: {
                type: Object,
                required: false,
            },
            initialSymbolSettings: {
                type: Object,
            },
            constructionModel: {
                type: Object, default: () => {
                    return {angleModulus: 45, planarLength: 10, use: {angleModulus: false, planarLength: false}};
                },
            },
            measurementBoolean: {
                type: Boolean,
            }
        },
        computed: {
            tabs() {
                if(this.currentTool) {
                    switch(this.currentTool.id){
                        case 'drawtexttool':
                            return ['Darstellung'];
                        case 'drawpolygontool':
                        case 'drawpolylinetool':
                            return ['Darstellung', 'Messung', 'Konstruktion'];
                        default:
                            return ['Darstellung', 'Messung'];
                    }
                }
            },
            settings: {
                get() {
                    return this.symbolSettings;
                },
                set(val) {
                    this.$emit('settingsSelectionChanged', val);
                }
            },
            measurements(){
                return {
                    showKeepMeasurements: this.showKeepMeasurements,
                    coordinates: this.coordinates,
                    currentLength: this.currentLength,
                    aggregateLength: this.aggregateLength,
                    totalLength: this.totalLength,
                    area: this.area,
                    currentArea: this.currentArea,
                    perimeter: this.perimeter,

                    pointEnabled: this.pointEnabled,
                    polylineEnabled: this.polylineEnabled,
                    polygonEnabled: this.polygonEnabled,
                    areaEnabled: this.areaEnabled,
                    units: {
                        area: ["auto","Quadratmeter","Hektar","Quadratkilometer"],
                        length: ["auto","Meter","Kilometer"]
                    }
                }
            },
            enableMeasurement: {
                get() {
                    return this.measurementBoolean;
                },
                set(value) {
                    this.measurementEnabled = value;
                    this.$emit('measurementStatusChanged', value);
                }
            }
        },
        methods: {
            _getTool(toolId) {
                return this.tools.find(x => x.id === toolId);
            },
            onToolClickHandler(id) {
                // use Tool Id to find the associated tool
                this.currentTool = this._getTool(id);
                this._setSettings(this.currentTool);
                this.$emit('onToolClick', {id});
            },
            _setSettings(tool) {
                const type = tool.type;
                switch (type) {
                    case 'point': {
                        this.symbolSettings = new PointSetting(this.initialSymbolSettings ? this.initialSymbolSettings.pointSymbol : '');
                        this.symbolSettings.maxPointSize = 100;
                        break;
                    }
                    case 'polyline': {
                        this.symbolSettings = new LineSetting(this.initialSymbolSettings ? this.initialSymbolSettings.polylineSymbol : '');
                        break;
                    }
                    case 'text': {
                        this.symbolSettings = new TextSetting(this.initialSymbolSettings ? this.initialSymbolSettings.textSymbol : '');
                        break;
                    }
                    case 'polygon':
                    case 'rectangle':
                    case 'circle':
                    case 'triangle':
                    case 'ellipse':
                    case 'arrow': {
                        // TODO: new tools with fill pattern must be added here
                        this.symbolSettings = new PolygonSetting(this.initialSymbolSettings ? this.initialSymbolSettings.polygonSymbol : '');
                        break;
                    }
                    default: {
                        break;
                    }
                }
            },
            _setLengthUnits(unit){
                this.$emit('length-unit-input', unit);
            },
            _setAreaUnits(unit){
                this.$emit('area-unit-input', unit);
            }
        },

    }
</script>
