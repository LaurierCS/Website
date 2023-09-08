import { useState } from 'react';
import { IconLogo } from '@assets';
import { NavbarSocials } from '@components';
import { Link } from 'react-scroll';
import { createStyles, Burger, Drawer } from '@mantine/core';

export const navbarHeight = 5 * 18;

const useStyles = createStyles((theme) => {
    return {
        navbar: {
            height: `${navbarHeight}px`,
            position: 'fixed',
            display: 'flex',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(26, 27, 30, 0.40)',
        },

        navbarMobile: {
            display: 'none',

            '@media screen and (max-width: 900px)': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                width: 'calc(100% - 90px)',
                paddingRight: '1.5rem',
            },
        },

        link: {
            display: 'inline-block',
            color: theme.colors.gray[5],
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '1rem',
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
        },

        linkListMobile: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            listStyle: 'none',
            marginTop: '-1.5rem',
        },

        socials: {
            marginLeft: 'auto',
            marginRight: '1rem',
        },

        logo: {
            height: '90px',

            '&:hover': {
                WebkitAnimation: 'spin 4s linear infinite',
                MozAnimation: 'spin 4s linear infinite',
                animation: 'spin 4s linear infinite',
            },

            '@-moz-keyframes spin': {
                '100%': {
                    '-moz-transform': 'rotate(360deg)',
                },
            },

            '@-webkit-keyframes spin': {
                '100%': {
                    '-webkit-transform': 'rotate(360deg)',
                },
            },

            '@keyframes spin': {
                '100%': {
                    '-webkit-transform': 'rotate(360deg)',
                    transform: 'rotate(360deg)',
                },
            },
        },

        desktopNav: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: 'calc(100% - 90px)',

            '@media screen and (max-width: 900px)': {
                display: 'none',
            },
        },
        
        mobileSocials: {
            marginTop: '2rem',
        },
    };
});

const Navbar = () => {
    const [opened, setOpened] = useState(false);
    const { classes } = useStyles();

    return (
        <section id="navbar">
            <div className={classes.navbar}>
                <img className={classes.logo} src={IconLogo} alt="logo" />

                <div className={classes.desktopNav}>
                    <nav>
                        <ul className={classes.linkList}>
                            {['About', 'Initiatives', 'Events', 'FAQ', 'Team'].map(
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
                    </nav>
                    <div className={classes.socials}>
                        <NavbarSocials />
                    </div>
                </div>

                <div className={classes.navbarMobile}>
                    <Burger
                        opened={opened}
                        onClick={() => setOpened((open) => !open)}
                        size="sm"
                        color="gray"
                    />

                    <Drawer
                        opened={opened}
                        onClose={() => setOpened(false)}
                        position="right"
                        overlayOpacity={0.55}
                        overlayColor="var(--color-background)"
                        overlayBlur={3}
                        padding="10%"
                        className={classes.drawer}
                    >
                        <nav>
                            <ul className={classes.linkListMobile}>
                                {[
                                    'About',
                                    'Initiatives',
                                    'Events',
                                    'FAQ',
                                    'Team',
                                ].map((item) => (
                                    <li key={`link-${item}`}>
                                        <Link
                                            to={`${item}`}
                                            offset={-navbarHeight}
                                            smooth
                                            duration={300}
                                            className={classes.link}
                                            onClick={() => setOpened(false)}
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className={classes.mobileSocials}>
                            <NavbarSocials />
                        </div>
                    </Drawer>
                </div>
            </div>
        </section>
    );
};

export default Navbar;
