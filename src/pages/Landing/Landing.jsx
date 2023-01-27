import React from 'react';
import './Landing.css';
import { Navbar, Accord, InfoBanner, Footer, About, EventSection } from '@components';

const Landing = () => {
    return (
        <>
            <Navbar />
            <InfoBanner />
            <About />
            <Accord />
            <EventSection />
            <Footer />
        </>
    );
};

export default Landing;
