self.addEventListener('push', (event) => {
  let datos = { title: 'POLICALUM', body: 'Tienes un aviso nuevo.', url: '/modules/notificaciones' };
  try {
    datos = { ...datos, ...(event.data ? event.data.json() : {}) };
  } catch (error) {
    datos.body = event.data ? event.data.text() : datos.body;
  }
  event.waitUntil(mostrar(datos.title, datos.body, datos.url));
});

self.addEventListener('message', (event) => {
  const datos = event.data || {};
  if (datos.tipo !== 'mostrar') return;
  event.waitUntil(mostrar(datos.title, datos.body, datos.url));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const ruta = event.notification.data && event.notification.data.url ? event.notification.data.url : '/modules/notificaciones';
  const destino = new URL(ruta, self.location.origin).href;
  event.waitUntil((async () => {
    const abiertas = await clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const ventana of abiertas) {
      await ventana.focus();
      ventana.postMessage({ tipo: 'abrir', url: ruta });
      return;
    }
    await clients.openWindow(destino);
  })());
});

function mostrar(titulo, cuerpo, url) {
  return self.registration.showNotification(titulo || 'POLICALUM', {
    body: cuerpo || 'Tienes un aviso nuevo.',
    tag: 'policalum-erp',
    renotify: true,
    icon: '/POLICALUM.png',
    badge: '/POLICALUM.png',
    data: { url: url || '/modules/notificaciones' },
    silent: false,
    vibrate: [180, 80, 180],
  });
}
