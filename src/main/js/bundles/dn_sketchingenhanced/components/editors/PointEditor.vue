<template>
    <div>
        <color-picker label="Füllfarbe" :color.sync="color"></color-picker>
        <style-picker label="Symbol" :shape.sync="shape"></style-picker>
        <size-picker label="Punktgröße" :size.sync="size" :maxPointSize="settings.maxPointSize"></size-picker>
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
                    return this.settings.shape;
                },
                set(val) {
                    const settings = this.settings;
                    settings.shape = val;
                    this.$emit('update:settings', settings);
                }
            },
            size: {
                get() {
                    return this.settings.radius;
                },
                set(val) {
                    const settings = this.settings;
                    settings.radius = val;
                    this.$emit('update:settings', settings);
                }
            }
        },
    }

</script>
