import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const requiredFirebaseEnv = {
  VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID
};

const missingFirebaseEnv = Object.entries(requiredFirebaseEnv)
  .filter(([, value]) => !value || !String(value).trim())
  .map(([name]) => name);

if (missingFirebaseEnv.length > 0) {
  throw new Error(
    `Configuração do Firebase incompleta. Variáveis ausentes: ${missingFirebaseEnv.join(', ')}. ` +
      'Configure-as no .env local e nas Environment Variables do Render e faça um novo deploy.'
  );
}

const firebaseConfig = {
  apiKey: String(requiredFirebaseEnv.VITE_FIREBASE_API_KEY).trim(),
  authDomain: String(requiredFirebaseEnv.VITE_FIREBASE_AUTH_DOMAIN).trim(),
  projectId: String(requiredFirebaseEnv.VITE_FIREBASE_PROJECT_ID).trim(),
  storageBucket: String(requiredFirebaseEnv.VITE_FIREBASE_STORAGE_BUCKET).trim(),
  messagingSenderId: String(requiredFirebaseEnv.VITE_FIREBASE_MESSAGING_SENDER_ID).trim(),
  appId: String(requiredFirebaseEnv.VITE_FIREBASE_APP_ID).trim()
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
  auth,
  db,
  storage,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc
};
