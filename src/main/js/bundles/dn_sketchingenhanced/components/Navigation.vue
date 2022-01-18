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
                <v-list-tile v-if="!tool.menu" @click="_onNonGroupToolClick(tool)" :id="tool.id" :value="tool.active">
                    <v-list-tile-action>
                        <v-icon>{{tool.iconClass}}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-title>{{tool.title}}</v-list-tile-title>
                </v-list-tile>
                <v-list-group v-if="tool.menu"
                              no-action>
                    <template v-slot:activator>
                        <v-list-tile :id="tool.id"  :value="listToolsActive(tool)">
                            <v-list-tile-action>
                                <v-icon>{{tool.iconClass}}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-title>{{tool.title}}</v-list-tile-title>
                        </v-list-tile>
                    </template>
                    <v-list-tile v-for="subTool in listTools(tool)" @click="subToolClickHandler(subTool, tool.id)" :id="subTool.id" :value="subTool.active">
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
                if (toolIds) {
                    toolIds.forEach(id => {
                        const tool = this._getTool(id);
                        if (tool) {
                            tools.push(tool);
                        }
                    });
                }
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
            listToolsActive(tool) {
                const items = tool.items;
                const found = items.find((id)=>{
                    const newTool = this._getTool(id);
                    return newTool.active;
                });
                return !!found;
            },
            subToolClickHandler(tool, parentId) {
                this.$emit('onToolClick', tool.id);
                const parentIcon = document.getElementById(parentId);
                if(parentIcon && parentIcon.children.length && parentIcon.children[0].children.length) {
                    const classList = parentIcon.children[0].children[0].classList;
                    const oldVal = classList[2];
                    classList.replace(oldVal, tool.iconClass);
                }
            },

            _onNonGroupToolClick(tool){
                this.$emit('onToolClick', tool.id);
            },
        },
    }
</script>
