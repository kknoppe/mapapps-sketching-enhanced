<template>
    <div>
        <span> {{label}}</span>
        <v-menu
            v-model="menu"
            :close-on-content-click="false"
            offset-y
            full-width
        >
            <template v-slot:activator="{ on }">
                <v-btn icon
                       v-on="on">
                    {{ textStyleShort }}
                </v-btn>
            </template>
            <text-style-picker style="overflow: hidden" :styles="styles" :active.sync="currentTextStyle" :i18n="i18n"></text-style-picker>
        </v-menu>
    </div>
</template>

<script>

    import TextStylePicker from '../text/TextStylePicker.vue';

    export default {
        components: {
            TextStylePicker,
        },
        data() {
            return {
                menu: false,
                styles: ['bold', 'italic'],
            };
        },
        props: {
            label: String,
            textStyle: Object,
            i18n: Object,
        },
        computed: {
            currentTextStyle: {
                get() {
                    return this.textStyle;
                },
                set(val) {
                    this.$emit('update:textStyle', val);
                },
            },
            textStyleShort() {
                const output = [];
                this.styles.forEach(x => {
                    if (this.textStyle[x]) {
                        output.push(x.substr(0, 1).toUpperCase());
                    }
                });
                const value = output.join(', ');
                if(value) {
                    return value;
                }
                return 'N';
            },
        }

    }

</script>
