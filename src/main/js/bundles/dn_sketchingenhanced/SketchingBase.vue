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
    <v-container class="sketchingMainContainer" pa-0>
        <v-toolbar dense pa-0 class="SketchingToolsBar">
            <top-toolbar height="50" absolute :tools="headerTools" @onToolClick="onToolClickHandler"></top-toolbar>
            <v-flex shrink pa-1>
                <v-layout row wrap>
                    <div v-for="(tool,index) in lastTools" :key="index">
                            <menu-button v-if="tool.menu" :tool="tool" :tools="tools"
                                         @onToolClick="onToolClickHandler" :bus="eventBus"></menu-button>
                            <tool-button v-else :tool="tool" @onToolClick="onToolClickHandler" :id="tool.id"
                                         :bus="eventBus"></tool-button>
                    </div>
                </v-layout>
            </v-flex>
        </v-toolbar>
        <v-divider
            class="mx-1"
        ></v-divider>
        <v-layout class="sketchingCenterContainer" height="100%" row>
            <navigation class="navigationContainer" @onToolClick="onToolClickHandler" :tools="tools" :firstToolGroupIds="firstToolGroupIds" :bus="eventBus"></navigation>
            <v-tabs class="flex grow tabsContainer" v-model="tab" slider-color="primary" grow>
                <v-tab v-for="item in tabs">
                    {{item}}
                </v-tab>
                <v-tabs-items>
                    <template v-for="(item, index) in tabs">
                        <v-tab-item :key="index">
                            <illustration class="flex grow pa-2" v-if="item === 'Darstellung'" :settings.sync="settings" :tool="currentTool"></illustration>
                            <v-flex class="measurementToolsTab justify-space-between align-stretch" pa-1 v-if="item === 'Messung'" grow>
                                <v-flex v-show="measurementEnabled">
                                    <measurement :measurements.sync="measurements"
                                                 :units="units"
                                                 :i18n="i18n"
                                                 @length-unit-input="_setLengthUnits"
                                                 @area-unit-input="_setAreaUnits"
                                                 @coordinate-system-input="$emit('coordinate-system-input', $event)"
                                    ></measurement>
                                </v-flex>
                                <v-divider
                                    class="mx-4"
                                ></v-divider>
                                <measurement-toggle v-if="measurement" :measurementBoolean.sync="enableMeasurement" :showKeepMeasurements="showKeepMeasurements" :multiMeasurement.sync="multiMeasurement" :i18n="i18n"
                                                    :bus="eventBus"></measurement-toggle>
                            </v-flex>
                            <construction-panel class="flex grow pa-2" v-if="item === 'Konstruktion'" :constructionModel="constructionModel" :i18n="i18n"></construction-panel>
                            <settings-panel class="flex grow pa-2"
                                            v-if="item === 'Einstellungen'"
                                            @toggleSketchingLayerVisibility="$emit('toggleSketchingLayerVisibility', $event)"
                                            :bus="eventBus"
                                            :multiMeasurement.sync="multiMeasurement"
                                            :i18n="i18n">
                            </settings-panel>
                        </v-tab-item>
                    </template>
                </v-tabs-items>
            </v-tabs>
        </v-layout>
        <v-footer class="sketchingFooter" absolute>
            <v-toolbar class="sketchingFooterToolbar">
                <v-btn @click="showSettings">
                    <v-icon>icon-cog</v-icon>
                    <span class="pl-2">Einstellungen</span>
                </v-btn>
            </v-toolbar>
        </v-footer>
    </v-container>
</template>

<script>
    import Bindable from 'apprt-vue/mixins/Bindable';
    import i18n from 'dojo/i18n!./nls/bundle';
    import TopToolbar from './components/TopToolbar.vue';
    import Illustration from './components/Illustration.vue';
    import MeasurementWidget from '../dn_sketchingenhanced-measurement/MeasurementWidget.vue'
    import MeasurementFooter from '../dn_sketchingenhanced-measurement/MeasurementFooter.vue';
    import Navigation from './components/Navigation.vue';
    import ConstructionPanel from './components/construction/ConstructionPanel.vue';
    import PointSetting from 'dn_sketchingenhanced-symboleditor/model/PointSetting';
    import LineSetting from 'dn_sketchingenhanced-symboleditor/model/LineSetting';
    import PolygonSetting from 'dn_sketchingenhanced-symboleditor/model/PolygonSetting';
    import TextSetting from './model/TextSetting';
    import MenuButton from './components/MenuButton.vue';
    import ToolButton from './components/ToolButton.vue';
    import SketchingFooter from './components/SketchingFooter.vue'
    import SettingsPanel from './components/SettingsPanel.vue';

    export default {
        mixins: [Bindable],
        components: {
            Navigation,
            Illustration,
            ConstructionPanel,
            TopToolbar,
            SettingsPanel,
            'measurement': MeasurementWidget,
            'measurement-toggle': MeasurementFooter,
            'tool-button': ToolButton,
            'menu-button': MenuButton,
            'sketching-footer' : SketchingFooter
        },
        data() {
            return {
                toggle: null,
                notoggle: null,
                symbolSettings: new PolygonSetting(),
                currentTool: null,
                tab: 0,
                settingsEnabled: false,
                eventBus: this,
                elements: [],

                measurementEnabled: this.measurementBoolean,
                showLineMeasurementsAtPolylines: false,
                showLineMeasurementsAtPolygons: false,
                showKeepMeasurements: true,
                multiMeasurement: true,

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
                areaEnabled: false,
                units: {}
            }
        },
        props: {
            i18n: {type: Object, default: () => i18n.ui},
            tools: Array,
            firstToolGroupIds: Array,
            headerToolIds: Array,
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
            lastToolGroupIds: {
                type: Array,
            },
            measurement: {
                type: Boolean,
            },
            measurementBoolean: {
                type: Boolean,
            }
        },
        computed: {
            tabs() {
                this.tab = 0;
                if(this.settingsEnabled) {
                    return ['Einstellungen'];
                }
                if(this.currentTool) {
                    switch(this.currentTool.id){
                        case 'drawtexttool':
                        case 'drawfreehandpolygontool':
                        case 'drawfreehandpolylinetool':
                        case 'drawarrowtool':
                        case 'drawellipsetool':
                        case 'drawcircletool':
                            return ['Darstellung'];
                        case 'drawpolygontool':
                        case 'drawpolylinetool':
                            return ['Darstellung', 'Messung', 'Konstruktion'];
                        case 'drawreshape1tool':
                        case 'drawcopytool':
                        case 'drawremovetool':
                            this.tab = null;
                            return [''];
                        default:
                            return ['Darstellung', 'Messung'];
                    }
                } else {
                    return [''];
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
            headerTools() {
                const tools = [];
                this.headerToolIds.forEach(id => tools.push(this._getTool(id)));
                return tools;
            },
            lastTools() {
                return this._getOverviewTools(this.lastToolGroupIds);
            },
            measurements: {
                get() {
                    return {
                        showLineMeasurementsAtPolylines: this.showLineMeasurementsAtPolylines,
                        showLineMeasurementsAtPolygons: this.showLineMeasurementsAtPolygons,
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
                        areaEnabled: this.areaEnabled
                    }
                },
                set(measurement) {
                    this.showLineMeasurementsAtPolylines = measurement.showLineMeasurementsAtPolylines;
                    this.showLineMeasurementsAtPolygons =  measurement.showLineMeasurementsAtPolygons;
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
            /**
             * creates an array with all tools of an input array where only the ids are listed
             * @param toolIds: Array of Ids
             * @returns Array
             * @private
             */
            _getOverviewTools(toolIds) {
                const tools = [];
                toolIds.forEach(id => tools.push(this._getTool(id)));
                return tools;
            },
            onToolClickHandler(id) {
                this.settingsEnabled = false;
                // use Tool Id to find the associated tool
                const tool = this._getTool(id);

                if(tool.mode !== 'secondary') {
                    this.currentTool = tool;
                    this._setSettings(tool);
                    this._setToggle(tool.id);
                }

                if(tool.active) {
                   this.currentTool = null;
                   this._setToggle(id, true);
                }
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
            },
            _setToggle(id, unset) {
                const el = document.getElementById(id);
                this.elements.forEach(e => e.style.backgroundColor = '');
                if(el) {
                    if(unset) {
                        el.style.backgroundColor = '';
                        return;
                    }
                    this.elements.push(el);
                    el.style.backgroundColor = 'highlight';
                }
            },
            showSettings() {
                this.settingsEnabled = true;
                this._setToggle(null);
                this.currentTool && this.$emit('onToolClick', {id: this.currentTool.id})
            }
        },

    }
</script>
