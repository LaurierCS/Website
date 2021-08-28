import React from "react";
import Styled from 'styled-components';
import footer from "./Assets/Footer.svg";
import tiktok from "./Assets/TikTok.png"
import discord from "./Assets/Discord.png"
import twitter from "./Assets/Twitter.png"
import facebook from "./Assets/Facebook.png"
import linkedin from "./Assets/LinkedIn.png"
import youtube from "./Assets/YouTube.png"
import instagram from "./Assets/Instagram.png"

const StyleContainer = Styled.div`
    
    background: url(${footer});
    background-repeat: repeat;
    background-color: #C7DEF4;
    // border-radius: 0.5em;
    

  `;
const Socials = Styled.div`
    align-items: center;
    justify-content: center;
    display: flex;
    margin-top: auto;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: auto;
    
    :hover {
        cursor: pointer;
        transform: translateY(-5px);
    }`;




export default function LandingPageFooter({ width, height, className, children }) {
    return (
        <div>
            <StyleContainer width={width} height={height} className={className}>
                {children}
            </StyleContainer>

            <Socials width={width} height={height} className={className} >


                <a href="#">
                    <img src={discord} alt="Discord icon" style={{}} />
                </a>
                <a href="#">
                    <img src={instagram} alt="Instagram icon" />
                </a>
                <a href="#">
                    <img src={twitter} alt="Twitter icon" />
                </a>
                <a href="#">
                    <img src={facebook} alt="Facebook icon" />
                </a>
                <a href="#">
                    <img src={linkedin} alt="LinkedIn icon" />
                </a>
                <a href="#">
                    <img src={youtube} alt="Youtube icon" />
                </a>
                <a href="#">
                    <img src={tiktok} alt="TikTok icon" />
                </a>

            </Socials>

        </div>
    );
}

