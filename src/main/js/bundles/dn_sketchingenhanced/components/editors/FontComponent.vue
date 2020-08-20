<template>
    <div>
        <span> {{label}}</span>
        <v-menu
            v-model="menu"
            :close-on-content-click="true"
            offset-y
            full-width
        >
            <template v-slot:activator="{ on }">
                <v-btn icon
                       v-on="on">
                    {{ font }}
                </v-btn>
            </template>
            <font-picker :fonts="fonts" v-model="currentFont"></font-picker>
        </v-menu>
    </div>
</template>

<script>

    import FontPicker from '../text/FontPicker.vue';

    export default {
        components: {
            FontPicker,
        },
        data() {
            return {
                menu: false,
                fonts: ['Arial', 'Serif'],
            };
        },
        props: {
            label: String,
            font: String,
        },
        computed: {
            currentFont: {
                get() {
                    return this.font;
                },
                set(val) {
                    this.$emit('update:font', val);
                },
            }
        }

    }

</script>
