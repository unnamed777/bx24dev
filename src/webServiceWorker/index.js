import { init } from 'lib/Manager/ServiceWorkerManager';
console.log('SW: Executing');

self.addEventListener('install', (event) => {
    console.log('SW: event "install"');
    //event.waitUntil(Promise.resolve());
    //event.waitUntil(enableNavigationPreload());
});

self.addEventListener('activate', (event) => {
    console.log('SW: event "activate"');
    //event.waitUntil(Promise.resolve());
    init();
    console.log('clients.claim() before');
    event.waitUntil(clients.claim());
    console.log('clients.claim() after');
});