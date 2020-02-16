export function prepareCrmEntityFields(crmFields) {
    const items = [];

    for (let key in crmFields) {
        let field = crmFields[key];

        items.push({
            code: key,
            label: field.formLabel || field.title,
            type: field.type,
            sort: field.sort,
            multiple: field.isMultiple ? '●' : '',
            required: field.isRequired ? '●' : '',
        });
    }

    return {
        columns: [
            {code: 'code', label: 'Код'},
            {code: 'label', label: 'Название'},
            {code: 'type', label: 'Тип'},
            {code: 'multiple', label: 'Множ'},
            {code: 'required', label: 'Обяз'},
        ],
        items
    };
}

/**
 * @param {Object} field
 * @returns {String}
 */
export function getFieldLabel(field) {
    return field.formLabel || field.title;
}
