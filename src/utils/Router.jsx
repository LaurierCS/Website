import { MantineProvider } from '@mantine/core';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Landing, AdminPortal, EditMembers } from '@pages';
import { mantineTheme } from './Mantine';
import { AuthProvider } from '@contexts/AuthContext';
import PrivateRoute from '@scripts/private-route';
import LoginPage from '@pages/AdminPortal/login';

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
                        <Route element={<PrivateRoute />}>
                            <Route
                                path="/admin-portal"
                                element={<AdminPortal />}
                            >
                                <Route
                                    path="members"
                                    element={<EditMembers />}
                                />
                            </Route>
                        </Route>
                        <Route path="/login" element={<LoginPage />} exact />
                        <Route path="/" element={<Landing />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </MantineProvider>
    );
};

export default Router;
