import { useCallback, useContext } from 'react';
import {
    getAuth,
    signOut as firebaseSignOut,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { app } from '@scripts/firebase';
import { AuthContext } from '@contexts/AuthContext';

export const useSession = () => {
    const { currentUser } = useContext(AuthContext);

    if (!currentUser) {
        console.warn(
            '`useSession` being used before successful authentication.'
        );
    }

    return currentUser;
};

export const useAuth = () => {
    const signIn = useCallback(async (email, password) => {
        const user = await signInWithEmailAndPassword(
            getAuth(app),
            email,
            password
        );
        return user;
    });

    const signOut = useCallback(async () => {
        await firebaseSignOut(getAuth(app));
    });

    return { signIn, signOut };
};
