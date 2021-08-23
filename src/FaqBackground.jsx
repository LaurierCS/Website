import React from "react";
import Styled from 'styled-components';
import FaqBackgroundSVG from "./Assets/FaqBackground.svg";

const FaqSVG = Styled.div`
    background-image: url(${FaqBackgroundSVG});
    background-size: auto;
`;

export default function FaqBackground({ className, children }) {
    return (
        <FaqSVG className={className}>
            {children}
        </FaqSVG>
    );
}
