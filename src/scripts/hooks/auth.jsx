import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState();
    const [pending, setPending] = useState(true);
    useEffect(() => {
        getAuth().onAuthStateChanged((user) => {
            if (user) {
                setCurrentUser(user);
            }
            setPending(false);
        });
    }, []);
    if (pending) {
        return (
            <h1>
                An unexpected error has occcured, you may not proceed to the
                Admin Portal
            </h1>
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
