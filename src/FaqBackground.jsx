import React from "react";
import Styled from 'styled-components';
import FaqBackgroundSVG from "./Assets/FaqBackground.svg";

const FaqSVG = Styled.div`
    background-image: url(${FaqBackgroundSVG});
    background-size: 100%;
    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1.0) 80%, transparent 100%);
`;

export default function FaqBackground({ className, children }) {
    return (
        <FaqSVG className={className}>
            {children}
        </FaqSVG>
    );
}
