import { useState } from 'react';
import Styled from 'styled-components';
import { ReactComponent as Icon } from './Assets/Icon.svg';


const StyledDiv = Styled.div`
    font-family: "Rubik";    
    width: 90%;  
    padding-bottom: 0.5em;
`;

const Question = Styled.h1`
    font-size: clamp(1em, 5vw, 2em);
    font-weight: 400;
    color: white;
    transition: color 0.2s ease;

    :hover{
        color: #4CC082;
        transition: color 0.2s ease;
        cursor: pointer;
    }

    &.open{

        color: #4CC082;
        transition: color 0.2s ease;
    }

`;

const Answer = Styled.p`
    font-size: clamp(1em, 5vw, 1.5em);
    font-weight: 300;
    color: white;

    margin-top: 0em;
    margin-left: 2em;
`;

const DropIcon = Styled(Icon)`
    
    width: 3em;
    height: 1.5em;
    transform: rotate(0deg);
    transition: all 0.4s ease;

    &.open{
        transform: rotate(90deg);
        transition: all 0.4s ease;
    }
    &.open::after{
        transform: rotate(90deg);
        transition: all 0.4s ease;
    }

    :hover{
        cursor: pointer;
    }
`;

const QuestionDiv = Styled.div`
    display: flex;
    justifty-content: row;
    align-items: center;
`;


export default function FaqDropdown({ question, answer }) {
    const [isActive, setActive] = useState(false);

    function handleClick() {
        setActive(!isActive);

    }

    return (
        <StyledDiv>
            <QuestionDiv>
                <DropIcon onClick={handleClick} className={isActive ? 'open' : ''} />
                <Question onClick={handleClick} className={isActive ? 'open' : ''} >{question}</Question>
            </QuestionDiv>
            {isActive ? <Answer>{answer}</Answer> : null}
        </StyledDiv >
    );

}