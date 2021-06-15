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
    <v-tooltip top>
        <template v-slot:activator="{on}">
            <div v-on="on">
                <v-btn flat
                       icon
                       class="sketchingToolButton"
                       :key="tool.id"
                       :value="tool.id"
                       :disabled="toolDisabled(tool)"
                       @click="onToolClickHandler(tool.id)"
                >
                    <v-icon>{{tool.iconClass}}</v-icon>
                </v-btn>
            </div>
            <!--<v-icon class="iconMenuArrowDown"
                    :style="{visibility: toolActive ? 'visible' : 'hidden'}"
                    style="height:12px">
                arrow_drop_down
            </v-icon>-->
        </template>
        <span>{{tooltipIfDisabled ? tooltipIfDisabled : tool.title}}</span>
    </v-tooltip>
</template>


<script>

export default {
    data() {
        return {
            profileLoaded: false,
        };
    },
    props: {
        tool: {
            type: Object,
        },
        active: {
            type: Boolean,
            required: false,
        },
        bus: {
            type: Object,
            required: false,
        },
        tooltipIfDisabled: {
            type: String,
        },
        hasGraphicsOnLoad: {
            type: Boolean,
            required: false,
        }
    },
    mounted() {
        if (this.bus) {
            this.bus.$on('startRecording', () => {
                this.profileLoaded = true;
            });
            this.bus.$on('stopRecording', () => {
                this.profileLoaded = false;
            });
        }
    },
    computed: {
        notActiveTool() {
            if (this.tool.id !== 'sketchingtoolbox' && this.toolActive && this.tool.menu) {
                this.$parent.$parent._changeToolIcon && this.$parent.$parent._changeToolIcon(this.bus.currentActiveTool.id);
            }
            return !(this.tool.id === 'sketchinglayeradd' || this.toolActive);
        },
        // calculates whether the little arrow beneath the toolbar icon should be visible or not
        toolActive() {
            return this.active ? this.active : this.tool.active;
        },
    },
    methods: {
        /**
         * ClickHandler transfers event to parent element
         * @param id
         */
        onToolClickHandler(id) {
            this.$emit('onToolClick', id);
        },
        toolDisabled(tool) {
            if (tool.menu && tool.id === 'sketchingtoolbox' && this.hasGraphicsOnLoad) {
                return false;
            } else {
                return !tool.enabled || tool.processing || (this.profileLoaded && this.notActiveTool)
            }
        }
    },
};
</script>
