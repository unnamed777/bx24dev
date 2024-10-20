//import browser from 'webextension-polyfill';
import browser from 'lib/browser-stub';
import manager from 'lib/Manager/ExtensionManager';

browser.action.onClicked.addListener((tab) => {
    console.log('Background: action.onClicked');
    // noinspection JSIgnoredPromiseFromCall
    manager.openByButton({ callerTab: tab });
})