// src/firebase/config.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// ВСТАВЬТЕ ВАШ КОНФИГ СЮДА
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // для Vite
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Инициализируем Firebase
const app = initializeApp(firebaseConfig);

// Экспортируем сервисы
export const auth = getAuth(app);
export const db = getDatabase(app);
