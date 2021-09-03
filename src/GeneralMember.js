import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "./API/firebase";
import { query, collection, getDocs } from "firebase/firestore";

function GeneralMember({ data }) {

  const [docs, setDocsData] = useState([]);
  const renderCards = async () => {
    const q = query(collection(db, "team"));
    const querySnapshot = await getDocs(q);

    const allDocsIds = [];
    querySnapshot.forEach((doc) => { allDocsIds.push(doc.data()) });

    console.log(allDocsIds);
    setDocsData(allDocsIds);
  }
  useEffect(() => {
    renderCards();
  }, []);


  return (
    <MemberStyled>
      {docs && docs.map((item, index) => {
        return (
          <div className="grid-item" key={index}>
            <div className="member-content">
              <div className="member-image">
                <img src={item.pic} alt="" />
              </div>
              <h6>{item.name}</h6>
              <p>{item.role}</p>
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
      display: flex;
      position: relative;
      overflow: hidden;
      align-items: center;
      flex-direction: column;
      h6 {
        font-family: Rubik;
        font-style: normal;
        font-weight: 100;
        font-size: 1.5rem;
        color: white;
        margin-bottom: 0;
        margin-top: 0;
        text-align: center;
      }
      p {
        font-family: Rubik;
        font-style: normal;
        font-weight: 100;
        color: white;
        text-align: center;
        font-size: 0.75rem;
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
