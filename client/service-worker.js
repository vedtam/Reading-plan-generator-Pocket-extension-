self.addEventListener('push', event => {
  const data = event.data.json();

  console.log({data});

  const options = {
    body: data.body,
    icon: 'badge.png',
    image: data.img,
    badge: 'badge.png',
    data,
    actions: [
      {
        action: 'pocket-action',
        type: 'button',
        title: 'Show in Pocket',
        // icon: 'photo.png',
      },
      // {
      //   action: 'reply',
      //   type: 'text',
      //   title: 'Reply',
      //   icon: 'photo.png',
      // }
    ]
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // console.log({event});

  if (event.action === 'pocket-action') {
    event.waitUntil(clients.openWindow('https://getpocket.com/read/' + event.notification.data.item_id));
  } else {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});