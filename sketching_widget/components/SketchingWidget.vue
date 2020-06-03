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
            <v-layout row wrap>

                    <v-flex grow pa-1>
                        <v-layout row wrap>
                            <v-btn-toggle v-model="toggle">
                                <div v-for="(tool,index) in firstTools" :key="index">
                                    <menu-button v-if="tool.menu" :tool="tool" :tools="tools" @onToolClick="onToolClickHandler" :bus="eventBus"></menu-button>
                                    <tool-button v-else :tool="tool" @onToolClick="onToolClickHandler" :id="tool.id" :bus="eventBus"></tool-button>
                                </div>
                            </v-btn-toggle>
                        </v-layout>
                    </v-flex>

                    <v-flex grow pa-1></v-flex>
                    <v-flex shrink pa-1>
                        <v-layout row wrap>
                            <div v-for="(tool,index) in lastTools" :key="index">
                                <v-btn-toggle v-model="tool.id ==='sketchingtoolbox' ? toggle : notoggle">
                                    <menu-button v-if="tool.menu" :tool="tool" :tools="tools" @onToolClick="onToolClickHandler" :bus="eventBus"></menu-button>
                                    <tool-button v-else :tool="tool" @onToolClick="onToolClickHandler" :id="tool.id" :bus="eventBus"></tool-button>
                                </v-btn-toggle>
                            </div>
                        </v-layout>
                    </v-flex>

            </v-layout>
        </v-toolbar>

        <v-expand-transition>
            <div class="sketchingSymbolEditor" v-show="symbolEditorOpen">
                <!-- Symboleditor to change style before sketching-->
                <simple-text-editor v-if="settings.typeName === 'TextSetting'"
                                    @settingsSelectionChanged="onSettingsSelectionChanged"
                                    :settings="settings"
                                    :i18n="i18n.textEditor">
                </simple-text-editor>
                <simple-editor v-else
                               @settingsSelectionChanged="onSettingsSelectionChanged"
                               :settings="settings"
                               :i18n="i18n.symbolEditor">
                </simple-editor>
            </div>
        </v-expand-transition>

        <v-expand-transition>
            <v-flex v-show="constructionOn" class="construction_panel">
                <construction-panel :constructionModel="constructionModel" :i18n="i18n"></construction-panel>
            </v-flex>
        </v-expand-transition>


        <sketching-footer :i18n="i18n"
                          :toolIds="footerToolIds"
                          :tools="tools"
                          :bus="eventBus"
                          :isToolActive="isToolActive"
                          @toggleSketchingLayerVisibility="toggleVisibility"
                          @onToolClick="onToolClickHandler">
        </sketching-footer>
    </v-container>

</template>
<script>
    import Bindable from 'apprt-vue/mixins/Bindable';
    import MenuButton from './MenuButton.vue';
    import ToolButton from './ToolButton.vue';
    import SketchingFooter from './SketchingFooter.vue';
    import SimpleEditor from 'symboleditor/components/symbol/SimpleEditor.vue';
    import ConstructionPanel from './construction/ConstructionPanel.vue';
    import PointSetting from 'symboleditor/model/PointSetting';
    import LineSetting from 'symboleditor/model/LineSetting';
    import PolygonSetting from 'symboleditor/model/PolygonSetting';
    import TextSetting from '../model/TextSetting';
    import i18n from 'dojo/i18n!../nls/bundle';
    import SimpleTextEditor from './text/SimpleTextEditor.vue';

    export default {
        mixins: [Bindable],
        components: {
            'tool-button': ToolButton,
            'menu-button': MenuButton,
            'sketching-footer': SketchingFooter,
            'simple-text-editor': SimpleTextEditor,
            'simple-editor': SimpleEditor,
            'construction-panel': ConstructionPanel,
        },
        data() {
            return {
                toggle: null,
                notoggle: null,
                symbolEditorOpen: false,
                symbolSettings: new PolygonSetting(),
                constructionOn: false,
                constructionTool: null,
                currentActiveTool: null,
                eventBus: this,
            };
        },
        props: {
            i18n: {type: Object, default: () => i18n.ui},
            tools: {
                type: Array,
            },
            toolIds: {
                type: Array,
            },
            firstToolGroupIds: {
                type: Array,
            },
            lastToolGroupIds: {
                type: Array,
            },
            footerToolIds: {
                type: Array,
            },
            constructionModel: {
                type: Object, default: () => {
                    return {angleModulus: 45, planarLength: 10, use: {angleModulus: true, planarLength: false}};
                },
            },
            openEditorFromReshapeTool: {
                type: Boolean,
                required: false,
            },
            currentSymbol: {
                type: Object,
                required: false,
            },
            initialSymbolSettings: {
                type: Object,
            },
            repository: {
                type: Object,
            },
            disabled: {
                type: Array,
            },
        },
        computed: {
            firstTools() {
                return this._getOverviewTools(this.firstToolGroupIds);
            },
            lastTools() {
                return this._getOverviewTools(this.lastToolGroupIds);
            },
            settings() {
                return this.symbolSettings;
            },
            allShownIds() {
                return this.firstToolGroupIds.concat(this.lastToolGroupIds,this.footerToolIds);
            },
            isToolActive() {
                const isToolActive = this.tools.some(item => item.active);
                this.currentActiveTool = isToolActive ? this.tools.filter(item => item.active)[0] : null;
                return isToolActive;
            },
        },
        watch: {
            openEditorFromReshapeTool(val) {
                if(val) {
                    this.symbolSettings = (this.currentSymbol.type === 'text') ? new TextSetting(this.currentSymbol) : this.symbolSettings;
                }
                this.symbolEditorOpen = val;
            },
        },
        methods: {
            /**
             *  use toolId to find all tool information
             * @param toolId
             * @returns Object (tool)
             * @private
             */
            _getTool(toolId) {
                return this.tools.find(x => x.id === toolId);
            },

            /**
             * ClickHandler for all tools
             * @param tempId: Id of the clicked button tool
             */
            onToolClickHandler(tempId) {
                // use Tool Id to find the associated tool
                const tool = this._getTool(tempId);

                // set the toolbar toggle to highlight activated tool
                this._setToggle(tool);

                const id = (tool.mode === 'construction') ? tool.items[0] : tempId;
                const realTool = (tool.mode === 'construction') ? this._getTool(id) : tool;

                // emit onToolClick event only if there is no change from construction to not construction
                // of the same tool, or the other way around
                const firstCondition = !(this.constructionOn && tool.mode !== 'construction' && tool.active);
                const secondCondition = !(tool.mode === 'construction' && realTool.active);
                if( firstCondition && secondCondition) {
                    this.$emit('onToolClick',{id});
                }
                // toggle the SymbolEditor and the Construction Panel
                this._toggleSymbolEditor(tool);
                this._toggleConstruction(tool);
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

            /**
             * toggles the symbol editor on or off in the sketching widget
             * @param tool: currently clicked tool
             * @private
             */
            _toggleSymbolEditor(tool) {
                if(tool.mode === 'secondary') {
                    return;
                }
                if(this.constructionOn && tool.mode !== 'construction' && tool.active) {
                    return;
                }
                if(tool.mode === 'construction' && this.constructionTool === tool.items[0]) {
                    this.symbolEditorOpen = false;
                    this.$emit('onToolClick', {id: tool.items[0]});
                    return;
                }

                this.symbolEditorOpen = !tool.active;

                if(this.symbolEditorOpen) {
                    this._setWindowHeight('auto');
                    this._setSettings(tool);
                } else {
                    this._setWindowHeight('');
                }
            },

            /**
             * toggles the construction panel in the sketching widget due to currently clicked tool
             * @param tool: currently clicked tool
             * @private
             */
            _toggleConstruction(tool) {
                if(tool.mode === 'secondary') {
                    return;
                }
                if(tool.mode !== 'construction' || (tool.mode === 'construction' && this.constructionTool === tool.items[0])){
                    this.constructionOn = false;
                    this.constructionTool = null;
                    this.constructionModel.set('use', Object.assign({}, this.constructionModel.use, {angleModulus: false, planarLength: false}));
                    return;
                }

                this.constructionModel.set('use', Object.assign({}, this.constructionModel.use, {angleModulus: true, planarLength: false}));
                this.constructionOn = !tool.active;
                this.constructionTool = this.constructionOn ? tool.items[0] : null;
            },

            /**
             * set settings for the symbol editor
             * @param tool: currently clicked tool
             * @private
             */
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
                        this.symbolEditorOpen = false;
                        break;
                    }
                }
            },

            /**
             * emits event if symbol settings are changed
             * @param settings
             * @private
             */
            onSettingsSelectionChanged(settings) {
                this.$emit('settingsSelectionChanged', settings);
            },

            /**
             * emits event if visibilty toggle button is clicked
             * @param visible
             * @private
             */
            toggleVisibility(visible) {
                this.$emit('toggleSketchingLayerVisibility', visible);
            },

            /**
             * set toolbar toggle to show which tool is active by highlighting it
             * @param tool: currently clicked tool
             * @private
             */
            _setToggle(tool) {
                if(tool.mode === 'secondary') {
                    return;
                }
                // set toggle to highlight correct button
                if(!this.allShownIds.includes(tool.id)) {
                    const toggle = this._searchToolsForToggle(tool);
                    const noConstructionToolActivated = (!tool.active  && tool.mode !== 'construction' );
                    const noConstructionButBefore = (tool.mode !== 'construction' && this.constructionTool);
                    const constructionNotBefore = (tool.mode === 'construction' && this.constructionTool !== tool.items[0]);
                    this.toggle = (noConstructionToolActivated || noConstructionButBefore || constructionNotBefore) ? toggle : null;
                } else {
                    this.toggle = !tool.active ? tool.id : null;
                }
            },

            /**
             * search tools to find group tool
             * @param tool
             * @returns String or null
             * @private
             */
            _searchToolsForToggle(tool) {
                let toggle = null;
                this.tools.forEach(grouptool => {
                    if(grouptool.menu) {
                        toggle = grouptool.items.includes(tool.id) ? grouptool.id : toggle;
                    }
                });
                return toggle;
            },

            _setWindowHeight(height) {
                const widget = document.getElementsByClassName('sketchingWidget')[0];
                if(widget) {
                    widget.style.height = height;
                    widget.getElementsByClassName('dijitDialogPaneContent')[0].style.height = height;
                }
            },
        },
    };
</script>
