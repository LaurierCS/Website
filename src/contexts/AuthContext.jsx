import { createContext, useEffect, useState } from 'react';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { HashLoader } from 'react-spinners';
import { app } from '@scripts/firebase';

const override = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-50%)',
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState();
    const [pending, setPending] = useState(true);

    useEffect(() => {
        const auth = getAuth(app);
        if (import.meta.env.DEV) {
            connectAuthEmulator(auth, 'http://localhost:9099');
        }
        const unsub = auth.onAuthStateChanged((user) => {
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
