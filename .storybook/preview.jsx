// expose access to css variables defined in main.css
import '../src/main.css';
import { mantineTheme } from '../src/utils/Mantine';
import { MantineProvider } from '@mantine/core';

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};

export const decorators = [
    (Story) => (
        <MantineProvider
            theme={mantineTheme}
            withCSSVariables
            withGlobalStyles
            withNormalizeCSS
        >
            <Story />
        </MantineProvider>
    ),
];
