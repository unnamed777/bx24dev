export default {
    methods: {
        optionFieldSelect2Template(option) {
            if (!this.fields[option.id]) {
                return option.id;
            }

            return $(`
                <div class="option-field">
                    <div class="option-field__name">${this.fields[option.id].label}</div>
                    <div class="option-field__code">${option.id}</div>
                </div>
            `);
        },
    },
};