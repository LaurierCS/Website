import React from 'react';
import Styled from 'styled-components';
import logo from './Assets/LCS.png';
import heroImg from './Assets/nerds.png';
import LandingPageFooter from './LandingPageFooter';
import MacWindow from './MacWindow';
import FaqSVG from './FaqBackground';
import FaqDropdown from './FaqDropdown';
import TeamMember from './TeamMember';
import { Link } from "react-router-dom";
import FaqBackgroundSVG from "./Assets/FaqBackground.svg";

/*
font-family: 'Karla', sans-serif;
font-family: 'Rubik', sans-serif;
*/

// The highest parent div
const RootDiv = Styled.div`
    background: black;

`;

const HeaderDiv = Styled.div`
    display: flex;
    height: 6em;
    width: 100%;
    justify-content: felx-start;
    align-items: center;

`;

const HeroDiv = Styled.div`
    width: 100%;
    height calc(100% - 6em);
    overflow: hidden;
`;

const HeroImage = Styled.img`
    margin-left: 50%;
    margin-top: 2em;

    max-height: 90%;
    width: auto;

    z-index: -1;
    border-radius: 1em;
    filter: blur(4px);

`;

const Faq = Styled.div`
    
    width: 100%;
    overflow: hidden;
`;

const Footer = Styled(LandingPageFooter)`
    position: absolute;
    min-width: 200px;

    bottom: 10;
    left: 0;
    
    width: 100%;
    height: 40vh;
    
   
    `;

const FooterTitle = Styled.h1`
    font-family: Rubik;
    font-style: normal;
    font-weight: 400;
    font-size: clamp(2em, 3vw, 3em);

    margin-top: 2em;
    
    align-self: flex-start;

`;

// "LAURIER COMPUTING SOCIETY"
const Title = Styled.h1`
    font-family: "Rubik", sans-serif;
    font-size: 1.5em;
    font-weight: normal;
    color: white;
`;

const Logo = Styled.img`
    margin-left: 3em;
    margin-top: 1em;
    margin-right 2em;
    margin-bottom: 1em;

`;

// Join our discord button
const JoinButton = Styled.button`
    height:4em;
    width: 12em;
    background: linear-gradient(90deg, #6CB3FF 0%, #89F7FE 100%);
    border-radius: 6px;
    margin-left: auto;
    margin-right: 2em;

    border: none;

    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
    font-size: 0.8em;

    transition: transform 250ms;

    @media only screen and (max-width: 450px) {
        display: none;
    }

    :hover {
        cursor: pointer;
        transform: translateY(-5px);
    }
`;

const HeroButton = Styled.button`
    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
    font-size: 1em;

    border: none;

    margin-top: 1em;
    margin-left: 2em;
    margin-right: auto;
    margin-bottom: 3em;

    height:4em;
    width: 12em;
    background: linear-gradient(90deg, #6CB3FF 0%, #89F7FE 100%);
    border-radius: 10px;

    transition: transform 250ms;

    :hover {
        transform: translateY(-5px);
        cursor: pointer;
    }

    @media only screen and (max-width: 300px) {
        margin-top: 1em;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 3em;
    }

`;

const Window = Styled(MacWindow)`
    position: absolute;

    filter: drop-shadow(1px 10px 47px rgba(0, 0, 0, 0.8));

    top: 10em;
    left: 10%;

    width: 50%;
    min-width: 200px;

    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;

    @media only screen and (max-width: 700px) {
        width: 85vw;
        margin-top: 0;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
    }

`;

const HeroTitle = Styled.h1`
    font-family: Rubik;
    font-style: normal;
    font-weight: 500;
    font-size: clamp(2em, 5vw, 4em);

    margin-top: 30px;
    margin-left: 0.5em;
    margin-bottom: 0;

    align-self: flex-start;

    background: linear-gradient(45deg, #6CB3FF, #89F7FE);
    background-clip: text;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -moz-text-fill-color: transparent;
    -webkit-text-fill-color: transparent;

`;


const HeroSubTitle = Styled.p`
    margin-left: 1em;
    padding-right: 2em;
    font-family: "Karla";
    font-weight: 200;
    color: white;
    font-size: clamp(1em, 3vw, 1.5em);

    align-self: flex-start;
`;

const FaqBG = Styled(FaqSVG)`
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 50%;
    padding-bottom: 4em;
    background-image: url(${FaqBackgroundSVG});
    background-size: 100%;
    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1.0) 80%, transparent 100%);

`;


const FaqWindow = Styled(MacWindow)`

    filter: drop-shadow(1px 10px 47px rgba(0, 0, 0, 0.8));

    top: 55em;
    left: 0;
    right: 0;

    padding-bottom: 2em;

    margin-top: 5em;
    margin-left: auto;
    margin-right: auto;

    width: 80%;
    min-width: 200px;

    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;

    @media only screen and (max-width: 700px) {
        width: 85vw;
        margin-top: 0;
        left: 0;
        right: 0;
    }
`;

const FAQTitle = Styled.h1`
    font-family: Rubik;
    font-style: normal;
    font-weight: 100;
    font-size: clamp(2em, 5vw, 4em);
    color: #C7DEF4;

    margin-top: 50px;
    margin-left: 0.5em;
    margin-bottom: 0.5em;
`;


const FaqListContainer = Styled.div`
    width: 100%;
    margin-left: clamp(0.5em, 5vw, 3em);

`;




export default function LandingPage() {


    function handleClick(event) {
        window.open("https://g0gslyum8od.typeform.com/to/I9RXsuiT").focus();
    }

    return (

        <RootDiv>
            <HeaderDiv>
                <Logo src={logo}></Logo>
                <Title>LAURIER COMPUTING SOCIETY</Title>
                <JoinButton onClick={handleClick}>
                    Join
                </JoinButton>
            </HeaderDiv>

            <HeroDiv>
                <HeroImage src={heroImg} />
                <Window>
                    <HeroTitle>Interested in joining the Club?</HeroTitle>
                    <HeroSubTitle>Join our Discord for our official announcements about the school year, as well as stay up-to-date all things LCS.</HeroSubTitle>
                    <HeroButton onClick={handleClick}>Join</HeroButton>
                </Window>
            </HeroDiv>

            <Faq>
                <FaqBG />
                <FaqWindow>
                    <FAQTitle>Frequently Asked Questions</FAQTitle>
                    <FaqListContainer>
                        <FaqDropdown
                            question="Who are we?"
                            answer="Laurier Computing Society is the official student operated society of Wilfrid Laurier University’s Computer Science department. We strive to help students realise their potential in STEM by enriching their academic and professional development. Our objective is to create initiatives and events to involve students in tech to challenge and improve their skills, and foster a sense of community." />

                        <FaqDropdown question="Can I get free stuff?!?!?!" answer="We do monthly money gift card giveaways on our socials, so follow us there! As well as that, all our in person events have free food and refreshments!" />
                        <FaqDropdown question="So... what type of events do you run?" answer="We run a wide range of events. We have our signature 'Meet the Professionals' events that let students and professionals connect and get information about the industry. We also run events such as our “Learn a Tool Series”, where we showcase and preview different popular technologies used in the industry that can help students personally, in projects, or in their careers. We also run fun events, such as regular socials, gaming events, and competitions! Stay tuned on our socials to learn more!" />
                        <FaqDropdown question="This sounds sick! How do I join?!?!?" answer="You don't have to do anything special! Just attend 2 of our events a term to be considered a part of the club! If you want to be a part of the executive team, feel free to contact any of the executive members for more information!" />
                        <FaqDropdown question="How are you guys handling stuff with regards to COVID?" answer="All our events that are in person or hybrid follow all the guidelines put in place by the university, as well as the Students Union. These guidelines can be found here!" />
                    </FaqListContainer>
                </FaqWindow>

            </Faq>

            <TeamMember />

            <Footer>
                <div style={{
                    textAlign: 'center',
                }}>

                    <FooterTitle >Congrats! You made it to the end!</FooterTitle>

                    <p style={{
                        position: "absolute",
                        left: 0,
                        bottom: 0,
                        right: 0,
                    }}>&copy; 2021 Laurier Computing Society</p>

                </div>
            </Footer>
        </RootDiv >
    );
}