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
    <div class="text-blur-picker">
        <color-picker v-model="blurColor"></color-picker>
        <v-slider :label="i18n.textEditor.blurSize" v-model="blurRadius" thumb-label="always" thumb-size="20" max="20"></v-slider>
    </div>
</template>
<script>
    import {Chrome} from 'dn_vuecolor';

    export default {
        components: {
            'color-picker': Chrome,
        },
        props: {
            color: Object,
            radius: Number,
            i18n: Object,
        },

        data() {
            return {};
        },
        computed: {
            blurColor: {
                get() {
                    return this.color;
                },
                set(val) {
                    this.$emit('update:color', val);
                },
            },
            blurRadius: {
                get() {
                    return this.radius;
                },
                set(val) {
                    this.$emit('update:radius', val);
                },
            },
        },
    };
</script>
