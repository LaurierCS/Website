import {
    User,
    browserSessionPersistence,
    setPersistence,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/services/firebase";
import { showNotification } from "@mantine/notifications";

type LoginFn = (email: string, password: string) => Promise<void>;
type LogoutFn = () => Promise<void>;

interface AuthContextValue {
    user: User | null;
    login: LoginFn;
    logout: LogoutFn;
}

const AuthContext = createContext<AuthContextValue>({
    user: null,
    login: async () => {
        console.log("Login function not initialized");
    },
    logout: async () => {
        console.log("Logout function not initialized");
    },
});

export function useAuth() {
    const ctx = useContext(AuthContext);
    return ctx;
}

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);

    const login: LoginFn = async (email, password) => {
        await setPersistence(auth, browserSessionPersistence);
        await signInWithEmailAndPassword(auth, email, password);
    };

    const logout: LogoutFn = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error(error);
            showNotification({
                autoClose: 5000,
                title: "Error Signing In",
                message:
                    "Oops, this is not good. Please let the dev team know of this problem.",
                color: "red",
            });
        } finally {
            setUser(null);
        }
    };

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((newUser) => {
            if (newUser) {
                setUser(newUser);
            } else {
                logout();
            }
        });

        return unsub;
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
