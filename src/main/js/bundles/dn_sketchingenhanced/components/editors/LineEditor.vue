<template>
    <div>
        <color-picker label="Linienfarbe" :color.sync="color"></color-picker>
        <style-picker label="Linienstil" :shape.sync="shape" type="line"></style-picker>
        <size-picker label="Linienstärke" :size.sync="size" type="line"></size-picker>
    </div>
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
            size: {
                get() {
                    return this.settings.width;
                },
                set(val) {
                    const settings = this.settings;
                    settings.width = val;
                    this.$emit('update:settings', settings);
                }
            }
        },
    }

</script>
