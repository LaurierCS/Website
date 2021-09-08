import React, { useState, useEffect } from "react";
import styled from "styled-components";
import UnknownMember from "./Assets/UnknownMember.png";
import GeneralMember from "./GeneralMember";
import allDocsData from "./data";

import PresPic1 from "./Assets/nausher.png";
import PresPic2 from "./Assets/daner.jpg";

const MemberContainer = styled.div`
    display: flex;
    width: 80%;

    margin-left: auto;
    margin-right: auto;

    padding-bottom: 2em;
    align-items: center;
    flex-direction: column;
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

export default function TeamMember() {

  /*
  ============= NOTE ================
  Presidents are hard-coded, and not pulled from db
  so just keep that in mind below!
  ===================================
  */
  return (
    <MemberContainer>
      <Title className="text-style">Meet the Team</Title>
      <Subheader className="text-style">
      </Subheader>
      <PresidentContainer>
        <PresidentDiv1>
          <PresidentImage src={PresPic1} alt="" />
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
          <PresidentImage src={PresPic2} alt="" />
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
      <GeneralMember data={allDocsData} />
    </MemberContainer>
  );
}
