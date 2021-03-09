export default class TokenProvider {
    constructor({domain, token}) {
        this.domain = domain;
        this.token = token;
    }

    obtain() {
        this.appName = 'Token';
        this.appUrl = '';
        this.type = 'token';

        this.auth = {
            domain: this.domain,
            access_token: this.token,
        };

        return this.auth;
    }
}