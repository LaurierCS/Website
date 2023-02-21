import firebaseApp from '@scripts/config';
import { getFirestore } from 'firebase/firestore';

export const useFirebaseApp = () => {
    return firebaseApp;
};

const firestore = getFirestore(firebaseApp);

export const useFirestore = () => {
    if (firestore) {
        return firestore;
    }

    return getFirestore(firebaseApp);
};
