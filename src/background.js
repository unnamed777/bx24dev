import browser from 'webextension-polyfill';
import manager from 'lib/Manager/ExtensionManager';

browser.browserAction.onClicked.addListener((tab) => {
    // noinspection JSIgnoredPromiseFromCall
    manager.openByButton({ callerTab: tab });
});