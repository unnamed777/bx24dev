interface SessionInstanceData {
    id: number,
    callerTabId: number,
    providerName: string,
    providerPayload: any,
    provider?: SessionAppProviderData,
}

interface BasicTokenProviderData {
    tabId: number,
    frameId: number,
    instanceId: number,
    appName: string,
    domain: string,
    appUrl: string,
    type: string,
    auth: B24ApplicationAuthorization,
}

interface SessionAppProviderData extends BasicTokenProviderData {
    appSid: string;
}

interface FullOAuthProviderData extends BasicTokenProviderData {
}

interface WebhookAuthProviderData {
    appName: string,
    domain: string,
    type: string,
    auth: {
        url: string,
        domain: string,
        userId: string,
        key: string,
    },
    credentials: {
        url: string,
    },
}

interface TokenAuthProviderData {
    appName: string,
    appUrl: string,
    type: string,
    auth: {
        domain: string,
        access_token: string,
    },
}

interface B24ApplicationAuthorization {
    access_token: string,
    domain: string,
    expires_in: number,
    member_id: string,
    refresh_token: string,
}

interface MessageListener {
    subscribe: (type: string, callback: (payload: any, sender: any, sendResponse: Function) => void) => void,
    unsubscribe: (type: string) => void,
}

interface CreateExtensionInstanceMessagePayload {
    tabId: number,
    providerName: string,
    providerPayload: any,
}

interface AppProviderGetAuthResult {
    instanceId: number,
    auth: B24ApplicationAuthorization ,
    placement?: {
        placement: string,
        options: any,
    },
}