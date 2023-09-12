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
            backgroundColor: 'rgba(26, 27, 30, 0.40)', // mantine colour dark[7] in rgb
        },
        navbar__mobile: {
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
            transition: 'all 150ms ease-in, all 200ms ease-out',
            '&:hover': {
                color: theme.colors.gray[0],
                transform: 'scale(1.2)',
                margin: '0.2em 0'
            },
        },
        linkList: {
            display: 'flex',
            alignItems: 'center',
            listStyle: 'none',
        },
        linkList__mobile: {
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

            <div className={classes.navbar__mobile}>
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
                        <ul className={classes.linkList__mobile}>
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
    );
};

export default Navbar;
