import { themes } from '@storybook/theming';
import { MantineProvider } from '@mantine/core';
import { mantineTheme } from '../src/utils/Mantine';
import { withRouter } from 'storybook-addon-react-router-v6';

import '../src/main.css';

/** @type { import('@storybook/react').Preview } */
const preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
        docs: {
            theme: themes.dark,
        },
        darkMode: {
            dark: { ...themes.dark, appBg: 'black' },
            light: { ...themes.normal, appBg: 'white' },
            current: 'dark',
        },
    },
};

export default preview;

function ThemeWrapper(props) {
    return (
        <MantineProvider theme={mantineTheme} withGlobalStyles>
            {props.children}
        </MantineProvider>
    );
}

export const decorators = [
    withRouter,
    (renderStory) => <ThemeWrapper>{renderStory()}</ThemeWrapper>,
];
