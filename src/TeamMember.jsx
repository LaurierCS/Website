import React from 'react';
import styled from 'styled-components';
import UnknownMember from './Assets/UnknownMember.png';
import GeneralMember from './GeneralMember';
import data from './data';

export default function TeamMember() {
    const MemberContainer = styled.div`
        display: flex;
        width: 80%;
        margin-left: 10%;
        align-items: center;
        flex-direction: column;
        margin-top: 0;
        .text-style {
            font-family: Rubik;
            font-style: normal;
            color: white;
            font-weight: 100;
        }
    `;
    const PresidentContainer = styled.div`
        display: flex;
        align-items: center;
        flex-direction: row;
    `;
    const PresidentDiv1 = styled.div`
        align-items: center;
        justify-content: center;
        padding-right: 20rem;
    `;
    const PresidentDiv2 = styled.div`
        align-items: center;
        justify-content: center;
    `;
    const PresidentImage = styled.img`
        width: 5rem;
        height: 5rem;
        border-radius: 50%;
        background-color: white;
    `;
    return (
        <MemberContainer>
            <h1 className="text-style">Meet the Team</h1>
            <h3 className="text-style">Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, voluptatibus facilis. Assumenda itaque error modi vel. Aliquam alias velit cupiditate suscipit.</h3>
            <PresidentContainer>
                <PresidentDiv1>
                    <PresidentImage src={UnknownMember} alt=""/>
                    <h4 className="text-style">Nausher Rao</h4>
                    <h5 className="text-style">Co-President</h5>
                </PresidentDiv1>
                <PresidentDiv2>
                    <PresidentImage src={UnknownMember} alt=""/>
                    <h4 className="text-style">Daner Yasin</h4>
                    <h5 className="text-style">Co-President</h5>
                </PresidentDiv2>
            </PresidentContainer>
            <GeneralMember data={data} />
        </MemberContainer>
    )

}
