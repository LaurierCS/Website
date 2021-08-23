import React from "react";
import Styled from 'styled-components';
import window from "./Assets/Window.svg";


const StyleContainer = Styled.div`
    position: absolute;

    background: url(${window});
    background-repeat: no-repeat;

    filter: drop-shadow(1px 10px 47px rgba(0, 0, 0, 0.8));

    top: 25%;
    left: 10%;
    border-radius: 0.5em;
    display: flex;
    align-items: center;
    z-index: 2;

    width: ${(props) => props.width};
    height: ${(props) => props.height};
  `;

export default function MacWindow({ width, height, children }) {
    return (
        <StyleContainer width={width} height={height}>
            {children}
        </StyleContainer>
    );
}
