import { MantineProvider } from '@mantine/core';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Landing } from '../pages';
import { mantineTheme } from './Mantine';

const Router = () => {
    return (
        <MantineProvider
            theme={{mantineTheme}}
            withCSSVariables
            withGlobalStyles
            withNormalizeCSS
        >
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Landing />} />
                </Routes>
            </BrowserRouter>
        </MantineProvider>
    );
};

export default Router;
