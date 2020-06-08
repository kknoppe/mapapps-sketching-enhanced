<template>
<div class="footer">
    <v-toolbar dense class="measurementFooterToolbar">
        <v-switch
            v-model="enableMeasurement"
            :label="i18n.enableMeasurements"
            hide-details>
        </v-switch>
        <v-spacer></v-spacer>


        <v-btn-toggle>
            <v-tooltip top v-if="measurementEnabled">
                <v-btn slot="activator" class="buttonToggleKeepingMeasurements" @click="toggleKeepMeasurements">
                    <v-icon>
                       {{multiMeasurement ? "icon-keep-measurements" : "icon-remove-measurements"}}
                    </v-icon>
                </v-btn>
                <span> {{multiMeasurement ? i18n.disableKeepMeasurements : i18n.enableKeepMeasurements}}</span>
            </v-tooltip>
        </v-btn-toggle>

    </v-toolbar>
</div>
</template>


<script>

    export default {
        data() {
            return {
                visible: true,
                multiMeasurement: false,
                measurementEnabled: this.measurementBoolean,
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
            },
        },
        computed: {
            enableMeasurement: {
                get() {
                    return this.measurementBoolean;
                },
                set(value) {
                    this.measurementEnabled = value;
                    this.$emit('update:measurementBoolean', value);
                },
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
             * ClickHandler transfers event to parent element
             * @param id
             */
            onToolClickHandler(id) {
                this.$emit('onToolClick', id);
            },
            toggleKeepMeasurements() {
                this.multiMeasurement = !this.multiMeasurement;
                this.bus.$emit('changeMultiMeasurementState', this.multiMeasurement);
            },
        },

    };
</script>
