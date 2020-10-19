import ExtensionRunner from 'lib/ExtensionRunner';

browser.browserAction.onClicked.addListener((tab) => {
    console.log(111);
    // Background page in Firefox doesn't support prompt(), so we do it on the extension tab
    (ExtensionRunner.createInstance({ tab })).run();
    // @todo Destroy instance when extension tab has been closed
});