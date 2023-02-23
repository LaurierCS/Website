import { createContext, useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { HashLoader } from 'react-spinners';

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
