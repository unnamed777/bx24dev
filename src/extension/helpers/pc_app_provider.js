let placementInfo;

try {
    placementInfo = BX24.placement.info();
} catch (err) {
    placementInfo = null;
}

/** @var {Omit<AppProviderGetAuthResult, "instanceId">} */
const detail = {
    auth: BX24.getAuth(),
    placement: placementInfo,
};

document.dispatchEvent(new CustomEvent(`bx24dev_${document.currentScript.dataset.instanceId}:getAuthResult`, { detail }));
document.currentScript.remove();