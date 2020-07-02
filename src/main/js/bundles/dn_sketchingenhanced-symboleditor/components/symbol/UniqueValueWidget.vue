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
    <v-fade-transition>
        <v-flex>
            <v-container fluid grid-list-md class="pa-1 pl-2">
                <v-layout row nowrap align-left>
                    <span class="subheading my-2">{{ settings.label }}</span>
                    <v-spacer></v-spacer>

                    <preview-button @click="open = !open" :symbol="settings.symbol" class="my-auto"></preview-button>
                </v-layout>

                <simple-editor v-if="open" :settings="settings.symbol" :i18n="i18n"></simple-editor>
            </v-container>
        </v-flex>
    </v-fade-transition>
</template>

<script>
    import {Chrome} from 'dn_vuecolor';
    import SimpleEditor from './SimpleEditor.vue';
    import PreviewButton from './PreviewButton.vue';
    import SymbolCategory from '../../model/SymbolCategory';

    export default {

        components: {
            ColorPicker: Sketch,
            SimpleEditor,
            PreviewButton,
        },

        props: {
            i18n: {type: Object, default: () => ({}),},
            settings: SymbolCategory,
        },

        data() {
            return {
                open: false,
            };
        },
    };
</script>
