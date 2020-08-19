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
                            <illustration v-if="item === 'Darstellung'" :settings="symbolSettings"></illustration>
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
    import PolygonSetting from 'dn_sketchingenhanced-symboleditor/model/PolygonSetting';

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
        },
        computed: {
            tabs() {
                if(this.currentTool && this.currentTool.id === 'drawpointtool') {
                    return ['Darstellung', 'Messung'];
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
                this.$emit('onToolClick', {id});
            },
        },

    }
</script>
