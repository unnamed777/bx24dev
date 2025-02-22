import { createApp } from "vue";
import App from "@popup/App";
import browser from "lib/browser-stub";

/**
 * @param {CreateExtensionInstanceMessagePayload} payload
 * @returns {Promise<void>}
 */
const createExtensionInstance = async (payload) => {
    await browser.runtime.sendMessage(null, {
        type: 'createExtensionInstance',
        payload,
    });
};

const openLoginPage = async () => {
    await browser.runtime.sendMessage(null, {
        type: 'openLoginPage',
    });
};

const findEntrypoint = async (callerTab) => {
    let providerName = null;
    let providerPayload = {};
    /** @var {CreateExtensionInstanceMessagePayload[]} */
    let activeApps = [];

    if (/\/devops\/edit\/application\/\d+\//.test(callerTab.url)) {
        // "Edit app" page
        // noinspection JSVoidFunctionReturnValueUsed
        let frames = await browser.webNavigation.getAllFrames({ tabId: callerTab.id });
        let frameFound = false;
        let frame;

        for (frame of frames) {
            if (/\/devops\/edit\/application\/\d+\/\?.*IFRAME.*/.test(frame.url) !== false) {
                frameFound = true;
                break;
            }
        }

        if (frameFound) {
            providerPayload.tabId = callerTab.id;
            providerPayload.frameId = frame.frameId;
        }

        providerName = 'grabOauth';
    } else if (
        /\/marketplace\/app\//i.test(callerTab.url) !== false
        || /\/crm\/deal\/details\//i.test(callerTab.url) !== false
        || /\/crm\/contact\/details\//i.test(callerTab.url) !== false
        || /\/crm\/company\/details\//i.test(callerTab.url) !== false
        || /\/crm\/lead\/details\//i.test(callerTab.url) !== false
        || /\/crm\/type\/\d+\/details\//i.test(callerTab.url) !== false
    ) {
        console.log('*.bitrix24.ru app');
        // App's page or a page that supports placements
        let frames = await browser.webNavigation.getAllFrames({ tabId: callerTab.id });

        for (let frame of frames) {
            if (/\?DOMAIN=.*APP_SID=/gi.test(frame.url) === false) {
                continue;
            }

            let appName = null;

            if (/\/marketplace\/app\//i.test(callerTab.url) !== false) {
                appName = callerTab.title;
            } else {
                let result = (await browser.scripting.executeScript({
                    target: {
                        tabId: callerTab.id,
                        frameIds: [frame.frameId],
                    },
                    func: () => {
                        let placementInfo;

                        try {
                            placementInfo = BX24.placement.info();
                        } catch (err) {
                            placementInfo = null;
                        }

                        return placementInfo;
                    },
                    world: browser.scripting.ExecutionWorld.MAIN,
                }));

                if (result[0]) {
                    let placementInfo = result[0].result;

                    switch (placementInfo.placement) {
                        case 'DEFAULT':
                            // App in slider
                            // Do nothing
                            break;

                        case 'USERFIELD_TYPE':
                            appName = `Поле ${placementInfo.options.FIELD_NAME}`;
                            break;

                        default:
                            appName = placementInfo.placement;
                    }
                } else {
                    appName = 'Встройка в ' + callerTab.title;
                }
            }

            console.log(appName);

            activeApps.push({
                providerName: 'app',
                tabId: callerTab.id,
                providerPayload: {
                    tabId: callerTab.id,
                    frameId: frame.frameId,
                    portal: /\/\/(.*?)\//gi.exec(callerTab.url)[1],
                    appUrl: frame.url,
                    appName: appName,
                },
            });
        }

        console.log('activeApps', activeApps);

        if (activeApps.length === 1) {
            providerName = activeApps[0].providerName;
            providerPayload = activeApps[0].providerPayload;
        }
    }

    console.log('provider', providerName, providerPayload);

    return {
        providerName,
        providerPayload,
        activeApps,
    };
};

const initPickerApp = (apps) => {
    window.app = createApp(App, {
        apps: apps,
        createExtensionInstance,
    }).mount('#app');
};

(async () => {
    const callerTab = (await browser.tabs.query({ active: true }))[0];
    console.log('Popup opened, tabId %d', callerTab.id);

    const result = await findEntrypoint(callerTab);

    if (result.providerName) {
        await createExtensionInstance({
            tabId: callerTab.id,
            providerName: result.providerName,
            providerPayload: result.providerPayload,
        });

        // Won't for Android, need to call tabs.remove()
        window.close();
    } else if (result.activeApps.length > 1) {
        initPickerApp(result.activeApps);
    } else {
        await openLoginPage();
        window.close();
    }
})();