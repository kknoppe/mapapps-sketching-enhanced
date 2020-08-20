<template>
    <v-layout row>
        <v-layout column>
            <font-component label="Schriftart" :font.sync="font"></font-component>
            <color-picker label="Schriftfarbe" :color.sync="color"></color-picker>
            <blur-component label="Schrifteffekt" :color.sync="blurColor" :radius.sync="blurRadius" :i18n="i18n"></blur-component>
        </v-layout>
        <v-layout column>
            <text-style-component label="Schriftstil" :textStyle.sync="textStyle" :i18n="i18n"></text-style-component>
            <font-size-component label="Schriftgröße" :fontSize.sync="fontSize"></font-size-component>
            <text-angle-component label="Textrotation" :angle.sync="textAngle" :i18n="i18n"></text-angle-component>
        </v-layout>
    </v-layout>
</template>

<script>

    import i18n from 'dojo/i18n!../../nls/bundle';
    import ColorPicker from './ColorPicker.vue';
    import FontComponent from './FontComponent.vue'
    import TextStyleComponent from './TextStyleComponent.vue';
    import FontSizeComponent from './FontSizeComponent.vue';
    import BlurComponent from './BlurComponent.vue';
    import TextAngleComponent from './TextAngleComponent.vue';

    export default {
        components: {
            FontSizeComponent,
            ColorPicker,
            FontComponent,
            TextStyleComponent,
            BlurComponent,
            TextAngleComponent,
        },
        props: {
            settings: Object,
            i18n: {type: Object, default: () => i18n.ui.textEditor},
        },
        computed: {
            color: {
                get() {
                    return this.settings.textColor;
                },
                set(val) {
                    if(val && val.rgba) {
                        const settings = this.settings;
                        settings.textColor = val.rgba;
                        this.$emit('update:settings', settings);
                    }
                },
            },
            blurColor: {
                get() {
                    return this.settings.textBlurColor;
                },
                set(val) {
                    if(val && val.rgba) {
                        const settings = this.settings;
                        settings.textBlurColor = val.rgba;
                        this.$emit('update:settings', settings);
                    }
                },
            },
            blurRadius: {
                get() {
                    return this.settings.textBlurRadius;
                },
                set(val) {
                    const settings = this.settings;
                    settings.textBlurRadius = val;
                    this.$emit('update:settings', settings);
                }
            },
            font: {
                get() {
                    return this.settings.font;
                },
                set(val) {
                    const settings = this.settings;
                    settings.font = val;
                    this.$emit('update:settings', settings);
                }
            },
            textStyle: {
                get() {
                    return this.settings.textStyle;
                },
                set(val) {
                    const settings = this.settings;
                    settings.textStyle = val;
                    this.$emit('update:settings', settings);
                },
            },
            fontSize: {
                get() {
                    return this.settings.textSize;
                },
                set(val) {
                    const settings = this.settings;
                    settings.textSize = val;
                    this.$emit('update:settings', settings);
                }
            },
            textAngle: {
                get() {
                    return this.settings.angle;
                },
                set(val) {
                    const settings = this.settings;
                    settings.angle = val;
                    this.$emit('update:settings', settings);
                }
            },
        },
    }


</script>
