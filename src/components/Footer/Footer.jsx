import React, { useState, useEffect } from 'react';
import { Text, Title, Box, Flex, createStyles } from '@mantine/core';
import { IconArrowUp } from '@tabler/icons-react';
import { Link } from 'react-scroll';
import { Dug, Heart } from '@assets';

import './Footer.css';
import { navbarHeight } from '../Navbar/Navbar';

const useStyles = createStyles((theme) => ({
    footer: {
        marginTop: '8rem',
    },
    title: {
        fontSize: '3rem',
        color: 'white',

        [theme.fn.smallerThan('780')]: {
            fontSize: '2rem',
        },
    },

    text: {
        fontSize: 32,
        color: '#E7EBF5',
        marginTop: '2rem',
        marginBottom: '2rem',

        [theme.fn.smallerThan('780')]: {
            fontSize: '1rem',
        },
    },

    dugBox: {
        position: 'relative',

        [theme.fn.smallerThan('780')]: {
            width: '100%',
            paddingTop: '6rem',
            overflow: 'hidden',
            transform: 'translateY(-8rem)',
        },
    },

    dug: {
        [theme.fn.smallerThan('780')]: {
            width: '100%',
        },
    },

    heart: {
        position: 'absolute',
        left: 100,
        top: '-5rem',
        animation: 'bounce 2s infinite',

        [theme.fn.smallerThan('780')]: {
            top: '3rem',
            left: '4rem',
            width: '8rem',

            [theme.fn.largerThan('480')]: {
                left: '8rem',
                width: '10rem',
            },

            [theme.fn.smallerThan('660')]: {
                left: '7rem',
                width: '9rem',
            },

            [theme.fn.smallerThan('560')]: {
                left: '6rem',
                width: '8rem',
            },

            [theme.fn.smallerThan('560')]: {
                left: '6rem',
                width: '8rem',
            },

            [theme.fn.smallerThan('480')]: {
                left: '4rem',
                width: '7rem',
            },

            [theme.fn.smallerThan('400')]: {
                top: '3rem',
                left: '2wrem',
                width: '6rem',
            },
        },
    },

    footerBar: {
        background: 'rgba(26, 27, 30, 0.9)',
        padding: '3rem 2rem',
        fontSize: 18,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },

    lcsDevTeam: {
        fontWeight: 'bold',
    },

    backToTopBtn: {
        borderRadius: 9999,
        border: 'none',
        cursor: 'pointer',
        position: 'fixed',
        top: '97%',
        transform: 'translateY(-110%)',
        right: '2%',
        width: '3rem',
        height: '3rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(26, 27, 30, 0.9)',
        transition: 'opacity 0.3s ease-in-out',
    },

    arrowUp: {
        color: '#6998DF',
        opacity: '0.8',
    },
}));

const Footer = () => {
    const { classes } = useStyles();
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollThreshold = 350;
            const shouldShow = window.scrollY > scrollThreshold;
            setShowBackToTop(shouldShow);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const backToTopButtonStyle = {
        opacity: showBackToTop ? 1 : 0,
    };

    return (
        <footer className={classes.footer}>
            <Title align="center" order={1} className={classes.title}>
                {'Congrats! You made it to the end!'}
            </Title>
            <Text
                style={{ marginLeft: '10px', marginRight: '10px' }}
                align="center"
                className={classes.text}
            >
                {"Here's a token of appreciation from Dug:"}
            </Text>
            <Flex pt="6rem" pb="4rem" justify="center">
                <Box className={classes.dugBox}>
                    <img src={Dug} alt="Dug" className={classes.dug} />
                    <img src={Heart} alt="Heart" className={classes.heart} />
                </Box>
            </Flex>
            <Box className={classes.footerBar}>
                <Text as="p" align="center">
                    Made with ❤️
                </Text>
                <Text as="p" align="center" className={classes.lcsDevTeam}>
                    LCS Development Team
                </Text>
                <Text as="p" align="center" mt="3rem">
                    {' '}
                    Copyright &#169; {new Date().getFullYear()} | Laurier
                    Computing Society. All rights reserved.
                </Text>
            </Box>
            <Link to="top" smooth duration={300} offset={-navbarHeight}>
                <div
                    className={classes.backToTopBtn}
                    style={backToTopButtonStyle}
                >
                    <IconArrowUp className={classes.arrowUp} />
                </div>
            </Link>
        </footer>
    );
};

export default Footer;
