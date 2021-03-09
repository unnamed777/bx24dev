const create = (name, payload) => {
    (window.browser || chrome).runtime.sendMessage(null, {
        type: 'createExtensionInstance',
        payload: {
            providerName: name,
            providerPayload: payload,
        }
    });
}

const webhookSubmit = (e) => {
    e.preventDefault();

    create('webhook', {
        url: document.getElementById('webhookUrl').value,
    });
}

const tokenSubmit = (e) => {
    e.preventDefault();

    create('token', {
        domain: document.getElementById('tokenDomain').value,
        token: document.getElementById('tokenToken').value,
    });
}

document.querySelector('.webhook-form input[name="url"]').focus();
document.querySelector('.webhook-form').addEventListener('submit', webhookSubmit);
document.querySelector('.token-form').addEventListener('submit', tokenSubmit);
