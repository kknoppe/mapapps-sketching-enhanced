<template>
    <v-layout row>
        <v-layout column>
            <color-picker label="Füllfarbe" :color.sync="color"></color-picker>
            <color-picker label="Linienfarbe" :color.sync="outlineColor"></color-picker>
            <size-picker label="Linienstärke" :size.sync="size" type="line"></size-picker>
        </v-layout>
        <v-layout column>
            <style-picker label="Füllung" :shape.sync="shape" type="polygon"></style-picker>
            <style-picker label="Linienstil" :shape.sync="lineStyle" type="line"></style-picker>
        </v-layout>
    </v-layout>
</template>

<script>

    import ColorPicker from './ColorPicker.vue';
    import StylePicker from './StylePicker.vue';
    import SizePicker from './SizePicker.vue';

    export default {
        components: {
            ColorPicker,
            StylePicker,
            SizePicker,
        },
        props: {
            settings: Object,
        },
        computed: {
            color: {
                get() {
                    return this.settings.color;
                },
                set(val) {
                    if(val && val.rgba) {
                        const settings = this.settings;
                        settings.color = val.rgba;
                        this.$emit('update:settings', settings);
                    }
                },
            },
            outlineColor: {
                get() {
                    return this.settings.outline.color;
                },
                set(val) {
                    if(val && val.rgba) {
                        const settings = this.settings;
                        settings.outline.color = val.rgba;
                        this.$emit('update:settings', settings);
                    }
                },
            },
            shape: {
                get() {
                    return this.settings.style;
                },
                set(val) {
                    const settings = this.settings;
                    settings.style = val;
                    this.$emit('update:settings', settings);
                }
            },
            lineStyle: {
                get() {
                    return this.settings.outline.style;
                },
                set(val) {
                    const settings = this.settings;
                    settings.outline.style = val;
                    this.$emit('update:settings', settings);
                }
            },
            size: {
                get() {
                    return this.settings.outline.width;
                },
                set(val) {
                    const settings = this.settings;
                    settings.outline.width = val;
                    this.$emit('update:settings', settings);
                }
            }
        },
    }

</script>
