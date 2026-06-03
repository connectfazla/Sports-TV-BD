import { getFirebaseApp } from '../config/firebase';
import { query } from '../config/database';
import { logger } from '../utils/logger';

export async function sendPushNotification(params: {
  title: string;
  body: string;
  imageUrl?: string;
  deepLink?: string;
  targetRoles?: string[];
}): Promise<number> {
  let app;
  try {
    app = getFirebaseApp();
  } catch {
    logger.warn('Firebase not configured, skipping push notification');
    return 0;
  }

  const roles = params.targetRoles ?? ['user', 'premium'];
  const { rows: users } = await query(
    `SELECT DISTINCT fcm_token FROM users WHERE role = ANY($1) AND fcm_token IS NOT NULL AND is_banned = false`,
    [roles]
  );

  const tokens = users.map((u) => (u as { fcm_token: string }).fcm_token).filter(Boolean);
  if (!tokens.length) return 0;

  const messaging = app.messaging();
  const chunks: string[][] = [];
  for (let i = 0; i < tokens.length; i += 500) {
    chunks.push(tokens.slice(i, i + 500));
  }

  let sent = 0;
  for (const chunk of chunks) {
    try {
      const result = await messaging.sendEachForMulticast({
        tokens: chunk,
        notification: { title: params.title, body: params.body, imageUrl: params.imageUrl },
        data: params.deepLink ? { deepLink: params.deepLink } : {},
        android: { priority: 'high' },
      });
      sent += result.successCount;
    } catch (err) {
      logger.error({ err }, 'FCM batch send error');
    }
  }

  return sent;
}
