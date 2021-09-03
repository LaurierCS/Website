import styled from 'styled-components';
import NewMemberCard from './NewMemberCard';
import TeamMemberCard from './TeamMemberCard';
import { db, storage, updateProfilePicture, } from '../API/firebase';
import React, { useState, useEffect, useRef } from 'react';
import { updateDoc, getDoc, getDocs, addDoc, deleteDoc, collection, query } from "firebase/firestore";
import { Button } from "@material-ui/core";

const CardTable = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1rem;
    margin: 2em;

`;


export default function TeamTable() {
    const [refresh, setRefresh] = useState(false);

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
        const newDocs = [...docs];
        addDoc(collection(db, "team"), { name: newName, role: newRole })
            .then((docRef) => {

                newDocs.push(docRef.id);
                console.log(newDocs.length);

            });
        setDocsData(newDocs); // ig this does nothing because it wont re-render
    }

    // sloppy refresh because handleAdd wont refresh the stupid table...
    function handleRefresh() {
        setRefresh(!refresh);
    }


    return (
        <div>
            <Button variant="outlined" onClick={handleRefresh}>Refresh Table</Button>
            <CardTable>

                {docs && docs.map((docId) => {
                    return (
                        <TeamMemberCard docId={docId} onDelete={handleDelete} />
                    );
                })}
                <NewMemberCard handleAdd={handleAdd} />
            </CardTable>
        </div>
    );

}