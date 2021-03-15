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
    <v-navigation-drawer
        stateless
        :value="true"
        class="sketchingToolsNavigation"
    >
        <v-list>
            <div v-for="tool in firstTools">
                <v-list-tile v-if="!tool.menu" @click="_onNonGroupToolClick(tool)" :id="tool.id">
                    <v-list-tile-action>
                        <v-icon>{{tool.iconClass}}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>{{tool.title}}</v-list-tile-title>
                </v-list-tile>
                <v-list-group v-if="tool.menu"
                              no-action
                              @transitionend="transitionEnd($event,tool)">
                    <template v-slot:activator>
                        <v-list-tile :id="tool.id">
                            <v-list-tile-action>
                                <v-icon>{{tool.iconClass}}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-title>{{tool.title}}</v-list-tile-title>
                        </v-list-tile>
                    </template>
                    <v-list-tile v-for="subTool in listTools(tool)" @click="subToolClickHandler(subTool, tool.id)" :id="subTool.id">
                        <v-list-tile-action>
                            <v-icon>{{subTool.iconClass}}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-title >{{subTool.title}}</v-list-tile-title>
                    </v-list-tile>
                </v-list-group>
            </div>
        </v-list>
    </v-navigation-drawer>
</template>


<script>


    export default {
        data() {
            return {
                activeNodes: []
            }
        },
        props: {
            tools: Array,
            firstToolGroupIds: Array,
            bus: Object,
        },
        computed: {
            firstTools() {
                return this._getOverviewTools(this.firstToolGroupIds);
            },
        },
        methods: {
            _getTool(toolId) {
                return this.tools.find(x => x.id === toolId);
            },
            _getOverviewTools(toolIds) {
                const tools = [];
                toolIds.forEach(id => tools.push(this._getTool(id)));
                return tools;
            },
            listTools(tool) {
                const list = [];
                const items = tool.items;
                if (items) {
                    items.forEach(id => {
                        const newTool = this._getTool(id);
                        newTool && list.push(newTool);
                    });
                }
                return list;
            },
            subToolClickHandler(tool, parentId) {
                this.$emit('onToolClick', tool.id);
                this._deactivateOtherTools();
                const toolIcon = document.getElementById(tool.id);
                const childToolNode = toolIcon ? toolIcon.parentElement : null;
                const toolGroupNode = tool.toolGroup ? document.getElementById(tool.toolGroup).parentElement.parentElement : null;
                if (!tool.active && childToolNode && !childToolNode.classList.contains('highlightedTool')){
                    this.activeNodes.push(childToolNode);
                    childToolNode.classList.add('highlightedTool');
                    if (toolGroupNode) {
                        this.activeNodes.push(toolGroupNode);
                        toolGroupNode.classList.add('highlightedToolParent');
                    }
                } else {
                    childToolNode.classList.remove('highlightedTool');
                    toolGroupNode && toolGroupNode.classList.remove('highlightedToolParent');
                }
                const parentIcon = document.getElementById(parentId);
                if(parentIcon && parentIcon.children.length && parentIcon.children[0].children.length) {
                    const classList = parentIcon.children[0].children[0].classList;
                    const oldVal = classList[2];
                    classList.replace(oldVal, tool.iconClass);
                }
            },

            transitionEnd(evt,tool){
                const subTools = this.listTools(tool);
                if (evt.propertyName === 'transform') {
                    const node = evt.target.parentElement.parentElement;
                    const hasActiveTool = subTools.some(tool => tool.active === true);
                    if (hasActiveTool) {
                        this.activeNodes.push(node);
                        node.classList.add('highlightedToolParent');
                    }
                }
            },

            _onNonGroupToolClick(tool){
                this.$emit('onToolClick', tool.id);
                this._deactivateOtherTools();
                const toolIcon = document.getElementById(tool.id);
                const childToolNode = toolIcon ? toolIcon.parentElement : null;
                if (!tool.active && childToolNode && !childToolNode.classList.contains('highlightedTool')){
                    childToolNode.classList.add('highlightedTool');
                } else {
                    childToolNode.classList.remove('highlightedTool');
                }
            },

            _deactivateOtherTools(){
                if (this.activeNodes && this.activeNodes.length) {
                    this.activeNodes.forEach(node => {
                        node.classList.remove('highlightedTool');
                        node.classList.remove('highlightedToolParent');
                    });
                    this.activeNodes = [];
                }
                this.tools.forEach(tool => {
                    const toolIcon = document.getElementById(tool.id);
                    const childToolNode = toolIcon ? toolIcon.parentElement : null;
                    toolIcon && childToolNode.classList.remove('highlightedTool');
                });
            }
        },
    }
</script>
