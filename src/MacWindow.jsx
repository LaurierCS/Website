import React from "react";
import Styled from 'styled-components';
import window from "./Assets/Window.svg";


const StyleContainer = Styled.div`
    background-color: black;
    background: url(${window});
    width: 50%;
    height: 50%;
    position: absolute;
    top: 25%;
    left: 10%;
    border-radius: 2%;
    display: flex;
    align-items: center;
    z-index: 2;
  `;

export default function MacWindow(width, height, path) {
    return (
        <StyleContainer >
        </StyleContainer>
    );
}
