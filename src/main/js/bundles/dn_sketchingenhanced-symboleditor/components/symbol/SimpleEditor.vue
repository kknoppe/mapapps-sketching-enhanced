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
    <v-flex>
        <template v-if="type === 'point'">
            <simple-editor-point :settings="settings" :i18n="i18n"></simple-editor-point>
        </template>

        <template v-else-if="type === 'line'">
            <simple-editor-line :settings="settings" :i18n="i18n"></simple-editor-line>
        </template>

        <template v-else>
            <simple-editor-polygon :settings="settings" :i18n="i18n"></simple-editor-polygon>
        </template>
    </v-flex>
</template>

<script>
    import SimpleEditorPolygon from './polygon/SimpleEditorPolygon.vue';
    import SimpleEditorLine from './line/SimpleEditorLine.vue';
    import SimpleEditorPoint from './point/SimpleEditorPoint.vue';

    export default {
        components: {
            'simple-editor-polygon': SimpleEditorPolygon,
            'simple-editor-line': SimpleEditorLine,
            'simple-editor-point': SimpleEditorPoint,
        },

        props: {
            i18n: {type: Object, default: () => ({}),},
            settings: {type: Object, required: true},
        },

        computed: {
            type() {
                switch (this.settings.typeName) {
                    case 'PointSetting':
                        return 'point';
                    case 'LineSetting':
                        return 'line';
                    default:
                }

                return 'polygon';
            },
        },
        watch: {
            settings: {
                handler(settings) {
                    this.$emit('settingsSelectionChanged', settings);
                },
                deep: true,
                immediate: true,
            },
        },
    };
</script>
