<template>
    <v-menu
        v-model="menu"
        :close-on-content-click="false"
        offset-y
        full-width
    >
        <template v-slot:activator="{ on }">
            <v-btn
                v-on="on"

            ></v-btn>
        </template>
        <color-picker v-model="color"></color-picker>

    </v-menu>
</template>

<script>

    import {Chrome} from 'dn_vuecolor';

    export default {
        components: {
            'color-picker': Chrome,
        },
        data() {
            return {
                menu: false,
            }
        },
        computed: {
            color: {
                get() {
                    return this.settings.color
                },
                set(val) {
                    this.$emit('update:settings.color', val);
                    console.log(val);
                }
            },
        },
        props: {
            settings: Object,
        }
    }
</script>
