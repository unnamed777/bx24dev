import BX24 from "./lib/BX24";
import ExtensionRunner from 'lib/ExtensionRunner';

browser.browserAction.onClicked.addListener((tab) => {
    (ExtensionRunner.createInstance({tab})).run();
    // @todo Destroy instance when extension tab has been closed
    /*browser.tabs.create({
        url: '/tab/index.html',
        openerTabId: tab.id,
    });*/
});

