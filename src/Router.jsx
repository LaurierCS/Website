import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Landing, LoginPage } from '@pages/index';
import { PrivateRoute, AdminPortal, EditMembers, AdminSettings } from "@pages/private"
import { AuthProvider } from '@providers/AuthProvider';
import { mantineTheme } from '@/Mantine';

const Router = () => {
    return (
        <MantineProvider
            theme={mantineTheme}
            withCSSVariables
            withGlobalStyles
            withNormalizeCSS
        >
            <BrowserRouter>
                <Routes>
                    <AuthProvider>
                        <Route element={<PrivateRoute />}>
                            <Route
                                path="/admin-portal"
                                element={<AdminPortal />}
                            >
                                <Route
                                    path="members"
                                    element={<EditMembers />}
                                />
                                <Route
                                    path="settings"
                                    element={<AdminSettings />}
                                />
                            </Route>
                        </Route>
                    </AuthProvider>
                    <Route path="/login" element={<LoginPage />} exact />
                    <Route path="/" element={<Landing />} />
                </Routes>
            </BrowserRouter>
        </MantineProvider>
    );
};

export default Router;
