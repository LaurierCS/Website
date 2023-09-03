import { createStyles } from '@mantine/core';

export const useCommonStyles = createStyles((theme) => ({
    partnerLogoContainer: {
        position: 'absolute',
        left: 0,
        top: 0,

        [theme.fn.smallerThan('sm')]: {
            position: 'initial',
        },
    },
    title: {
        fontSize: '3rem',
        color: '#E7EBF5',
        textAlign: 'center',
        [theme.fn.smallerThan('md')]: {
            fontSize: '2.5rem',
        },
    },
    outerBox: {
        padding: '2rem',
        borderRadius: '19px',
        backgroundColor: '#2C3844',
        width: '100%',

        [theme.fn.smallerThan('sm')]: {
            padding: '1rem',
        },
    },
    innerBox: {
        position: 'relative',
        marginBottom: '1rem',
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
}));
