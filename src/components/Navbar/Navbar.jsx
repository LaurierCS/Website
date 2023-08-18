import React from 'react';
import './Navbar.css';
import { IconLogo } from '@assets';
import { NavbarSocials } from '@components';
import { Link } from 'react-scroll';
import { createStyles, Burger, Drawer } from '@mantine/core';

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
        navbar__mobile: {
            display: 'inline-block',
            '@media only screen and (min-width: 768px)': {
                display: 'none',
            },
        },
        burger__button: {
            float: 'right',
            padding: '1.2em 13em',
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
            '@media screen and (max-width: 900px)': {
                display: 'none',
            },
        },
        logo: {
            height: '100%',
        },
    };
});

const Navbar = () => {
    const [opened, setOpened] = React.useState(false);
    const { classes } = useStyles();

    return (
        <div className={classes.navbar}>
            <img className={classes.logo} src={IconLogo} alt="logo" />

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
            <div className={classes.socials}>
                <NavbarSocials />
            </div>

            <div className={classes.navbar__mobile}>
                <div className={classes.burger__button}>
                    <Burger
                        opened={opened}
                        onClick={() => setOpened((open) => !open)}
                        size="sm"
                        color="gray"
                    />
                </div>

                <Drawer
                    transition="rotate-left"
                    transitionDuration={300}
                    transitionTimingFunction="ease"
                    opened={opened}
                    onClose={() => setOpened(false)}
                    position="right"
                    overlayOpacity={0.55}
                    overlayColor="var(--color-background)"
                    overlayBlur={3}
                    padding="10%"
                >
                    <div className="drawer__content">
                        <div className="drawer__items">
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
                        </div>
                    </div>
                </Drawer>
            </div>
        </div>
    );
};

export default Navbar;
