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
    <div class="construction_panel_interior">
        <construction-checkbox v-if="type==='polyline' || type==='polygon' || type==='ellipse'"
                               setting="planarLength"
                               :constructionModel="constructionModel"
                               :label="i18n.activeConstructionLength"
                               :i18n="i18n.symbolEditor">
        </construction-checkbox>
        <construction-checkbox v-if="type==='polyline' || type==='polygon' || type==='ellipse'"
                               setting="angleModulus"
                               :constructionModel="constructionModel"
                               :label="i18n.activeConstructionAngle"
                               :i18n="i18n.symbolEditor">
        </construction-checkbox>
        <construction-checkbox v-if="type==='circle'"
                               setting="radius"
                               :constructionModel="constructionModel"
                               :label="i18n.activeConstructionRadius"
                               :i18n="i18n.symbolEditor">
        </construction-checkbox>
    </div>
</template>


<script>

    import ConstructionCheckbox from './ConstructionCheckbox.vue';

    export default {
        components: {
            'construction-checkbox': ConstructionCheckbox,
        },
        data() {
            return {};
        },
        props: {
            constructionModel: {
                type: Object,
            },
            tool: Object,
            i18n: {
                type: Object,
            },
        },
        computed: {
            type() {
                if (this.tool && this.tool.type) {
                    this.newType = this.tool.type;
                }
                return this.newType;
            }
        },
        methods: {},
    };
</script>
