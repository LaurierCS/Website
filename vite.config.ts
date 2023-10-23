/* eslint-disable */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src/'),
            '@assets': path.resolve(__dirname, 'src/assets/'),
            '@components': path.resolve(__dirname, 'src/components/'),
            '@pages': path.resolve(__dirname, 'src/pages/'),
            '@stories': path.resolve(__dirname, 'src/stories/'),
            '@utils': path.resolve(__dirname, 'src/utils/'),
            '@services': path.resolve(__dirname, 'src/services/'),
        },
    },
});
