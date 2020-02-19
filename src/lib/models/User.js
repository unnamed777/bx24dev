import AbstractEntity from 'lib/models/AbstractEntity';

export default class User extends AbstractEntity {
    static get listEndpoint() {
        return 'user.get';
    }

    static applyModifiers(entry) {
        super.applyModifiers(entry);

        entry.FULL_NAME = ((entry.LAST_NAME || '') + ' ' + (entry.NAME || '')).replace(/^\s*/, '').replace(/\s+$/, '');

        if (entry.FULL_NAME === '') {
            entry.FULL_NAME = entry.EMAIL;
        }
    }
}