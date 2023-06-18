// @todo This will be an issue in Chrome. Fix later by moving it to root script
//import browser from 'webextension-polyfill';

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
    return field.formLabel || field.title || field.code;
}

export function alert(message) {
    browser.tabs.executeScript({code : `alert(${JSON.stringify(message)});`});
}

/**
 * @param {Number} delay ms
 * @returns {Promise<unknown>}
 */
export function sleep(delay) {
    let resolve, reject;
    const promise = new Promise((_resolve, _reject) => { resolve = _resolve; reject = _reject; });
    setTimeout(resolve, delay);

    return promise;
}

export function vueToObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}