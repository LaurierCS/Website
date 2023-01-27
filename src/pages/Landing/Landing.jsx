import React from 'react';
import './Landing.css';
import { Navbar, Footer, EventSection } from '@components';

const Landing = () => {
    return (
        <>
            <Navbar />
            <EventSection />
            <Footer />
        </>
    );
};

export default Landing;
