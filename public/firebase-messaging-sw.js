/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

let initialized = false;

function initMessaging(config) {
  if (initialized) return;
  try {
    firebase.initializeApp(config);
    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      const { title, body } = payload.notification || {};
      if (!title) return;

      self.registration.showNotification(title, {
        body: body || "",
        icon: "/icons/brand-icon-transparent.png",
        badge: "/icons/brand-icon-transparent.png",
        data: payload.data,
        tag: payload.data?.dedupeKey || undefined,
      });
    });

    initialized = true;
  } catch (e) {
    // already initialized or error
  }
}

// 메인 앱에서 config 수신
self.addEventListener("message", (event) => {
  if (event.data?.type === "FIREBASE_CONFIG" && event.data.config) {
    initMessaging(event.data.config);
  }
});

// 알림 클릭 → 앱으로 이동
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const deeplink = event.notification.data?.deeplink;
  const url = deeplink ? self.location.origin + deeplink : self.location.origin;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          client.focus();
          client.navigate(url);
          return;
        }
      }
      return clients.openWindow(url);
    })
  );
});
