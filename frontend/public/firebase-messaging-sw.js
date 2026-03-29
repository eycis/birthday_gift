/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBzTiGz5qz6vu71h4p-oHlViTP1cR2-340',
  authDomain: 'birthday-app-cb6e2.firebaseapp.com',
  projectId: 'birthday-app-cb6e2',
  storageBucket: 'birthday-app-cb6e2.firebasestorage.app',
  messagingSenderId: '280603077226',
  appId: '1:280603077226:web:3f37e40adb9b50dc0ff813'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Daily Letter';
  const body = payload.notification?.body || 'Mas novou zpravu dne.';

  self.registration.showNotification(title, {
    body,
    icon: '/icons/icon-192x192.png'
  });
});
