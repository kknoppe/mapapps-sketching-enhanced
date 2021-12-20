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
    <v-layout
        column
        px-8
    >
        <v-switch
            v-model="onSketchingVisible"
            :label="i18n.turnOnVisibility"
            color="primary"
        />
    </v-layout>
</template>
<script>
    export default {
        props: {
            i18n: {
                type: Object
            },
            bus: {
                type: Object
            },
            sketchingVisible: Boolean,
        },

        computed: {
            onSketchingVisible:{
                get() {
                    return this.sketchingVisible;
                },
                set(val) {
                    this.$emit('toggleSketchingLayerVisibility', val);
                }
            }
        }
}
</script>
