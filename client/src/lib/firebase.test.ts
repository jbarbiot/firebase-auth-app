import { describe, it, expect, beforeAll } from 'vitest';
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

describe('Firebase Configuration', () => {
  it('should have all required Firebase environment variables', () => {
    expect(import.meta.env.VITE_FIREBASE_API_KEY).toBeDefined();
    expect(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN).toBeDefined();
    expect(import.meta.env.VITE_FIREBASE_PROJECT_ID).toBeDefined();
    expect(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET).toBeDefined();
    expect(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID).toBeDefined();
    expect(import.meta.env.VITE_FIREBASE_APP_ID).toBeDefined();
  });

  it('should initialize Firebase app successfully', () => {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    const app = initializeApp(firebaseConfig);
    expect(app).toBeDefined();
    expect(app.name).toBe('[DEFAULT]');
  });

  it('should initialize Firebase Auth successfully', () => {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    expect(auth).toBeDefined();
    expect(auth.app).toBe(app);
  });

  it('should initialize Firestore successfully', () => {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    expect(db).toBeDefined();
    expect(db.app).toBe(app);
  });
});
