const mantineTheme = {
    colorScheme: 'dark',
    defaultRadius: 8,

    // mantine recommends having 10 shades of each colour, so the extra colours are just place holders.
    // of course, the different shades can also be added to main.css as part of our design.
    colors: {
        primary: ['#29ABF4'],
        secondary: ['#A1DAF5'],
        accents: ['#FF41D5', '#89F7FE'],
        card: ['#2C3844'],
    },
    primaryColor: 'primary',
    primaryShade: {
        light: 1,
        dark: 1,
    },
    defaultGradient: {
        deg: 90,
        from: 'primary.0',
        to: 'accents.1',
    },

    fontFamily: 'Montserrat',
    fontSizes: {
        xs: '12px',
        sm: '14px',
        md: '18px',
        lg: '20px',
        xl: '24px',
    },
    headings: {
        fontFamily: 'Montserrat', // force to use Montserrat for headings
        sizes: {
            h1: {
                fontSize: '48px',
            },
        },
    },

    // for users who have reduced motion for animations set in their OS
    respectReducedMotion: true,
};

export { mantineTheme };
