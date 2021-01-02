export default () => [
    {
        code: 'FIELD_NAME',
        label: 'Код поля',
        type: 'string',
    },
    {
        code: 'EDIT_FORM_LABEL',
        label: 'Название в форме',
    },
    {
        code: 'LIST_COLUMN_LABEL',
        label: 'Название в списке',
    },
    {
        code: 'LIST_FILTER_LABEL',
        label: 'Название в фильтре',
    },
    {
        code: 'XML_ID',
        label: 'XML_ID',
    },
    {
        code: 'USER_TYPE_ID',
        type: 'enumeration',
        label: 'Тип',
        items: [
            { ID: 'string', VALUE: 'Строка (string)' },
            { ID: 'integer', VALUE: 'Целое число (integer)' },
            { ID: 'double', VALUE: 'Число (double)' },
            { ID: 'boolean', VALUE: 'Да/нет (boolean)' },
            { ID: 'datetime', VALUE: 'Дата/Время' },
            { ID: 'date', VALUE: 'Дата' },
        ],
    },
    {
        code: 'MANDATORY',
        type: 'enumeration',
        label: 'Обязательное',
        items: [
            { ID: 'Y', VALUE: 'Да' },
            { ID: 'N', VALUE: 'Нет' },
        ],
    },
    {
        code: 'MULTIPLE',
        type: 'enumeration',
        label: 'Множественное',
        items: [
            { ID: 'Y', VALUE: 'Да' },
            { ID: 'N', VALUE: 'Нет' },
        ],
    },
    {
        code: 'SORT',
        label: 'Сортировка',
    },
    {
        code: 'SHOW_IN_LIST',
        type: 'enumeration',
        label: 'Показывать в списке',
        items: [
            { ID: 'Y', VALUE: 'Да' },
            { ID: 'N', VALUE: 'Нет' },
        ],
    },
    {
        code: 'SHOW_FILTER',
        type: 'enumeration',
        label: 'Показывать в фильтре',
        items: [
            { ID: 'Y', VALUE: 'Да' },
            { ID: 'N', VALUE: 'Нет' },
        ],
    },
    {
        code: 'EDIT_IN_LIST',
        type: 'enumeration',
        label: 'Разрешить редактирование пользователем',
        items: [
            { ID: 'Y', VALUE: 'Да' },
            { ID: 'N', VALUE: 'Нет' },
        ],
    },
];