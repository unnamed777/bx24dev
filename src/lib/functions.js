import browser from 'lib/browser-stub';

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
}

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

export async function alert(message) {
    console.log('Show alert: %s', message);
    console.trace();
    const activeTab = (await browser.tabs.query({ active: true }))[0];

    browser.scripting.executeScript({
        target: {
            tabId: activeTab.id,
        },
        args: [message],
        func: (message) => {
            window.alert(message);
        },
    });
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


/**
 * @typedef {Object} WebhookParseResult
 * @property {String} url
 * @property {String} domain
 */

/**
 *
 * @param {String} str
 * @returns {WebhookParseResult|null}
 */
export function parseWebhookFromUserInput(str) {
    let domain;
    let url;
    let result = /^https:\/\/([^/]+)\/rest\/([0-9]+)\/([^/]+)/.exec(str);

    if (result === null) {
        // Check whether user entered separate parts of webhook (domain, user id, token)
        result = /^(\S+)\s+([0-9]+)\s+(\S+)$/.exec(str);

        if (result !== null) {
            // Build webhook url
            url = `https://${result[1]}/rest/${result[2]}/${result[3]}`;
            domain = result[1];
        }
    } else {
        // Make clean url
        url = `https://${result[1]}/rest/${result[2]}/${result[3]}`;
        domain = result[1];
    }

    if (result === null) {
        return null;
    }

    return {
        url,
        domain,
    };
}