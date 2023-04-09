const publicVapidKey = 'BO15RG6-GR_TWCkc-ql__dOzu_5eX0ryEROVzmlGQ2z183P0VeLbhFi-jRbz_-ajon-EbaUgfSlP-sITKI1Crjo';

document.querySelector('#subscribe').addEventListener('click', subscribe);

async function subscribe() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    const res = await askPermission();
    alert(res)
    const subscription = await registerServiceWorker();
    if (subscription) {
      await subscribeUserToPush(subscription);
    }
  } else {
    console.error('Service Worker and Push is not supported');
    alert('Service Worker and Push is not supported')
  }
}

function askPermission() {
  return new Promise(function (resolve, reject) {
    const permissionResult = Notification.requestPermission(function (result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then(function (permissionResult) {
    if (permissionResult !== 'granted') {
      throw new Error("We weren't granted permission.");
    }
  });
}

async function registerServiceWorker() {
  const registration = await navigator.serviceWorker.register('/service-worker.js');
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });
  return subscription;
}

async function subscribeUserToPush(subscription) {
  try {
    await fetch('/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: {
        'content-type': 'application/json',
      },
    });

  } catch (error) {
    console.error(error);
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}