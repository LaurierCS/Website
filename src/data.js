import { db } from "./API/firebase";
import { query, getDocs, collection } from "firebase/firestore";

const allDocsData = [];
const q = query(collection(db, "team"));
const querySnapshot = getDocs(q);
if (!querySnapshot) {
  querySnapshot.forEach((doc) => { allDocsData.push(doc.data()) });
}

export default allDocsData;
