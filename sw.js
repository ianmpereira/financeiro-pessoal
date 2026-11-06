/* Financeiro - Pessoal — service worker da casca. Não guarda nada em cache: o app sempre vem da rede.
   Recebe as notificações (aporte, resumo do mês) e, ao tocar, abre o app na história certa. */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (ev) { ev.waitUntil(self.clients.claim()); });

self.addEventListener('push', function (ev) {
  var d = {};
  try { d = ev.data ? ev.data.json() : {}; } catch (e) { d = { b: ev.data ? ev.data.text() : '' }; }
  var op = { body: d.b || '', icon: 'icon-192.png', badge: 'favicon-96.png', lang: 'pt-BR', data: d.u || null };
  if (d.tag) { op.tag = d.tag + (d.u && d.u.data ? '-' + d.u.data : d.u && d.u.mes ? '-' + d.u.mes : ''); op.renotify = true; }
  // o iPhone exige que TODO push vire notificação visível; por isso sempre mostra algo
  ev.waitUntil(self.registration.showNotification(d.t || 'Financeiro - Pessoal', op));
});

self.addEventListener('notificationclick', function (ev) {
  ev.notification.close();
  var alvo = ev.notification.data || null;
  ev.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (cs) {
    for (var i = 0; i < cs.length; i++) {
      if (cs[i].url.indexOf(self.registration.scope) === 0) {
        if (alvo) cs[i].postMessage({ fp: 1, tipo: 'abrir', alvo: alvo });
        return cs[i].focus();
      }
    }
    return self.clients.openWindow(self.registration.scope + (alvo ? '#abrir=' + encodeURIComponent(JSON.stringify(alvo)) : ''));
  }));
});
