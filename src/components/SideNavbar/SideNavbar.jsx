import { createStyles, NavLink } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const useStyle = createStyles((theme) => {
    return {
        container: {
            height: '100%',
            width: '200px',
            position: 'fixed',
            left: 0,
            backgroundColor: theme.colors.dark[5],
        },
    };
});

const SideNavbar = ({ availableRoutes }) => {
    const { classes } = useStyle();
    const nav = useNavigate();

    const links = availableRoutes.map((route) => {
        const { href, label, icon: Icon } = route;
        return (
            <NavLink
                key={href}
                label={label}
                icon={<Icon stroke={1.5} />}
                onClick={() => nav(href)}
            />
        );
    });

    return <nav className={classes.container}>{links}</nav>;
};

export default SideNavbar;
