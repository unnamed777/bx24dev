import qs from 'qs';

export default {
    setAuth(type, auth) {
        this.type = type;
        this.auth = auth;
    },

    async request(method, data) {
        data.auth = this.auth.access_token;
        //console.log(data);

        // URLSearchParams doesn't support nested objects, use qs
        const body = qs.stringify(data);
        let url;

        // @todo refactor
        if (this.type === 'webhook') {
            url = `${this.auth.url}/${method}`;
        } else {
            url = `https://${this.auth.domain}/rest/${method}.json`;
        }

        return await fetch(url, {
            method: 'post',
            body,
        }).then(response => response.json());
    },

    async call(method, data = {}) {
        let result = await this.request(method, data);
        return result.result;
    },

    /**
     *
     * @param {string} method
     * @param {Object} data
     * @param options If options.total is true, method will return {items, total} object
     * @returns {Promise<*[]|{entries: *[], total: number}>}
     */
    async fetch(method, data = {}, options = {}) {
        const response = await this.request(method, data);
        let returnResult;

        if (options.total) {
            let resultItems;

            if (options.getter) {
                // Sale module is "special" one
                resultItems = options.getter(response);
            } else {
                resultItems = response.result;
            }

            returnResult = {
                entries: resultItems,
                total: response.total,
            };
        } else {
            returnResult = response.result;
        }

        return returnResult;
    },

    /**
     *
     * @param {string} method
     * @param {Object} data
     * @param options If options.total is true, method will return {items, total} object
     * @returns {Promise<*[]|{entries: *[], total: number}>}
     */
    async fetchAll(method, data = {}, options = {}) {
        let items = [];
        let limit = options.limit || null;
        let response;

        while (true) {
            response = await this.request(method, data);

            if (response.error) {
                alert(`${method}: ${response.error_description} (${response.error})`);
                throw new Error('BX24 Error: ' + response.error_description);
            }

            let currentStepItems;

            if (options.getter) {
                // Sale module is "special" one
                currentStepItems = options.getter(response);
            } else {
                currentStepItems = response.result;
            }

            items = items.concat(response.result);

            if (limit && items.length >= limit) {
                items = items.slice(0, limit);
                break;
            }

            if (!response.next) {
                break;
            }

            data.start = response.next;
        }

        let returnResult;

        if (options.total) {
            returnResult = {
                entries: items,
                total: response.total,
            };
        } else {
            returnResult = items;
        }

        return returnResult;
    },
}