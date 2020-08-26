<template>
    <v-layout column px-8>
        <v-switch v-model="visible" :label="i18n.turnOnVisibility"></v-switch>
        <v-switch v-model="multi" :label="i18n.enableKeepMeasurements"></v-switch>
    </v-layout>
</template>

<script>

    export default {
        data() {
            return {
                visible: true,
            };
        },
        mounted() {
            this.bus.$on('sketchingLayerVisibilityChanged', val => {
                this.visible = val;
            });
        },
        props: {
            i18n: {
                type: Object,
            },
            bus: {
                type: Object,
            },
            multiMeasurement: {
                type: Boolean,
            },
        },
        computed: {
            multi: {
                get() {
                    return this.multiMeasurement;
                },
                set(val) {
                    this.$emit('update:multiMeasurement', val);
                },
            },
        },
        watch: {
            visible(val) {
                this.$emit('toggleSketchingLayerVisibility', val);
            }
        },
    }

</script>
