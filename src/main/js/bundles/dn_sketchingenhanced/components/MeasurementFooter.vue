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
        <v-toolbar dense flat class="measurementFooterToolbar">
            <v-switch
                v-model="enabled"
                :label="i18n.enableMeasurements"
                color="primary"
                hide-details>
            </v-switch>
        </v-toolbar>
    </div>
</template>


<script>

export default {
    data() {
        return {
            visible: true
        };
    },
    props: {
        i18n: {
            type: Object,
        },
        bus: {
            type: Object,
        },
        measurementBoolean: {
            type: Boolean,
        }
    },
    computed: {
        enabled: {
            get(){
                return this.measurementBoolean;
            },
            set(value) {
                this.$emit("toggleMeasurement",value)
            }
        }
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
         * ClickHandler transfers event to parent element
         * @param id
         */
        onToolClickHandler(id) {
            this.$emit('onToolClick', id);
        }
    }
};
</script>
