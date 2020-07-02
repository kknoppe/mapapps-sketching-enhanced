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
    <v-container class="simpleSymbolEditor">
        <v-layout row wrap align-center justify-center class="btnGroupSimpleSymbol">
            <line-editor-buttons :i18n="i18n" :settings="settings" :active-tab.sync="activeTab"></line-editor-buttons>
        </v-layout>

        <line-editor v-bind="{i18n, activeTab, settings}"></line-editor>
    </v-container>
</template>

<script>
    import {Chrome} from 'dn_vuecolor';
    import LineStylePicker from './LineStylePicker.vue';
    import LineEditorButtons from './LineEditorButtons.vue';
    import LineEditor from './LineEditor.vue';

    export default {
        components: {
            'color-picker': Chrome,
            LineEditor,
            LineEditorButtons,
            LineStylePicker,
        },
        props: {
            i18n: {type: Object, default: () => ({}),},
            settings: Object,
        },

        data() {
            return {
                activeTab: 0,
            };
        },


    };
</script>
