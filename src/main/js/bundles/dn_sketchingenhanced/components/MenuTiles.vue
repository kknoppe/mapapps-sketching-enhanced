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
    <v-list-tile
        @click="onToolClickHandler"
        class="sketchingMenuTiles"
        :disabled="!tool.enabled || tool.processing || (profileLoaded && notActiveTool)"
        :value="tool.active">
        <v-list-tile-action class="sketchingMenuToolActions">
            <v-icon> {{tool.iconClass}} </v-icon>
        </v-list-tile-action>
        <v-list-tile-title class="sketchingMenuToolTitles"> {{ tool.title }}</v-list-tile-title>
    </v-list-tile>
</template>


<script>


    export default {
        data() {
            return {
                profileLoaded: false
            };
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
                return !this.tool.active;
            },
        },
        props: {
            tool: {
                type: Object,
            },
            bus: {
                type: Object,
            },
        },
        methods: {
            onToolClickHandler() {
                this.$emit('onToolClick', this.tool.id);
            },
        },
    };
</script>
