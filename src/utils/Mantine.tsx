const mantineTheme = {
    colorScheme: 'dark',
    defaultRadius: 8,

    // mantine recommends having 10 shades of each colour, so the extra colours are just place holders.
    // of course, the different shades can also be added to main.css as part of our design.
    colors: {
        secondary: ['#A1DAF5'],
        accents: ['#FF41D5', '#89F7FE'],
        card: ['#2C3844'],
        // the blue we have in the css variable (--color-blue) is index 4
        blue: [
            '#dcf2ff',
            '#afdbff',
            '#82c7fb',
            '#52b7f7',
            '#29abf4',
            '#0b82da',
            '#0059ab',
            '#00387b',
            '#001c4d',
            '#00071f',
        ],

        // the light blue we have in css variable (--color-light-blue) is index 2
        lightBlue: [
            '#dff6ff',
            '#b6e2fa',
            '#a1daf5',
            '#61b5ed',
            '#3a96e7',
            '#2572cd',
            '#184fa0',
            '#0c3073',
            '#001547',
            '#00041c',
        ],

        // the pink solely exists for the sake of the blue-pink gradient
        pink: [
            '#ffe2fb',
            '#ffb1eb',
            '#ff7fdf',
            '#ff4dd8',
            '#fe1ebd',
            '#e50795',
            '#b30067',
            '#810041',
            '#4f0023',
            '#1e000b',
        ],

        // all the gray shades are good to use but preferably indeces: 0, 4, 5, 7, 8, 9
        gray: [
            '#F8F8F8',
            '#F1F3F5',
            '#E9ECEF',
            '#DEE2E6',
            '#E7EBF5',
            '#B2BECD',
            '#868E96',
            '#454E56',
            '#2C3844',
            '#12181B',
        ],
    },
    primaryColor: 'blue',
    primaryShade: {
        light: 4,
        dark: 4,
    },
    defaultGradient: {
        deg: 90,
        from: 'blue.4',
        to: 'lightBlue.2',
    },

    // typography, sizes are in pt instead of px !
    fontFamily: 'Montserrat',
    fontSizes: {
        xs: 12,
        sm: 14,
        md: 18,
        lg: 20,
        xl: 24,
    },
    headings: {
        fontFamily: 'Montserrat', // force to use Montserrat for headings
    },

    // for users who have reduced motion for animations set in their OS
    respectReducedMotion: true,
}

export {
    mantineTheme
}
