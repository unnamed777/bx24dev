import create from './factory';

const messageListener = create({
    addListener: addEventListener,
    removeListener: removeEventListener,
});

messageListener.init();

export default messageListener;