import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let adminApp: App;
let adminAuth: Auth;
let adminDb: Firestore;

function initializeAdminApp() {
  if (getApps().length === 0) {
    // Securely handle private key (supports both escaped and actual newlines)
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY
      ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')
      : undefined;

    if (!process.env.FIREBASE_ADMIN_PROJECT_ID || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || !privateKey) {
      throw new Error(
        'Missing Firebase Admin credentials. Ensure FIREBASE_ADMIN_PROJECT_ID, ' +
        'FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY are set.'
      );
    }

    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  } else {
    adminApp = getApps()[0];
  }

  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp);

  return { adminApp, adminAuth, adminDb };
}

// Lazy initialization to avoid issues during build time
export function getAdminAuth(): Auth {
  if (!adminAuth) {
    initializeAdminApp();
  }
  return adminAuth;
}

export function getAdminDb(): Firestore {
  if (!adminDb) {
    initializeAdminApp();
  }
  return adminDb;
}

export function getAdminApp(): App {
  if (!adminApp) {
    initializeAdminApp();
  }
  return adminApp;
}
