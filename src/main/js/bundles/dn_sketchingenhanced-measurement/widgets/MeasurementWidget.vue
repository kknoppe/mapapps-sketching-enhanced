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
    <v-flex
      class="measurementToolsTab justify-space-between align-stretch"
      pa-1
      grow
    >
      <toolbar v-model="enabled" />
      <v-divider class="mx-4"></v-divider>
      <v-expand-transition>
        <v-flex v-show="enabled">
          <measurement
            :activeSketchingTool="activeSketchingTool"
            :selectedPointSrs.sync="selectedPointSrs"
            :units="units"
            :measurementValues="measurementValues"
            :options.sync="options"
            :i18n="i18n"
          ></measurement>
        </v-flex>
      </v-expand-transition>
    </v-flex>
  </div>
</template>
<script>
import Bindable from "apprt-vue/mixins/Bindable";
import Measurement from "./Measurement.vue";
import MeasurementFooter from "./MeasurementFooter.vue";

export default {
  mixins: [Bindable],

  components: {
    Measurement,
    toolbar: MeasurementFooter,
  },

  props: {
    i18n: Object,
    units: Object,
  },

  created() {
    this.$emit("created", this);
  },

  data() {
    return {
      enabled: false,
      activeSketchingTool: null,
      selectedPointSrs: null,
      options: null,
      measurementValues: null,
    };
  },
};
</script>
