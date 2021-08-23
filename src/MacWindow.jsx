import React from "react";
import Styled from 'styled-components';
import window from "./Assets/Window.svg";


const StyleContainer = Styled.div`
    
    background: url(${window});
    background-repeat: no-repeat;

    
    border-radius: 0.5em;
    
  `;

export default function MacWindow({ width, height, className, children }) {
    return (
        <StyleContainer width={width} height={height} className={className}>
            {children}
        </StyleContainer>
    );
}
