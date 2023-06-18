import browser from 'webextension-polyfill';
import create from './factory';

const messageListener = create({
    addListener: browser.runtime.onMessage.addListener,
    removeListener: browser.runtime.onMessage.removeListener,
});

messageListener.init();

export default messageListener;