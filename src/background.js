import browser from 'webextension-polyfill';
import Manager from 'lib/Manager';

Manager.init();

browser.browserAction.onClicked.addListener((tab) => {
    // noinspection JSIgnoredPromiseFromCall
    Manager.openByButton({ callerTab: tab });
});