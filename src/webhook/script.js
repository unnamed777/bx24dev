const submit = () => {
    (window.browser || chrome).runtime.sendMessage(null, {
        type: 'webhookAuthSubmitUrl',
        payload: document.getElementById('url').value,
    });
}

document.getElementById('submit').addEventListener('click', submit);
document.getElementById('url').focus();
