import React from 'react';
import Styled from 'styled-components';
import logo from './Assets/LCS.png';
import heroImg from './Assets/nerds.png';
import MacWindow from './MacWindow';
import FaqSVG from './FaqBackground';
import FaqDropdown from './FaqDropdown';
import TeamMember from './TeamMember';

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
    height: 60em;
    z-index: 2;

    overflow: hidden;
`;

const TeamDiv = Styled.div``;

const Footer = Styled.div``;


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

    padding-bottom: 4em;
    margin-top: -100px;


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
    margin-left: 4em;

`;

export default function LandingPage() {

    return (

        <RootDiv>
            <HeaderDiv>
                <Logo src={logo}></Logo>
                <Title>LAURIER COMPUTING SOCIETY</Title>
                <JoinButton>Join our Discord</JoinButton>
            </HeaderDiv>

            <HeroDiv>
                <HeroImage src={heroImg} />
                <Window>
                    <HeroTitle>Interested in joining the Club?</HeroTitle>
                    <HeroSubTitle>Join our Discord for our official announcements about the school year, as well as stay up-to-date all things LCS.</HeroSubTitle>
                    <HeroButton >Join</HeroButton>
                </Window>
            </HeroDiv>

            <Faq>
                <FaqBG>
                    <FaqWindow>
                        <FAQTitle>Frequently Asked Questions</FAQTitle>
                        <FaqListContainer>
                            <FaqDropdown question="Question number one?" answer="Answer here....." />
                            <FaqDropdown question="Question number two?" answer="Answer here....." />
                            <FaqDropdown question="Question number three?" answer="Answer here....." />
                            <FaqDropdown question="Question number four?" answer="Answer here....." />
                            <FaqDropdown question="Question number five?" answer="Answer here....." />
                        </FaqListContainer>
                    </FaqWindow>
                </FaqBG>
            </Faq>

            <TeamMember />

            <Footer>
                <p>
                    footer
                </p>
            </Footer>

        </RootDiv>
    );
}