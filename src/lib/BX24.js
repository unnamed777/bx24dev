import qs from 'qs';

export default {
    setAuth(auth) {
        this.auth = auth;
    },

    async request(method, data) {
        data.auth = this.auth.access_token;
        console.log(data);

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
        let result = await this.request(method, data);
        return result.result;
    }
}