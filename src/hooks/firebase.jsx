import { app } from '@scripts/firebase';
import { getFirestore } from 'firebase/firestore';

export const useFirebaseApp = () => {
    return app;
};

const firestore = getFirestore(app);

export const useFirestore = () => {
    if (firestore) {
        return firestore;
    }

    return getFirestore(app);
};
