import BX24 from "./lib/BX24";
import ExtensionRunner from 'lib/ExtensionRunner';

browser.browserAction.onClicked.addListener((tab, onClickData) => {
    let mode;

    if (onClickData.modifiers.indexOf('Command') !== -1 || onClickData.modifiers.indexOf('Ctrl') !== -1) {
        mode  = 'webhook';
    } else {
        mode = 'oauth';
    }

    // Background page in Firefox doesn't support prompt(), so we do it on the extension tab
    (ExtensionRunner.createInstance({tab, mode})).run();
    // @todo Destroy instance when extension tab has been closed
    /*browser.tabs.create({
        url: '/tab/index.html',
        openerTabId: tab.id,
    });*/
});

