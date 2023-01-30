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
        // TODO: find a way to import the configurations
        //       from `vite.config.js` instead of hard coding them
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
