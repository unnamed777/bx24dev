(() => {
    const currentScript = document.currentScript;

    const sendResponse = (detail) => {
        document.dispatchEvent(new CustomEvent(`bx24dev_${currentScript.dataset.instanceId}:getAuthResult`, { detail }));
        currentScript.remove();
    };

    if (window.BX24 && window.BX24.placement) {
        // For old js lib (https://api.bitrix24.com/api/v1/) use it's api
        let placementInfo;

        try {
            placementInfo = window.BX24.placement.info();
        } catch (err) {
            placementInfo = null;
        }

        /** @var {Omit<AppProviderGetAuthResult, "instanceId">} */
        const detail = {
            auth: window.BX24.getAuth(),
            placement: placementInfo,
        };

        sendResponse(detail);
    } else {
        // For modern js sdk (b24jssdk) obtain data directly
        if (!document.currentScript.dataset.origin) {
            throw new Error(`bx24dev app provider: origin is not set`);
        }

        if (!document.currentScript.dataset.appSid) {
            throw new Error(`bx24dev app provider: appSid is not set`);
        }

        const abortController = new AbortController();
        const callbackId = `bx24dev_${document.currentScript.dataset.instanceId}_${Math.floor(Math.random() * 1E10)}`;
        const origin = document.currentScript.dataset.origin;

        window.addEventListener('message', (e) => {
            if (!e.data.startsWith(callbackId)) {
                return;
            }

            let initData;

            try {
                initData = JSON.parse(e.data.slice(callbackId.length + 1));
            } catch (err) {
                throw err;
            } finally {
                abortController.abort();
            }

            /** @var {Omit<AppProviderGetAuthResult, "instanceId">} */
            const detail = {
                auth: {
                    access_token: initData.AUTH_ID,
                    domain: initData.DOMAIN,
                    expires_in: initData.AUTH_EXPIRES,
                    refresh_token: initData.REFRESH_ID,
                    member_id: initData.MEMBER_ID,
                },
                placement: {
                    placement: initData.PLACEMENT,
                    options: initData.PLACEMENT_OPTIONS,
                },
            };

            sendResponse(detail);
        }, { signal: abortController.signal });

        parent.postMessage(`getInitData:${callbackId}:${document.currentScript.dataset.appSid}`, origin);
    }
})();