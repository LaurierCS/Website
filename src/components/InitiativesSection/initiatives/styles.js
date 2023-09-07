import { createStyles } from '@mantine/core';

export const useCommonStyles = createStyles((theme) => ({
    lcsLogo: {
        width: '3rem',
    },
    hhLogo: {
        width: '2rem',
        marginLeft: '-0.7rem',
    },
    c3Logo: {
        width: '2rem',
    },
    partnerLogoContainer: {
        position: 'absolute',
        left: 0,
        top: 0,

        [theme.fn.smallerThan('md')]: {
            position: 'initial',
        },

        [theme.fn.smallerThan('xs')]: {
            gridColumn: 'span 2',
        },
    },
    title: {
        fontSize: '3rem',
        color: '#E7EBF5',
        textAlign: 'center',
        [theme.fn.smallerThan('md')]: {
            fontSize: '2.5rem',
        },
        [theme.fn.smallerThan('sm')]: {
            gridColumn: 'span 2',
            gridRow: 1,
        },
    },
    outerBox: {
        padding: '2rem',
        borderRadius: '19px',
        backgroundColor: '#2C3844',
        width: '100%',
        border: '2px solid #6cb3ff',

        [theme.fn.smallerThan('sm')]: {
            padding: '1rem',
        },
    },
    innerBox: {
        marginBottom: '1rem',
        position: 'relative',

        [theme.fn.smallerThan('md')]: {
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
        },

        [theme.fn.smallerThan('sm')]: {
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
        },
    },
    actionBtn: {
        color: '#1A1B1E',
    },
    description: {
        fontSize: '1.5rem',
        color: '#E7EBF5',
        textAlign: 'left',

        [theme.fn.smallerThan('sm')]: {
            fontSize: '1rem',
        },
    },
    bodyLogo: {
        maxWidth: '23rem',
        margin: 'auto',
        display: 'block',

        [theme.fn.smallerThan('md')]: {
            display: 'none',
        },
    },
    headerLogoBox: {
        height: '100%',
        [theme.fn.smallerThan('xs')]: {
            gridColumn: 'span 2',
        },
    },
    headerLogo: {
        maxHeight: '2rem',
    },
    actionBox: {
        position: 'absolute',
        right: 0,

        [theme.fn.smallerThan('sm')]: {
            position: 'initial',
        },
    },
    smallText: {
        fontSize: '1rem',
        textAlign: 'center',
        color: 'white',
        marginTop: '1rem',
    },
    emojiLogo: {
        fontSize: '300px',
        [theme.fn.smallerThan('md')]: {
            display: 'none',
        },
    },
    emojiHeaderLogo: {
        fontSize: '2rem',
    },
    link: {
        textTransform: 'capitalize',
        cursor: 'pointer',
        textDecoration: 'underline',
        color: theme.colors.blue[2],
    },
}));
