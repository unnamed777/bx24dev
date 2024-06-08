import md5 from "md5";

export const LOCAL_STORAGE_SAVED_KEY = 'bx24dev.saved';
export const SESSION_STORAGE_ACTIVE_KEY = 'bx24dev.active';

/**
 * @typedef {Object} StorageActiveConnection
 * @property {String} title
 * @property {String} portal
 * @property {String} authType
 * @property {Object} auth
 */

/**
 * @returns {Object<key, StorageActiveConnection>}
 */
const getActiveConnections = () => {
    let items = window.sessionStorage.getItem(SESSION_STORAGE_ACTIVE_KEY);

    if (items === null) {
        items = {};
    } else {
        try {
            items = JSON.parse(items);
        } catch (ex) {
            items = {};
        }
    }

    return items;
};

/**
 * @param authId
 * @returns {StorageActiveConnection|null}
 */
export const getActiveConnectionByAuthId = (authId) => {
    let items = getActiveConnections();
    return items[authId] || null;
};

/**
 * @param {String} authId
 * @param {StorageActiveConnection} authData
 */
export const addToActiveConnections = (authId, authData) => {
    let items = getActiveConnections();
    items[authId] = authData;
    window.sessionStorage.setItem(SESSION_STORAGE_ACTIVE_KEY, JSON.stringify(items));
};

export const removeFromActiveConnections = (authId) => {
    let items = getActiveConnections();
    delete items[authId];
    window.sessionStorage.setItem(SESSION_STORAGE_ACTIVE_KEY, JSON.stringify(items));
};

/**
 * @typedef {Object} SavedConnection
 * @property {String} id
 * @property {String} type
 * @property {Object} credentials
 */

/**
 * @returns {SavedConnection[]}
 */
export const getSavedConnections = () => {
    let savedItems = window.localStorage.getItem(LOCAL_STORAGE_SAVED_KEY);

    if (savedItems === null) {
        savedItems = [];
    } else {
        try {
            savedItems = JSON.parse(savedItems);
        } catch (ex) {
            console.error('Failed to parse savedItems', ex);
        }

        if (!Array.isArray(savedItems)) {
            savedItems = [];
        }
    }

    return savedItems;
}

/**
 * @param {AuthorizationData} item
 */
export const addToSavedConnections = (item) => {
    /** @var {SavedConnection} newItem */
    let newItem;

    switch (item.authType) {
        case 'webhook':
            newItem = {
                type: 'webhook',
                id: getUniqIdByCredentials('webhook', item.auth),
                credentials: item.auth,
            };
            break;

        default:
            throw new Error('Unsupported provider');
    }

    let savedItems = getSavedConnections();

    if (savedItems.map(item => item.id).includes(newItem.id)) {
        console.warn('The auth already saved');
        return;
    }

    savedItems.push(newItem);
    window.localStorage.setItem(LOCAL_STORAGE_SAVED_KEY, JSON.stringify(savedItems));
};

export const removeFromSavedConnections = (id) => {
    let savedItems = getSavedConnections();

    for (let index in savedItems) {
        let item = savedItems[index];

        if (item.id === id) {
            savedItems = savedItems.slice(0, index).concat(savedItems.slice(index + 1));
            break;
        }
    }

    window.localStorage.setItem(LOCAL_STORAGE_SAVED_KEY, JSON.stringify(savedItems));
};

/**
 * @param {string} type
 * @param {Object} credentials
 * @returns {string}
 */
export const getUniqIdByCredentials = (type, credentials) => {
    switch (type) {
        case 'webhook':
            return md5(credentials.url);

        default:
            throw new Error('Unknown type of credentials');
    }
};

/**
 * @param {AuthorizationData} item
 * @returns {boolean}
 */
export const existsInSavedConnections = (item) => {
    const id = getUniqIdByCredentials(item.authType, item.auth);
    let items = getSavedConnections();

    for (let index in items) {
        let item = items[index];

        if (item.id === id) {
            return true;
        }
    }

    return false;
};