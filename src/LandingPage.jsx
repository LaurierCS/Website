import React from 'react';
import Styled from 'styled-components';
import logo from './Assets/LCS.png';

/*
font-family: 'Karla', sans-serif;
font-family: 'Rubik', sans-serif;
*/

// The highest parent div
const RootDiv = Styled.div`
    background: white;

`;

const HeaderDiv = Styled.div`
    background: black;
    display: flex;
    height: 6em;
    width: 100%;
    justify-content: felx-start;
    align-items: center;


`;

const HeroDiv = Styled.div``;

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



export default function LandingPage() {

    return (

        <RootDiv>
            <HeaderDiv>
                <Logo src={logo}></Logo>
                <Title>LAURIER COMPUTING SOCIETY</Title>
                <JoinButton>Join our Discord</JoinButton>
            </HeaderDiv>

            <HeroDiv>

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