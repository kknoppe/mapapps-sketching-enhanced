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
<div class="footer">
    <v-toolbar dense class="sketchingFooterToolbar">
        <v-tooltip top>
            <v-btn slot="activator" icon @click="toggleVisibility">
                <v-icon>{{visible ? 'icon-visibility-visible' : 'icon-visibility-disabled'}}</v-icon>
            </v-btn>
            <span>{{visible ? i18n.turnOffVisibility : i18n.turnOnVisibility}}</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <div v-for="(tool,index) in footerTools" :key="index">
                <tool-button :tool="tool" @onToolClick="onToolClickHandler" :id="tool.id"></tool-button>
        </div>
    </v-toolbar>
</div>
</template>


<script>
    import ToolButton from './ToolButton.vue';

    export default {
        components: {
            'tool-button': ToolButton,
        },
        data() {
            return {
                visible: true,
            };
        },
        mounted() {
            this.bus.$on('sketchingLayerVisibilityChanged', val => {
                this.visible = val;
            });
        },
        props: {
            i18n: {
                type: Object,
            },
            tools: {
                type: Array,
            },
            toolIds: {
                type: Array,
            },
            isToolActive: {
                type: Boolean,
            },
            bus: {
                type: Object,
            },
        },
        computed: {
            footerTools() {
                const tools = [];
                this.toolIds.forEach(id => tools.push(this._getTool(id)));
                return tools;
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
             * toggle visibility icon and emit event to toggle visibility of sketching layer
             */
            toggleVisibility() {
                this.visible = !this.visible;
                this.$emit('toggleSketchingLayerVisibility', this.visible);
            },

            /**
             * ClickHandler transfers event to parent element
             * @param id
             */
            onToolClickHandler(id) {
                this.$emit('onToolClick', id);
            },
        },

    };
</script>
