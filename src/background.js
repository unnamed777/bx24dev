browser.browserAction.onClicked.addListener((tab) => {
    browser.tabs.create({
        url: '/tab/index.html',
        openerTabId: tab.id,
    });
});

