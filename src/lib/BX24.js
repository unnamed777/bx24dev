export default {
    setAuth(auth) {
        this.auth = auth;
    },

    async request(method, data) {
        data.auth = this.auth.access_token;

        const body = new URLSearchParams({
            ...data,
            auth: this.auth.access_token
        });

        return await fetch(`https://${this.auth.domain}/rest/${method}.json`, {
            method: 'post',
            body,
        }).then(response => response.json());
    },

    async call(method, data = {}) {
        let result = await this.request(method, data);
        return result.result;
    }
}