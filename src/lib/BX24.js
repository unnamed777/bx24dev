import qs from 'qs';

export default {
    setAuth(auth) {
        this.auth = auth;
    },

    async request(method, data) {
        data.auth = this.auth.access_token;
        //console.log(data);

        // URLSearchParams doesn't support nested objects, use qs
        const body = qs.stringify(data);

        return await fetch(`https://${this.auth.domain}/rest/${method}.json`, {
            method: 'post',
            body,
        }).then(response => response.json());
    },

    async call(method, data = {}) {
        let result = await this.request(method, data);
        return result.result;
    },

    async fetch(method, data = {}) {
        return this.call(method, data);
    },

    async fetchAll(method, data = {}) {
        let items = [];
        let limit = null;

        if (data._limit) {
            limit = data._limit;
            delete data._limit;
        }

        while (true) {
            let response = await this.request(method, data);

            if (response.error) {
                alert(response.error_description + `(${response.error})`);
                throw new Error('BX24 Error: ' + response.error_description);
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

        return items;
    },
}