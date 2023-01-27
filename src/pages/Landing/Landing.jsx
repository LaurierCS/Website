import React from 'react';
import './Landing.css';
import { Navbar, Accord, Footer, About, EventSection } from '@components';

const Landing = () => {
    return (
        <>
            <Navbar />
            <About />
            <Accord />
            <EventSection />
            <Footer />
        </>
    );
};

export default Landing;
