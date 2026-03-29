import { Injectable, inject } from '@angular/core';
import { Firestore, doc, serverTimestamp, setDoc } from '@angular/fire/firestore';
import { getApp } from 'firebase/app';
import { getMessaging, getToken, isSupported, Messaging, onMessage } from 'firebase/messaging';
import { environment } from '../../environments/environment';

export type NotificationSetupStatus =
  | 'enabled'
  | 'unsupported'
  | 'denied'
  | 'missing-vapid-key'
  | 'error';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private readonly firestore = inject(Firestore);
  private foregroundListenerAttached = false;

  async enableDailyNotifications(): Promise<NotificationSetupStatus> {
    if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) {
      return 'unsupported';
    }

    const messagingSupported = await isSupported().catch(() => false);
    if (!messagingSupported) {
      return 'unsupported';
    }

    const vapidKey = environment.firebase.vapidKey;
    if (!vapidKey || vapidKey.includes('PASTE_YOUR_WEB_PUSH_CERTIFICATE_KEY')) {
      return 'missing-vapid-key';
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return 'denied';
    }

    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/firebase-cloud-messaging-push-scope'
      });

      const messaging = getMessaging(getApp());
      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: registration
      });

      if (!token) {
        return 'error';
      }

      await setDoc(
        doc(this.firestore, 'notification_tokens', token),
        {
          token,
          ua: navigator.userAgent,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );

      this.listenForegroundMessages(messaging);
      return 'enabled';
    } catch {
      return 'error';
    }
  }

  async initForegroundNotifications(): Promise<void> {
    const messagingSupported = await isSupported().catch(() => false);
    if (!messagingSupported) {
      return;
    }

    const messaging = getMessaging(getApp());
    this.listenForegroundMessages(messaging);
  }

  private listenForegroundMessages(messaging: Messaging): void {
    if (this.foregroundListenerAttached) {
      return;
    }

    onMessage(messaging, (payload) => {
      const title = payload.notification?.title ?? 'Daily Letter';
      const body = payload.notification?.body ?? 'Mas novou zpravu dne.';

      if (Notification.permission === 'granted') {
        new Notification(title, { body });
      }
    });

    this.foregroundListenerAttached = true;
  }
}
