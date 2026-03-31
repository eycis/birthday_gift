const admin = require('firebase-admin');

const PRAGUE_TIMEZONE = 'Europe/Prague';
const APP_LINK = process.env.APP_LINK || 'https://birthday-app-cb6e2.web.app';
const DELIVERY_WINDOW_START_HOUR = 10;
const DELIVERY_WINDOW_START_MINUTE = 17;
const DELIVERY_WINDOW_END_HOUR = 11;
const DELIVERY_WINDOW_END_MINUTE = 29;

function readServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_B64;

  if (raw) {
    return JSON.parse(raw);
  }

  if (b64) {
    const decoded = Buffer.from(b64, 'base64').toString('utf8');
    return JSON.parse(decoded);
  }

  throw new Error(
    'Missing FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_JSON_B64 in environment.'
  );
}

function datePartsInPrague(now = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: PRAGUE_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const parts = formatter.formatToParts(now);
  const map = Object.fromEntries(parts.filter((p) => p.type !== 'literal').map((p) => [p.type, p.value]));

  return {
    dayKey: `${map.year}-${map.month}-${map.day}`,
    hour: Number(map.hour),
    minute: Number(map.minute)
  };
}

function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash * 31) + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function pickDailyMessage(messages, dayKey) {
  if (!messages.length) {
    return null;
  }

  const index = hashString(dayKey) % messages.length;
  return messages[index];
}

function isInDeliveryWindow(hour, minute) {
  const currentMinuteOfDay = (hour * 60) + minute;
  const startMinuteOfDay = (DELIVERY_WINDOW_START_HOUR * 60) + DELIVERY_WINDOW_START_MINUTE;
  const endMinuteOfDay = (DELIVERY_WINDOW_END_HOUR * 60) + DELIVERY_WINDOW_END_MINUTE;

  return currentMinuteOfDay >= startMinuteOfDay && currentMinuteOfDay <= endMinuteOfDay;
}

async function sendDailyNotifications() {
  const serviceAccount = readServiceAccount();
  const projectId = process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id;
  const forceSend = process.env.FORCE_SEND === '1';

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId
  });

  const db = admin.firestore();
  const { dayKey, hour, minute } = datePartsInPrague();
  const inDeliveryWindow = isInDeliveryWindow(hour, minute);

  if (!forceSend && !inDeliveryWindow) {
    console.log(
      `[SKIP] Prague time is ${hour}:${String(minute).padStart(2, '0')}, waiting for window `
      + `${DELIVERY_WINDOW_START_HOUR}:${String(DELIVERY_WINDOW_START_MINUTE).padStart(2, '0')}-`
      + `${DELIVERY_WINDOW_END_HOUR}:${String(DELIVERY_WINDOW_END_MINUTE).padStart(2, '0')}.`
    );
    return;
  }

  const logRef = db.collection('notification_dispatch_logs').doc(dayKey);
  const existingLog = await logRef.get();
  if (existingLog.exists && !forceSend) {
    console.log(`[SKIP] Notifications already sent for ${dayKey}.`);
    return;
  }

  const messagesSnapshot = await db.collection('messages').orderBy('dayNumber', 'asc').get();
  const messages = messagesSnapshot.docs
    .map((doc) => doc.data())
    .filter((message) => typeof message.title === 'string' && typeof message.body === 'string');

  const message = pickDailyMessage(messages, dayKey);
  if (!message) {
    console.log('[SKIP] No messages found in Firestore collection "messages".');
    return;
  }

  const tokensSnapshot = await db.collection('notification_tokens').get();
  const tokens = tokensSnapshot.docs
    .map((doc) => doc.get('token'))
    .filter((token) => typeof token === 'string' && token.length > 0);

  if (!tokens.length) {
    console.log('[SKIP] No notification tokens found.');
    return;
  }

  let sentCount = 0;
  let failedCount = 0;
  const invalidTokens = [];

  for (let i = 0; i < tokens.length; i += 500) {
    const chunk = tokens.slice(i, i + 500);
    const response = await admin.messaging().sendEachForMulticast({
      tokens: chunk,
      notification: {
        title: message.title || 'Message of the day',
        body: message.body
      },
      webpush: {
        fcmOptions: {
          link: APP_LINK
        }
      }
    });

    sentCount += response.successCount;
    failedCount += response.failureCount;

    response.responses.forEach((item, index) => {
      if (!item.success && item.error) {
        const code = item.error.code || '';
        if (
          code === 'messaging/registration-token-not-registered'
          || code === 'messaging/invalid-argument'
        ) {
          invalidTokens.push(chunk[index]);
        }
      }
    });
  }

  if (invalidTokens.length) {
    const batch = db.batch();
    invalidTokens.forEach((token) => {
      batch.delete(db.collection('notification_tokens').doc(token));
    });
    await batch.commit();
  }

  if (sentCount === 0) {
    console.log(
      `[WARN] ${dayKey}: no notifications were delivered successfully `
      + `(failed=${failedCount}, tokens=${tokens.length}). Leaving day unsent for later retries.`
    );
    return;
  }

  await logRef.set({
    dayKey,
    sentCount,
    failedCount,
    tokenCount: tokens.length,
    messageTitle: message.title,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  console.log(`[OK] ${dayKey}: sent=${sentCount}, failed=${failedCount}, tokens=${tokens.length}`);
}

sendDailyNotifications().catch((error) => {
  console.error('[ERROR] Failed to send notifications:', error);
  process.exit(1);
});
