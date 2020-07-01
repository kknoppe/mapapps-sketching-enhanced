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
    <v-tooltip
            :bottom="tooltip==='bottom'"
            :top="tooltip==='top'"
            :left="tooltip==='left'"
            :right="tooltip==='right'">
        <v-btn :icon="round"
               :small="size === 'small'"
               @click.stop="$emit('click')"
               slot="activator"
               v-bind="{color, disabled, flat}">
            <v-icon :color="iconColor" :small="size === 'small'">{{icon}}
            </v-icon>
        </v-btn>

        <!-- Tooltip text -->
        <span><slot></slot></span>
    </v-tooltip>

</template>
<script>
    export default {
        props: {
            // Disabled state
            disabled: {type: Boolean, default: false},
            // Icon to display
            icon: String,
            // Color of the component
            color: String,
            // Color of the icon
            iconColor: String,
            // Size of the component
            size: {type: String, default: 'small'},
            // Shape of the component
            round: {type: Boolean, default: true},
            // Style of the component
            flat: {type: Boolean, default: false},
            // Position of the tooltip
            tooltip: {type: String, default: 'bottom'},
        },
    };
</script>
