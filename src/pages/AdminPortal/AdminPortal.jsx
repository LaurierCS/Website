import React from 'react';
import { Container, createStyles, Navbar, Grid } from '@mantine/core';
import { SideNavbar } from '@components';
import { Outlet } from 'react-router-dom';
import { ModalsProvider } from '@mantine/modals';

const useStyle = createStyles((theme) => {
    return {
        container: {
            height: '100vh',
        },
        editContainer: {
            marginLeft: '200px', // same width of the side nav bar
            height: '100%',
        },
    };
});

const AdminPortal = () => {
    const { classes } = useStyle();

    return (
        <ModalsProvider>
            <Container fluid p={0} className={classes.container}>
                <SideNavbar />
                <Container className={classes.editContainer} fluid>
                    <Outlet />
                </Container>
            </Container>
        </ModalsProvider>
    );
};

export default AdminPortal;
