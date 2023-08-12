import React from 'react';
import './Landing.css';
import {
    Navbar,
    InfoBanner,
    About,
    EventSection,
    FAQ,
    Footer,
    Spacer,
    Newsletter,
    HeroSection,
    InitiativesSection,
} from '@components';

const Landing = () => {
    return (
        <>
            <Navbar />
            <HeroSection />
            <Spacer height="2em" />
            <InfoBanner />
            <Spacer height="2em" />
            <About />
            <Spacer height="2em" />
            <InitiativesSection />
            <Spacer height="2em" />
            <EventSection />
            <FAQ />
            <Newsletter />
            <Footer />
        </>
    );
};

export default Landing;
