import { Flex, MantineProvider, Button } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import {
    BrowserRouter,
    Link,
    Navigate,
    Outlet,
    Route,
    Routes,
} from "react-router-dom";
import { RosterPage, Landing, Login, Error404 } from "@/pages";
import { mantineTheme } from "./Mantine";
import AuthProvider, { useAuth } from "@/pages/Admin/AuthProvider";

const AdminOnly: React.FC<{ children?: React.ReactNode }> = () => {
    const { user, logout } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <nav>
                <Flex gap="md" justify="center" my="md">
                    <Link to="roster">Roster</Link>
                    <Link to="events">Events</Link>
                    <Button onClick={logout} variant="outline">
                        Logout
                    </Button>
                </Flex>
            </nav>
            <Outlet />
        </div>
    );
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
                                <Route path="roster" element={<RosterPage />} />
                                <Route path="events" element={<RosterPage />} />
                            </Route>
                            <Route
                                path="*"
                                element={<Navigate replace to="/404" />}
                            />
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            </NotificationsProvider>
        </MantineProvider>
    );
};

export default Router;
