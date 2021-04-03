import qs from 'qs';
import { sleep } from 'lib/functions';

export default {
    setAuth(type, auth) {
        this.type = type;
        this.auth = auth;
    },

    registerExpiredTokenHandler(func) {
        this.expiredTokenHandler = func;
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

        let bxResult = await fetch(url, {
            method: 'post',
            body,
        }).then(response => response.json());

        if (this.test === true) {
            this.test = false;
            bxResult = {"error":"expired_token","error_description":"The access token provided has expired."};
        }

        if (bxResult.hasOwnProperty('error')) {
            if (bxResult.error === 'expired_token' && this.expiredTokenHandler) {
                console.log('expired error');
                let refreshResult = await this.expiredTokenHandler();

                if (refreshResult === true) {
                    return this.request(method, data);
                }
            } else {
                // Add optional handler
            }
        }

        return bxResult;
    },

    /**
     * Calls a method and returns result. If error happens, error is thrown.
     * To get pure b24 response use request()
     *
     * @param method
     * @param data
     * @returns {Promise<*>}
     */
    async call(method, data = {}) {
        let result = await this.request(method, data);

        if (result.error || result.error_description) {
            throw new Error(`Error on call: [${result.error}] ${result.error_description}`);
        }

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
            let timeStart = (new Date).getTime();
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

            let timeDiff =  510 - ((new Date).getTime() - timeStart);

            if (timeDiff > 0) {
                await sleep(timeDiff);
            }
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