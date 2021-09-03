import styled from 'styled-components';
import { db, storage, updateProfilePicture } from '../API/firebase';
import { addDoc, collection, setDoc } from "firebase/firestore";

import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';

import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';

import { TextField } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        maxWidth: 250,
    },
    media: {
        height: 140,
    },
});


const StyledMedia = styled(CardMedia)`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    background-color: grey;
    margin-left: 1em;

`;

export default function NewMemberCard({ handleAdd }) {
    const classes = useStyles();
    const nameRef = useRef();
    const roleRef = useRef();
    // const picRef = useRef();
    // const [edit, setEdit] = useState(false);
    // const [name, setName] = useState("");
    // const [role, setRole] = useState("");
    // const [pic, setPic] = useState("");
    // const docSnap = getDoc(docRef);
    // function handleClick(event) {
    //     // save the changes
    //     const newName = nameRef.current.value;
    //     const newRole = roleRef.current.value;
    //     const promises = [];
    //     promises.push(addDoc(collection(db, "team"), { name: newName, role: newRole }));
    //     // const newDocs = docs.push(docRef.id);
    //     // setDocsData(newDocs);
    //     Promise.all(promises).then((docRef) => {
    //         // add to the table array

    //     }).catch((error) => {
    //         alert("Failed to create");
    //         console.log(error);
    //     });
    // }
    return (
        <Card className={classes.root}>

            <StyledMedia
                className={classes.media}
                // image={pic}
                title="Contemplative Reptile"
            />
            <CardContent>
                <TextField inputRef={nameRef} defaultValue="name" />
                <TextField inputRef={roleRef} defaultValue="role" />
                <p>(add the picture after)</p>
            </CardContent>

            <CardActions>
                <Button variant="contained" size="small" color="primary" onClick={() => handleAdd(nameRef.current.value, roleRef.current.value)}>
                    Add
                </Button>
            </CardActions>
        </Card >
    );
}

