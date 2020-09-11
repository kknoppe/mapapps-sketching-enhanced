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
    <v-menu
        :disabled="!tool.enabled"
        v-model="menu"
        :close-on-content-click="true"
        offset-y
    >
        <tool-button slot="activator" :tool="tool" :id="tool.id" :active="active" :bus="bus" :tooltipIfDisabled="!tool.enabled ? 'Es liegen keine Zeichnungen vor' : null"></tool-button>
        <v-card>
            <v-list class="sketchingMenu">
                <div v-for="item in listTools(tool)">
                    <menu-tiles @onToolClick="onToolClickHandler"
                                :tool="item"
                                :bus="bus"
                    ></menu-tiles>
                </div>
            </v-list>

        </v-card>
    </v-menu>

</template>


<script>
    import ToolButton from './ToolButton.vue';
    import MenuTiles from './MenuTiles.vue';

    export default {
        components: {
            'tool-button': ToolButton,
            'menu-tiles': MenuTiles,
        },
        data() {
            return {
                menu: false,
            };
        },
        computed: {
            active() {
                return this.listTools(this.tool).some(item => item.active);
            },
        },
        props: {
            tool: {
                type: Object,
            },
            tools: {
                type: Array,
            },
            bus: {
                type: Object,
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
             * returns the list of tools with all tool information for the given menu tool
             * @param tool
             * @returns Array
             */
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

            /**
             * ClickHandler transfers event to parent element and change menu icon
             * @param id
             */
            onToolClickHandler(id) {
                // emit event
                this.$emit('onToolClick', id);
            }
        },

    };
</script>
