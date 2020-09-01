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
