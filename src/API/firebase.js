import config from "./config.json";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// initalize firebase using firebaseConfig from "./config.json"
// be sure to update/add config.json to the API folder
const firebaseApp = initializeApp(config.firebaseConfig);


const db = getFirestore();
const auth = getAuth();
const storage = getStorage();



export { auth, db, storage };
export default firebaseApp;