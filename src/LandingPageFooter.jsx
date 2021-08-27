import React from "react";
import Styled from 'styled-components';
import footer from "./Assets/Footer.svg";


const StyleContainer = Styled.div`
    
    background: url(${footer});
    background-repeat: repeat;
    background-color: #C7DEF4;
    // border-radius: 0.5em;
    

  `;



export default function LandingPageFooter({ width, height, className, children }) {
    return (
        <StyleContainer width={width} height={height} className={className}>
            {children}
        </StyleContainer>


    );
}

