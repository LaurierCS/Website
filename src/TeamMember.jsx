import React from "react";
import styled from "styled-components";
import UnknownMember from "./Assets/UnknownMember.png";
import GeneralMember from "./GeneralMember";
import data from "./data";

export default function TeamMember() {
  const MemberContainer = styled.div`
    display: flex;
    width: 80%;
    
    margin-left: auto;
    margin-right: auto;

    padding-bottom: 2em;
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
    justify-content: center
    flex-direction: row;
    flex-wrap: wrap;
  `;
  const PresidentDiv1 = styled.div`
    display: flex;
    flex-direction: column;
    margin: 1em;
    align-items: center;
  `;
  const PresidentDiv2 = styled.div`
    display: flex;
    flex-direction: column;
    margin: 1em;
    align-items: center;
  `;
  const PresidentImage = styled.img`
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    background-color: white;
  `;

  const Title = styled.h1`
    font-family: Rubik;
    font-style: normal;
    font-weight: 100;
    font-size: clamp(2em, 5vw, 4em);
    margin-top: 50px;
    margin-left: 0.5em;
    margin-bottom: 0.5em;
  `;
  const Subheader = styled.h2`
    text-align: center;
    padding-bottom: 1em;
  `;

  return (
    <MemberContainer>
      <Title className="text-style">Meet the Team</Title>
      <Subheader className="text-style">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae,
        voluptatibus facilis. Assumenda itaque error modi vel. Aliquam alias
        velit cupiditate suscipit.
      </Subheader>
      <PresidentContainer>
        <PresidentDiv1>
          <PresidentImage src={UnknownMember} alt="" />
          <h4
            className="text-style"
            style={{ fontSize: "2rem", marginBottom: "0", marginTop: "1.5rem" }}
          >
            Nausher Rao
          </h4>
          <h5
            className="text-style"
            style={{ fontSize: "1rem", textAlign: "center" }}
          >
            Co-President
          </h5>
        </PresidentDiv1>
        <PresidentDiv2>
          <PresidentImage src={UnknownMember} alt="" />
          <h4
            className="text-style"
            style={{ fontSize: "2rem", marginBottom: "0", marginTop: "1.5rem" }}
          >
            Daner Yasin
          </h4>
          <h5
            className="text-style"
            style={{ fontSize: "1rem", textAlign: "center" }}
          >
            Co-President
          </h5>        </PresidentDiv2>
      </PresidentContainer>
      <GeneralMember data={data} />
    </MemberContainer>
  );
}
