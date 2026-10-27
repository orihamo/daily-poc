/* Daily 5 proof of concept: shows every push and opens the app on tap. Safari revokes a push
   subscription that receives a push without a visible notification, so showNotification always runs. */
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener("push", function (event) {
  var data = {};
  try { data = event.data ? event.data.json() : {}; } catch (err) { data = {}; }
  var title = data.title || "Daily 5";
  var opts = {
    body: data.body || "חמש שאלות, שלוש דקות.",
    icon: "icon-192.png",
    badge: "icon-192.png",
    lang: "he",
    dir: "rtl",
    tag: "daily5",
    data: { url: data.url || "./" }
  };
  event.waitUntil(self.registration.showNotification(title, opts));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  var target = new URL((event.notification.data && event.notification.data.url) || "./", self.registration.scope).href;
  event.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) {
      if ("focus" in list[i]) return list[i].focus();
    }
    return self.clients.openWindow(target);
  }));
});
