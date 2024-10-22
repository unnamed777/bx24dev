import AbstractOAuthProvider from 'lib/AuthProvider/AbstractOAuthProvider';

export default class ClassicOAuthProvider extends AbstractOAuthProvider {
    constructor(args) {
        super(args);

        this.credentials = {
            appName: args.appName,
            appUrl: args.appUrl,
            domain: args.domain,
            clientId: args.clientId,
            clientSecret: args.clientSecret,
        };
    }

    /**
     * @returns {Promise<B24Auth>}
     */
    async obtain() {
        return await this.authorize();
    }
}