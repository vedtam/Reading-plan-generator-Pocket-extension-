self.addEventListener('push', event => {
  const data = event.data.json();
  console.log({data});

  const options = {
    body: data.body,
    icon: 'photo.png',
    image: 'photo.png',
    badge: 'badge.jpeg',
    actions: [
      {
        action: 'coffee-action',
        type: 'button',
        title: 'Coffee',
        icon: 'photo.png',
      },
      {
        action: 'reply',
        type: 'text',
        title: 'Reply',
        icon: 'photo.png',
      }
    ]
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('https://example.com'));
});