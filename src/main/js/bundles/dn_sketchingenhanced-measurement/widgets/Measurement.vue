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
  <v-layout row class="pa-0" height="100%">
    <v-card class="leftContainer">
      <v-card class="">
        <v-switch
          class="pa-1 ma-0 measurementCheckboxes"
          color="primary"
          v-if="activeSketchingTool === 'polyline'"
          :label="i18n.measurement.showLineMeasurementsAtPolylines"
          v-model="polylineMeasurementLineEnabled"
          hide-details
        />
        <v-switch
          class="pa-1 ma-0 measurementCheckboxes"
          color="primary"
          v-if="activeSketchingTool === 'polygon'"
          :label="i18n.measurement.showLineMeasurementsAtPolygons"
          v-model="polygonMeasurementLineEnabled"
          hide-details
        />
        <v-switch
          class="pa-1 ma-0 measurementCheckboxes"
          color="primary"
          v-if="
            activeSketchingTool === 'polyline' &&
            measurementValues.enableAngleMeasurement
          "
          :label="i18n.measurement.showAngleMeasurementsAtPolylines"
          v-model="polylineAngleMeasurentEnabled"
          hide-details
        >
        </v-switch>
      </v-card>

      <v-flex class="unitSelectors">
        <v-select
          v-if="['polyline', 'polygon'].includes(activeSketchingTool)"
          v-model="selectedLengthItem"
          :items="lengthUnits"
          :label="i18n.measurement.unitLengthSelect"
          outlined
          dense
        />
        <v-select
          v-if="activeSketchingTool === 'polygon'"
          v-model="selectedAreaItem"
          :items="areaUnits"
          :label="i18n.measurement.unitAreaSelect"
          outlined
          dense
        />
        <v-select
          return-object
          item-text="systemLabel"
          class="srsSelect"
          v-if="pointEnabled"
          :value="selectedPointSrs"
          @input="$emit('update:selectedPointSrs', $event)"
          :items="coordinateSystems"
          :label="i18n.measurement.coordinateSystem"
          outlined
          dense
        />
        <v-select
          v-show="
            activeSketchingTool === 'polyline' &&
            measurementValues.enableAngleMeasurement
          "
          v-model="angleUnit"
          :items="[
            i18n.measurement.angleUnit.unit1,
            i18n.measurement.angleUnit.unit2,
          ]"
          :label="i18n.measurement.angleUnit.header"
          outlined
          dense
        />
      </v-flex>
    </v-card>
    <v-divider class="mx-1" vertical></v-divider>
    <v-card class="rightContainer">
      <v-layout
        class="pa-0 ma-0 measurementText"
        column
        v-for="(type, index) in activeMeasureInfos"
        :key="index"
      >
        <v-layout class="pa-0 ma-0 flex justify-space-between" row>
          <div class="measureLabel">
            &nbsp;&nbsp;{{ i18n.measurement[type.measure] }}
          </div>
          <div class="measureRecord">
            {{ measurementValues[type.measure] }}
          </div>

          <v-tooltip top>
            <v-btn
              icon
              color=""
              @click="_copyTextToClipboard(measurementValues[type.measure])"
              slot="activator"
            >
              <v-icon class="icon-select-none">icon-select-none</v-icon>
            </v-btn>
            <span>{{ i18n.measurement.copyToClipboard }}</span>
          </v-tooltip>
        </v-layout>
      </v-layout>
    </v-card>
  </v-layout>
</template>
<script>
import { debounce } from "esri/core/promiseUtils";
export default {
  data() {
    return {
      value: "auto",
      types: [
        { measure: "coordinates", rules: ["pointEnabled"] },
        {
          measure: "currentLength",
          rules: ["polygonEnabled", "polylineEnabled"],
        },
        { measure: "aggregateLength", rules: ["polylineEnabled"] },
        { measure: "totalLength", rules: ["polylineEnabled"] },
        { measure: "currentArea", rules: ["polygonEnabled"] },
        { measure: "perimeter", rules: ["polygonEnabled", "areaEnabled"] },
        { measure: "area", rules: ["polygonEnabled"] },
      ],
    };
  },
  props: {
    i18n: { type: Object, default: () => i18n.ui },
    measurements: {
      type: Object,
      default: () => ({}),
    },
    units: {
      type: Object,
    },
    activeSketchingTool: String,
    selectedPointSrs: Object,
    measurementValues: Object,
    options: Object,
  },

  mounted() {
    if (!this.selectedPointSrs) {
      this.$emit("update:selectedPointSrs", this.coordinateSystems?.[0]);
    }
    if (!this.angleUnit) {
      this.angleUnit = this.i18n.measurement.angleUnit.unit1;
    }
  },

  computed: {
    activeMeasureInfos() {
      return this.types.filter((x) => {
        const areaEnabled = this.measurementValues?.areaEnabled;
        if (areaEnabled && x.rules.includes("areaEnabled")) {
          return true;
        }
        return x.rules.includes(`${this.activeSketchingTool}Enabled`);
      });
    },
    pointEnabled() {
      return this.activeSketchingTool === "point";
    },
    polygonMeasurementLineEnabled: {
      get() {
        return this.options?.showLineMeasurementsAtPolygons;
      },
      set(val) {
        this.$emit("update:options", {
          ...this.options,
          showLineMeasurementsAtPolygons: val,
        });
      },
    },
    polylineMeasurementLineEnabled: {
      get() {
        return this.options?.showLineMeasurementsAtPolylines;
      },
      set(val) {
        this.$emit("update:options", {
          ...this.options,
          showLineMeasurementsAtPolylines: val,
        });
      },
    },
    polylineAngleMeasurentEnabled: {
      get() {
        return this.options?.showAngleMeasurementsAtPolylines;
      },
      set(val) {
        this.$emit("update:options", {
          ...this.options,
          showAngleMeasurementsAtPolylines: val,
        });
      },
    },
    angleUnit: {
      get() {
        return this.options?.angleUnit;
      },
      set(val) {
        this.$emit("update:options", { ...this.options, angleUnit: val });
      },
    },
    selectedAreaItem: {
      get() {
        return this.options?.areaUnit;
      },
      set(val) {
        this.$emit("update:options", { ...this.options, areaUnit: val });
      },
    },
    selectedLengthItem: {
      get() {
        return this.options?.lengthUnit;
      },
      set(val) {
        this.$emit("update:options", { ...this.options, lengthUnit: val });
      },
    },
    coordinateSystems() {
      return this.units?.point;
    },
    lengthUnits() {
      return this.units?.length?.map((x) => ({
        value: x,
        text: this.i18n.measurement.lengthUnit?.[x] || x,
      }));
    },
    areaUnits() {
      return this.units?.area?.map((x) => ({
        value: x,
        text: this.i18n.measurement.areaUnit?.[x] || x,
      }));
    },
  },
  methods: {
    _copyTextToClipboard(text) {
      const el = document.createElement("textarea");
      el.value = text;
      el.setAttribute("readonly", "");
      el.style = { display: "none" };
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    },
  },
};
</script>
