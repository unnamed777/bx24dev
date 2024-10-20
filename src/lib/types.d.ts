interface SessionInstanceData {
    id: number,
    callerTabId: number,
    providerName: string,
    providerPayload: any,
    provider?: SessionAppProviderData,
}

interface SessionAppProviderData {
    tabId: number,
    frameId: number,
    instanceId: number,
    appName: string,
    domain: string,
    appUrl: string,
    type: string,
    auth: B24ApplicationAuthorization,
}

interface B24ApplicationAuthorization {
    accessToken: string,
    domain: string,
    expires_in: number,
    member_id: string,
    refresh_token: string,
}