import browser from 'webextension-polyfill';

export function getExposedPromise() {
    let exportResolve, exportReject;

    const promise = new Promise((resolve, reject) => {
        exportResolve = resolve;
        exportReject = reject;
    });

    return {
        promise: promise,
        resolve: exportResolve,
        reject: exportReject
    };
};

export function prepareCrmEntityFields(crmFields) {
    const items = [];

    const pushEnumValues = (fieldCode) => {
        const field = crmFields[fieldCode];
        console.log(JSON.parse(JSON.stringify(field)));

        let html = `
            <div>
                <table>
                    <tbody>
                        ${field.items.map((item) => {
                            return `
                                <tr>
                                    <td>${item.ID}</td>
                                    <td>${item.VALUE}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `;

        field.type = field.type + html;
    };

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

export function alert(message) {
    browser.tabs.executeScript({code : `alert(${JSON.stringify(message)});`});
}

export function sleep(delay) {
    let resolve, reject;
    const promise = new Promise((_resolve, _reject) => { resolve = _resolve; reject = _reject; });

    console.log('start sleeping for %dms', delay);
    setTimeout(resolve, delay);

    return promise;
}
