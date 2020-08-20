<template>
    <div>
        <span> {{label}}</span>
        <v-menu
            v-model="menu"
            :close-on-content-click="false"
        >
            <template v-slot:activator="{ on }">
                <v-btn icon
                       v-on="on">
                   <span>{{radius}}</span>
                </v-btn>
            </template>

            <size-slider
                label="_"
                :size.sync="radius"
                :max="max"
                :min="1"
                :type="type"
                :step="1">
            </size-slider>

        </v-menu>
    </div>
</template>


<script>

    import SizeSlider from '../../../dn_sketchingenhanced-symboleditor/components/input/SizeSlider.vue';

    export default {
        components: {
            SizeSlider,
        },
        data() {
            return {
                menu: false,
            };
        },
        props: {
            type: String,
            label: String,
            size: Number,
            maxPointSize: Number,
        },
        computed: {
            radius: {
                get() {
                    return this.size;
                },
                set(val) {
                    this.$emit('update:size', val);
                },
            },
            max() {
               if(this.type === 'point') {
                   return this.maxPointSize;
               }
               if(this.type === 'line') {
                   return 10;
               }
            }
        }

    }

</script>
