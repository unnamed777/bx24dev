(typeof browser === 'undefined' ? chrome : browser).runtime.sendMessage({
    type: 'oauthCallback',
    params: Object.fromEntries(new URLSearchParams(document.location.hash.slice(1))),
});
