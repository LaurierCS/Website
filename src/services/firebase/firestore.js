import { getFirestore } from 'firebase/firestore';
import app from './app';

const store = getFirestore(app);
export default store;
