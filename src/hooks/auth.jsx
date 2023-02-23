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
        try {
            const user = await signInWithEmailAndPassword(
                getAuth(app),
                email,
                password
            );
            return user;
        } catch (error) {
            console.error(error);
            // TODO: show error notification
            throw error;
        }
    });

    const signOut = useCallback(async () => {
        try {
            await firebaseSignOut(getAuth(app));
        } catch (error) {
            console.error(error);
            // TODO: show error notification
            throw error;
        }
    });

    return { signIn, signOut };
};
