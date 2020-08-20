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
                            <illustration v-if="item === 'Darstellung'" :settings.sync="settings" :tool="currentTool"></illustration>
                            <!--<measurement v-if="item === 'Messung'"></measurement>-->
                        </v-tab-item>
                    </template>
                </v-tabs-items>
            </v-tabs>
        </v-layout>
    </v-container>
</template>

<script>
    import Bindable from 'apprt-vue/mixins/Bindable';
    import Illustration from './components/Illustration.vue';
    import Navigation from './components/Navigation.vue';
    import PointSetting from 'dn_sketchingenhanced-symboleditor/model/PointSetting';
    import LineSetting from 'dn_sketchingenhanced-symboleditor/model/LineSetting';
    import PolygonSetting from 'dn_sketchingenhanced-symboleditor/model/PolygonSetting';
    import TextSetting from './model/TextSetting';

    export default {
        mixins: [Bindable],
        components: {
            Navigation,
            Illustration,
        },
        data() {
            return {
                symbolSettings: new PolygonSetting(),
                currentTool: null,
                tab: 0,
            }
        },
        props: {
            tools: Array,
            firstToolGroupIds: Array,
            currentSymbol: {
                type: Object,
                required: false,
            },
            initialSymbolSettings: {
                type: Object,
            },
        },
        computed: {
            tabs() {
                if(this.currentTool && this.currentTool.id === 'drawpointtool') {
                    return ['Darstellung', 'Messung'];
                }
            },
            settings: {
                get() {
                    return this.symbolSettings;
                },
                set(val) {
                    this.$emit('settingsSelectionChanged', val);
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
        },

    }
</script>
