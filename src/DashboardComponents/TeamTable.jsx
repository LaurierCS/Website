import styled from 'styled-components';
import NewMemberCard from './NewMemberCard';
import TeamMemberCard from './TeamMemberCard';
import { db, storage, updateProfilePicture } from '../API/firebase';
import React, { useState, useEffect, useRef } from 'react';
import { updateDoc, getDoc, getDocs, doc, deleteDoc, collection, query } from "firebase/firestore";

const CardTable = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: auto;
    grid-gap: 1rem;
    margin: 2em;

`;


export default function TeamTable() {

    const [docs, setDocsData] = useState([]);
    const renderCards = async () => {
        const q = query(collection(db, "team"));
        const querySnapshot = await getDocs(q);

        const allDocsIds = [];
        querySnapshot.forEach((doc) => { allDocsIds.push(doc.id) });

        console.log(allDocsIds);
        setDocsData(allDocsIds);
    }
    useEffect(() => {
        renderCards();
    }, []);
    return (
        <CardTable>
            {docs && docs.map((docId) => {
                return (
                    <TeamMemberCard docId={docId} />
                );
            })}

            {/* {data.map((item) => {
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
            })} */}
            <NewMemberCard />
        </CardTable>
    );

}