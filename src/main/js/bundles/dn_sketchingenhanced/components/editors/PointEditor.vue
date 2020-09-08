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
        <color-picker v-bind:label="i18n.symbolEditor.PointSymbolSelectorTooltip" :color.sync="color"></color-picker>
        <style-picker v-bind:label="i18n.symbolEditor.PointSymbolSelectorTooltip" :shape.sync="shape" type="point"></style-picker>
        <size-picker v-bind:label="i18n.symbolEditor.pointRadiusSliderLabel" :size.sync="size" :maxPointSize="settings.maxPointSize" type="point" :i18n="i18n"></size-picker>
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
            i18n: {
                type: Object,
            }
        },
        computed: {
            color: {
                get() {
                    return this.settings.color;
                },
                set(val) {
                    console.log(this.i18n)
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
        methods: {
            _getLabel(typ){
                return this.i18n[typ];
            }
        }
    }

</script>
