import React from 'react';
import './Navbar.css';
import { IconLogo } from '@assets';
import { NavbarSocials } from '@components';
import { Link } from 'react-scroll';
import { createStyles } from '@mantine/core';

// 5rem original height that was defined on the css file
// 18 is the root font size
// 5 times the root font size, not ideal, this is a magic number, root font size may change in the future, who knows
const navbarHeight = 5 * 18;

const useStyles = createStyles((theme) => {
    return {
        navbar: {
            height: `${navbarHeight}px`,
            position: 'fixed',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(26, 27, 30, 0.40)', // mantine colour dark[7] in rgb
        },
        link: {
            display: 'inline-block',
            color: theme.colors.gray[5],
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '0.9em',
            padding: '1.2em 1.5em',
            cursor: 'pointer',
            transition: 'color 150ms ease',
            '&:hover': {
                color: theme.colors.gray[0],
                transition: 'color 100ms ease',
            },
        },
        linkList: {
            display: 'flex',
            alignItems: 'center',
            listStyle: 'none',
            '@media screen and (max-width: 900px)': {
                display: 'none',
            },
        },
        socials: {
            marginLeft: 'auto',
            marginRight: '1rem',
        },
        logo: {
            height: '100%',
        },
    };
});

const Navbar = () => {
    const { classes } = useStyles();

    return (
        <div className={classes.navbar}>
            <img className={classes.logo} src={IconLogo} alt="logo" />

            <ul className={classes.linkList}>
                {['About', 'Events', 'Initiatives', 'FAQ', 'Team'].map(
                    (item) => (
                        <li key={`link-${item}`}>
                            <Link
                                to={`${item}`}
                                offset={-navbarHeight}
                                smooth
                                duration={300}
                                className={classes.link}
                            >
                                {item}
                            </Link>
                        </li>
                    )
                )}
            </ul>
            <div className={classes.socials}>
                <NavbarSocials />
            </div>
        </div>
    );
};

export default Navbar;
