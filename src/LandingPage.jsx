import React from 'react';
import Styled from 'styled-components';
import logo from './Assets/LCS.png';
import heroImg from './Assets/nerds.png';
import MacWindow from './MacWindow';
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


const FaqDiv = Styled.div``;

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
    height: 4em;
    width: 14em;
    background: linear-gradient(90deg, #6CB3FF 0%, #89F7FE 100%);
    border-radius: 6px;
    margin-left: auto;
    margin-right: 2em;

    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
    font-size: 0.8em;

    @media only screen and (max-width: 450px) {
        display: none;

    }
`;

const Window = Styled(MacWindow)`

`;

const HeroTitle = Styled.h1`
    font-family: Rubik;
    font-style: normal;
    font-weight: 500;
    font-size: clamp(1em, 5vw, 4em);

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
    font-size: clamp(0.3em, 3vw, 1.5em);

    align-self: flex-start;
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
                <Window width={"50%"} height={"50%"}>
                    <HeroTitle>Interested in joining the Club?</HeroTitle>
                    <HeroSubTitle>Join our Discord for our official announcements about the school year, as well as stay up-to-date all things LCS.</HeroSubTitle>
                </Window>
            </HeroDiv>

            <FaqDiv>
                <p>
                    FAQ
                </p>
            </FaqDiv>

            <TeamDiv>
                <p>
                    Meet the team
                </p>
            </TeamDiv>

            <Footer>
                <p>
                    footer
                </p>
            </Footer>

        </RootDiv>
    );
}