importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

var firebaseConfig = {
  apiKey: "AIzaSyDFVzQHeFVdJnhsjikQAdaVCYNabnR7bBM",
  authDomain: "pharmakeeperapp.firebaseapp.com",
  projectId: "pharmakeeperapp",
  storageBucket: "pharmakeeperapp.appspot.com",
  messagingSenderId: "192602918045",
  appId: "1:192602918045:web:f0aa281d8d2bb5efced874"
};


firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon // Add your custom icon here
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});