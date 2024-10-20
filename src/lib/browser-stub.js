let stub;

if (typeof browser === 'undefined') {
    stub = chrome;
} else {
    stub = browser;
}

export default stub;