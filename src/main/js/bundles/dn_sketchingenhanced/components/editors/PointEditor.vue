<template>
    <div>
        <color-picker label="Füllfarbe" :color.sync="color"></color-picker>
    </div>
</template>

<script>

    import ColorPicker from './ColorPicker.vue';

    export default {
        components: {
            ColorPicker,
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
                }
            },
        },
    }

</script>
