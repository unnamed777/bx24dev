import manager from 'lib/Manager/ServiceWorkerManager';
console.log('SW: Start');

self.addEventListener('install', (event) => {
    console.log('SW: install event');
    event.waitUntil(Promise.resolve());
    //event.waitUntil(enableNavigationPreload());
});

self.addEventListener('activate', (event) => {
    console.log('SW: activate event');
    event.waitUntil(Promise.resolve());
  //event.waitUntil(enableNavigationPreload());
});

self.addEventListener('message', (event) => {
    if (!event.ports[0]) {
        console.warn('Got message with empty ports');
        return;
    }

    console.log('SW message data', event.data);
});