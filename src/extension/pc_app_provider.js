console.log('page context script', document.currentScript.dataset.instanceId);
document.dispatchEvent(new CustomEvent(`bx24dev_${document.currentScript.dataset.instanceId}:getAuthResult`, { detail: BX24.getAuth() }));
