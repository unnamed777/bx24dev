export function prepareCrmEntityFields(crmFields) {
    const items = [];

    for (let key in crmFields) {
        let field = crmFields[key];

        items.push({
            code: key,
            label: field.formLabel || field.title,
            type: field.type,
            multiple: field.isMultiple ? '●' : '',
            required: field.isRequired ? '●' : '',
        });
    }

    return {
        fields: [
            {code: 'code', label: 'Код'},
            {code: 'label', label: 'Название'},
            {code: 'type', label: 'Тип'},
            {code: 'multiple', label: 'Множ'},
            {code: 'required', label: 'Обяз'},
        ],
        items
    };
};
