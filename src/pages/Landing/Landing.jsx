import React from 'react';
import './Landing.css';
import { Navbar, InfoBanner, About, EventSection, FAQ, Footer, Spacer } from '@components';

const Landing = () => {
    return (
        <>
            <Navbar />
            <Spacer height="2em"/>                                  
            <InfoBanner />
            <Spacer height="2em"/>                                  
            <About />
            <Spacer height="2em"/>                                  
            <EventSection />
            <FAQ />
            <Footer />
        </>
    );
};

export default Landing;
