import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Landing, Login } from "@/pages";
import { mantineTheme } from "./Mantine";
import AuthProvider, { useAuth } from "@/pages/Admin/AuthProvider";

const AdminOnly: React.FC<{ children?: React.ReactNode }> = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

const Router = () => {
    return (
        <MantineProvider
            theme={mantineTheme}
            withCSSVariables
            withGlobalStyles
            withNormalizeCSS
        >
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/admin" element={<AdminOnly />}>
                            <Route path="" element={<div>admin</div>} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </MantineProvider>
    );
};

export default Router;
