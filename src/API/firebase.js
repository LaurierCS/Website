import config from "./config.json";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDoc, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


// initalize firebase using firebaseConfig from "./config.json"
// be sure to update/add config.json to the API folder
const firebaseApp = initializeApp(config.firebaseConfig);


const db = getFirestore();
const auth = getAuth();
const storage = getStorage();


/**
 * 
 * Changes the current users profile picture to whatever was uploaded.
 * 
 * @param file The file to upload.
 * @param docId The id to the doc being updated
 * TODO: try/catch
 * 
 */
async function updateProfilePicture(docId, file) {
    const fileRef = ref(storage, "team/" + docId + ".jpg");
    await uploadBytes(fileRef, file);

    const docRef = doc(db, "team", docId);
    const picSrc = await getDownloadURL(fileRef);
    await updateDoc(docRef, { pic: picSrc });
}


export { auth, db, storage, updateProfilePicture };
export default firebaseApp;