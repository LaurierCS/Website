import React from 'react';
import './Landing.css';
import { Navbar, Footer, About, EventSection } from '@components';

const Landing = () => {
    return (
        <>
            <Navbar />
            <About />
            <EventSection />
            <Footer />
        </>
    );
};

export default Landing;
