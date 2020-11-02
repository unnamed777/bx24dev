import browser from 'webextension-polyfill';
import ExtensionRunner from 'lib/ExtensionRunner';

browser.browserAction.onClicked.addListener((tab) => {
    (ExtensionRunner.createInstance({ tab })).run();
});