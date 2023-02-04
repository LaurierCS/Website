import { MantineProvider } from '@mantine/core';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Landing } from '@pages';
import { mantineTheme } from './Mantine';
import AuthProvider from '../scripts/hooks/auth';
import PrivateRoute from '../scripts/private-route';
import LoginPage from '../pages/AdminPortal/login';
import PortalLanding from '../pages/AdminPortal/portal-landing';

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
                                element={<PortalLanding />}
                                exact
                            />
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
