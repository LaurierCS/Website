import React from "react";
import Styled from 'styled-components';

const MacHeader = Styled.header`
    position: relative;
    left: 100px;
    bottom: 41em;
    height: 30px;
    width: 50em;
    background: grey;
    border-radius: 10px 10px 0px 0px;
    // margin-left: auto;
    // margin-right: 2em;
    
    //TODO - Add a good max-width
    @media only screen and (max-width: 450px) {
        display: none;

    }` ;

const Mac = Styled.body` 
    position: relative;
    left: 100px;
    bottom: 41em;
    height: 30em;
    width: 50em;
    background: yellow;
    border-radius: 0px 0px 10px 10px;
    // margin-left: auto;
    // margin-right: 2em;

    //TODO - Add a good max-width
    `;

// Join our discord button
const DiscordButton = Styled.button`
    left: 11em;
    bottom: 63em;
    position: relative;
    height: 4em;
    width: 13em;
    background: linear-gradient(90deg, #6CB3FF 0%, #89F7FE 100%);
    border-radius: 6px;
    // margin-left: auto;
    // margin-right: 2em;

    font-family: Rubik;
    font-style: normal;
    font-weight: normal;
    font-size: 0.8em;

    @media only screen and (max-width: 450px) {
        display: none;

    }
`;
export default function MacWindow(width, height, path) {
    // default width 807px
    // default height 567px
    return (

        <div id="BasicMacWindow">TODO - MAC WINDOW
            <MacHeader >LCS</MacHeader>
            <Mac>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia ratione harum velit similique quidem quasi quos ullam est earum quisquam eaque, assumenda tempore doloribus officiis quam omnis, perferendis quis voluptate?</Mac>
            <DiscordButton>Discord</DiscordButton>
        </div >

    );
}
