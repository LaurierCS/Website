import styled from 'styled-components';
import NewMemberCard from './NewMemberCard';
import TeamMemberCard from './TeamMemberCard';
import { db, storage, updateProfilePicture, } from '../API/firebase';
import React, { useState, useEffect, useRef } from 'react';
import { updateDoc, getDoc, getDocs, addDoc, deleteDoc, collection, query } from "firebase/firestore";

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

    function handleDelete(docRef) {
        deleteDoc(docRef);
        const newDocs = docs.filter(doc => docRef.id !== doc);
        setDocsData(newDocs);
        //deleteDoc(docRef);
    }

    function handleAdd(newName, newRole) {
        console.log(newName);
        const docRef = addDoc(collection(db, "team"), { name: newName, role: newRole });
        const newDocs = docs;
        newDocs.push(docRef.id);
        console.log(docs);
        setDocsData(newDocs);
        renderCards();
    }

    return (
        <CardTable>
            {docs && docs.map((docId) => {
                return (
                    <TeamMemberCard docId={docId} onDelete={handleDelete} />
                );
            })}
            <NewMemberCard handleAdd={handleAdd} />
        </CardTable>
    );

}