import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
    getAuth,
    signOut as firebaseSignOut,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { HashLoader } from 'react-spinners';
import { useFirebaseApp } from '@hooks';

const override = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
};

export const AuthContext = React.createContext();

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
    const app = useFirebaseApp();

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

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState();
    const [pending, setPending] = useState(true);

    useEffect(() => {
        const unsub = getAuth().onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user);
            }
            setPending(false);
        });
        return unsub;
    }, []);

    if (pending) {
        return (
            <HashLoader
                cssOverride={override}
                size={100}
                color={'#123abc'}
                loading={pending}
            />
        );
    } else {
        return (
            <AuthContext.Provider value={{ currentUser }}>
                {children}
            </AuthContext.Provider>
        );
    }
};

export default AuthProvider;
