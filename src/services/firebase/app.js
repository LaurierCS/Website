import { initializeApp } from 'firebase/app';

const app = initializeApp({
    apiKey: import.meta.env.VITE_LCS_FIREBASE_APIKEY,
    authDomain: import.meta.env.VITE_LCS_FIREBASE_AUTHDOMAIN,
    databaseURL: import.meta.env.VITE_LCS_FIREBASE_DBURL,
    projectId: import.meta.env.VITE_LCS_FIREBASE_PROJECTID,
    storageBucket: import.meta.env.VITE_LCS_FIREBASE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_LCS_FIREBASE_MESSAGINGSNEDERID,
    appId: import.meta.env.VITE_LCS_FIREBASE_APPID,
    measurementId: import.meta.env.VITE_LCS_FIREBASE_MEASRUEMENTID,
});

export default app;
