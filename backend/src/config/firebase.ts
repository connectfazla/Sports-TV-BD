import admin from 'firebase-admin';
import { env } from './env';

let firebaseApp: admin.app.App | null = null;

export function getFirebaseApp(): admin.app.App {
  if (firebaseApp) return firebaseApp;

  if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_PRIVATE_KEY || !env.FIREBASE_CLIENT_EMAIL) {
    console.warn('Firebase credentials not configured — push notifications disabled');
    // Return a dummy app that won't crash but won't send notifications
    throw new Error('Firebase not configured');
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
    }),
  });

  return firebaseApp;
}
