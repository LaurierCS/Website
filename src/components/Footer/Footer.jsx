import React from 'react';
import { Text, Title, Box, Flex, createStyles } from '@mantine/core';
import { IconArrowUp } from '@tabler/icons-react';
import { Link } from 'react-scroll';
import { Dug, Heart } from '@assets';

import './Footer.css';

const useStyles = createStyles(() => ({
    title: {
        fontSize: 48,
        color: 'white',
    },
    text: {
        fontSize: 32,
        color: '#E7EBF5',
        marginTop: '2rem',
        marginBottom: '2rem',
    },
    dugBox: {
        position: 'relative',
    },
    heart: {
        position: 'absolute',
        left: 100,
        top: -80,
        animation: 'bounce 2s infinite',
    },
    footerBar: {
        background: 'rgba(26, 27, 30, 0.9)',
        padding: '2rem',
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
        position: 'absolute',
        top: 0,
        transform: 'translateY(-110%)',
        right: '5%',
        width: '3rem',
        height: '3rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(26, 27, 30, 0.9)',
    },
    arrowUp: {
        color: 'white',
    },
}));

const Footer = () => {
    const { classes } = useStyles();
    return (
        <footer>
            <Title align="center" order={1} className={classes.title}>
                {'<Congrats! You made it to the end! />'}
            </Title>
            <Text align="center" className={classes.text}>
                {"Here's a token of appreciation from Dug"}
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
                <Text as="p" align="center" my="3rem">
                    {' '}
                    Copyright &#169; {new Date().getFullYear()} | Laurier
                    Computing Society. All rights reserved.
                </Text>
                <Link to="top" smooth duration={300}>
                    <div className={classes.backToTopBtn}>
                        <IconArrowUp className={classes.arrowUp} />
                    </div>
                </Link>
            </Box>
        </footer>
    );
};

export default Footer;
