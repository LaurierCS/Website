const mantineTheme = {
    colorScheme: 'dark',
    defaultRadius: 8,
    colors: {
        // the actual shades that we use are at index 2 and 4
        // the extra shades are mandated by mantine
        blue: ["#E7F5FF", "#D0EBFF", "#A1DAF5", "#74C8F8", "#29ABF4", "#259ADC", "#2391CF", "#2189C3", "#1F80B7", "#1D78AB"],
    },
    primaryColor: 'blue',
    primaryShade: {
        light: 4,
        dark: 4,
    },

    // typography, sizes are in pt instead of px !
    fontFamily: 'Montserrat, Open Sans',
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
}


export default mantineTheme;
