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
    <v-flex class="overflow-tooltip">
        <!-- Slot before Tooltip activator -->
        <slot name="prepend"></slot>

        <!-- Tooltip activator -->
        <v-tooltip v-bind="tooltipProps" :disabled="!overflow">
            <slot name="activator" slot="activator"></slot>
            <slot></slot>
        </v-tooltip>

        <!-- Slot after Tooltip activator -->
        <slot name="append"></slot>
    </v-flex>
</template>

<script>
    export default {

        data() {
            return {
                // element is overflowing
                overflow: false,
                // ResizeObserver
                observer: null,
                // tolarance for calculation
                tolerance: 2,
            };
        },

        mounted() {
            const element = this.$el;

            // set current value
            this.overflow = this.isOverflowing(element);

            if (window.ResizeObserver) {
                // init observer
                this.observer = new window.ResizeObserver(entries => {
                    // update value
                    this.overflow = this.isOverflowing(entries[0].target);
                });

                // start observer
                this.observer.observe(element);
            }

            if (!this.observer && window.ResizeSensor) {
                // for MS Edge
                this.observer = window.ResizeSensor;
                this.observer(this.$el, () => (this.overflow = this.isOverflowing(this.$el)));
            }
        },

        destroyed() {
            if (this.observer && this.observer.unobserve) {
                // dispose observer
                this.observer.unobserve(this.$el);
                this.observer = null;
            }

            if (this.observer && this.observer.detach) {
                // dispose observer
                this.observer.detach(this.$el);
                this.observer = null;
            }
        },

        computed: {
            /**
             * Props for the vuetify tooltip component (with default values)
             * @return {{}}
             */
            tooltipProps() {
                const r = {...this.$attrs};

                if (!r.openDelay && !r['open-delay']) {
                    // open delay not defined
                    r.openDelay = 1000;
                }

                if (!['bottom', 'top', 'right', 'left'].some(pos => Object.keys(this.$attrs).includes(pos))) {
                    // position not defined
                    r.bottom = true;
                }
                return r;
            },
        },

        methods: {
            /**
             * Checks if size of the given element is largen than the visible space
             * @param {HTMLElement} element
             * @return {boolean}
             */
            isOverflowing(element) {
                // calculate size difference
                const widthDifference = Math.abs(element.scrollWidth - element.clientWidth);
                const heightDifference = Math.abs(element.scrollHeight - element.clientHeight);

                // compare with tolerance because IE/Edge can miscalculate dimensions by 1px
                return [widthDifference, heightDifference].some(diff => diff >= this.tolerance);
            },
        },
    };
</script>
