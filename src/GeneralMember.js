import React from "react";
import styled from "styled-components";

function GeneralMember({ data }) {
  return (
    <MemberStyled>
      {data.map((item) => {
        return (
          <div className="grid-item" key={item.id}>
            <div className="member-content">
              <div className="member-image">
                <img src={item.image} alt="" />
              </div>
              <h6>{item.name}</h6>
              <p>{item.position}</p>
            </div>
          </div>
        );
      })}
    </MemberStyled>
  );
}

const MemberStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 1rem;
  @media screen and (max-width: 920px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media screen and (max-width: 670px) {
    grid-template-columns: repeat(2, 1fr);
  }
  .grid-item {
    .member-content {
      display: block;
      position: relative;
      overflow: hidden;
      h6 {
        font-family: Rubik;
        font-style: normal;
        font-weight: 100;
        font-size: 1.5rem;
        color: white;
        margin-bottom: 0;
        margin-top: 0;
      }
      p {
        font-family: Rubik;
        font-style: normal;
        font-weight: 100;
        color: white;
      }
      img {
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        object-fit: cover;
        background-color: white;
      }
    }
  }
`;

export default GeneralMember;
