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
    <div>
        <point-editor v-if="type === 'point'" :settings.sync="symbolSettings" :i18n="i18n"></point-editor>
        <line-editor v-else-if="type === 'polyline'" :settings.sync="symbolSettings" :i18n="i18n"></line-editor>
        <text-editor v-else-if="type === 'text'" :settings.sync="symbolSettings" :i18n="i18n"></text-editor>
        <polygon-editor v-else :settings.sync="symbolSettings" :i18n="i18n"></polygon-editor>
    </div>
</template>

<script>

    import PointEditor from './editors/PointEditor.vue'
    import LineEditor from './editors/LineEditor.vue';
    import PolygonEditor from './editors/PolygonEditor.vue';
    import TextEditor from './editors/TextEditor.vue';

    export default {
        components: {
            PointEditor,
            LineEditor,
            PolygonEditor,
            TextEditor,
        },
        props: {
            settings: Object,
            tool: Object,
            i18n: {
                type: Object,
            }
        },
        computed: {
            type() {
                if(this.tool && this.tool.type) {
                    this.newType = this.tool.type;
                }
                return this.newType;
            },
            symbolSettings: {
                get() {
                    return this.settings;
                },
                set(val) {
                    this.$emit('update:settings', val)
                }
            }
        },
    }

</script>
