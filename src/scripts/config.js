// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_LCS_FIREBASE_APIKEY,
    authDomain: import.meta.env.VITE_LCS_FIREBASE_AUTHDOMAIN,
    databaseURL: import.meta.env.VITE_LCS_FIREBASE_DBURL,
    projectId: import.meta.env.VITE_LCS_FIREBASE_PROJECTID,
    storageBucket: import.meta.env.VITE_LCS_FIREBASE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_LCS_FIREBASE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_LCS_FIREBASE_APPID,
    measurementId: import.meta.env.VITE_LCS_FIREBASE_MEASUREMENTID,
};

export const DB_COLLECTION = 'members';

// Initialize Firebase
export default initializeApp(firebaseConfig);
