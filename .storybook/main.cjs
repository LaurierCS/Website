const { mergeConfig } = require('vite');
const path = require('path');

module.exports = {
    stories: [
        '../src/**/*.stories.mdx',
        '../src/**/*.stories.@(js|jsx|ts|tsx)',
    ],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        '@storybook/addon-interactions',
    ],
    framework: '@storybook/react',
    core: {
        builder: '@storybook/builder-vite',
    },
    features: {
        storyStoreV7: true,
    },
    async viteFinal(config) {
        /*
         * Reasons we need to change the vite configurations here:
         * 1. Storybook has its own configuration for vite, so aliases or other settings from our `vite.config.js`
         *    won't be loaded
         * 2. Because of reason #1, components that import assets/modules using aliases won't work and break storybook (Big L)
         * 3. Why not just make our lives a little harder.... adds flavour to it...
         *
         *
         * TODO: Implement a way to load settings from `vite.config.js` instead of having them hard-coded.
         * TODO: Research how to turn this file into ESM (as of now, it is CommonJS)
         * */

        const customConfig = {
            resolve: {
                alias: {
                    '@': path.resolve(__dirname, '../src/'),
                    '@assets': path.resolve(__dirname, '../src/assets/'),
                    '@components': path.resolve(
                        __dirname,
                        '../src/components/'
                    ),
                    '@pages': path.resolve(__dirname, '../src/pages/'),
                    '@stories': path.resolve(__dirname, '../src/stories/'),
                    '@utils': path.resolve(__dirname, '../src/utils/'),
                },
            },
        };

        const newConfig = mergeConfig(config, customConfig);

        return newConfig;
    },
};
