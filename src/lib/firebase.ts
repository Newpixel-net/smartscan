import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Check if we have Firebase configuration
const hasFirebaseConfig =
  typeof window !== 'undefined' &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'your_api_key_here';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};

// Initialize Firebase (singleton pattern with lazy loading)
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let initialized = false;

function initializeFirebase() {
  // Only initialize on client side and if config exists
  if (typeof window === 'undefined') {
    return { app: null, auth: null, db: null, storage: null };
  }

  if (initialized) {
    return { app, auth, db, storage };
  }

  // Check for required config
  if (!firebaseConfig.apiKey) {
    console.warn(
      'Firebase API key is missing. Please set up your .env.local file with Firebase configuration.'
    );
    return { app: null, auth: null, db: null, storage: null };
  }

  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    initialized = true;
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return { app: null, auth: null, db: null, storage: null };
  }

  return { app, auth, db, storage };
}

// Lazy initialization - only initialize when accessed
export function getFirebaseApp(): FirebaseApp | null {
  if (!app && typeof window !== 'undefined') {
    initializeFirebase();
  }
  return app;
}

export function getFirebaseAuth(): Auth | null {
  if (!auth && typeof window !== 'undefined') {
    initializeFirebase();
  }
  return auth;
}

export function getFirebaseDb(): Firestore | null {
  if (!db && typeof window !== 'undefined') {
    initializeFirebase();
  }
  return db;
}

export function getFirebaseStorage(): FirebaseStorage | null {
  if (!storage && typeof window !== 'undefined') {
    initializeFirebase();
  }
  return storage;
}

// For backwards compatibility - these will be null during SSR/build
export { app, auth, db, storage };
