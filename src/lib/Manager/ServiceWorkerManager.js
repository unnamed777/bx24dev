import AbstractManager from './AbstractManager';
import messageListener from '../MessageListener/swMessageListener';

class ServiceWorkerManager extends AbstractManager {
    constructor(messageListener) {
        super(messageListener);
    }
}

const manager = new ServiceWorkerManager(messageListener);

export default manager;
