/* Financeiro - Pessoal — service worker da casca. Não guarda nada em cache: o app sempre vem da rede. */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (ev) { ev.waitUntil(self.clients.claim()); });
