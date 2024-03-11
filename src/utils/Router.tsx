import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import {
    BrowserRouter,
    Navigate,
    Outlet,
    Route,
    Routes,
} from "react-router-dom";
import { AdminPage, Landing, Login, Error404 } from "@/pages";
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
            <NotificationsProvider>
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route path="/404" element={<Error404 />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/admin" element={<AdminOnly />}>
                                <Route path="" element={<AdminPage />} />
                            </Route>
                            <Route path="*" element={<Navigate replace to="/404" />} />
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            </NotificationsProvider>
        </MantineProvider>
    );
};

export default Router;
