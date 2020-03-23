export default {
    data() {
        return {
            isFieldTypeValuesLoaded: false,
        };
    },

    methods: {
        async preloadFieldTypeValues(fields) {
            this.isFieldTypeValuesLoaded = false;

            const types = new Set();

            Object.values(fields).map((item) => {
                if (['integer', 'string', 'enumeration', 'char', 'datetime', 'diskfile'].indexOf(item.type) === -1) {
                    types.add(item.type);
                }
            });

            for (let type of types) {
                if (!this.$store.state.fieldTypes[type]) {
                    continue;
                }

                await this.$store.dispatch(this.$store.state.fieldTypes[type] + '/load');
            }

            this.isFieldTypeValuesLoaded  = true;
        },
    },
};