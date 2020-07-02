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
    <v-card-actions row wrap justify-end>
        <v-spacer></v-spacer>

        <action-button color="primary" @click="$emit('submit')" class="mr-2" :disabled="!submittable" icon="check">
            {{ submitLabel }}
        </action-button>

        <action-button @click="$emit('discard')" :disabled="!discardable" icon="close">
            {{ discardLabel }}
        </action-button>
    </v-card-actions>
</template>
<script>
    import ActionButton from './ActionButton.vue';

    export default {
        components: {
            ActionButton,
        },
        props: {
            i18n: {type: Object, default: () => ({})},
            submittable: {type: Boolean, default: true},
            discardable: {type: Boolean, default: true},
            submitLabel: {type: String, default: 'Änderungen vornehmen'},
            discardLabel: {type: String, default: 'Änderungen verwerfen'},
        },
    };
</script>
