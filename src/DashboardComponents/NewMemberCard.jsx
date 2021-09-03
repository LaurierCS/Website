import styled from 'styled-components';
import { db, storage, updateProfilePicture } from '../API/firebase';
import { doc, collection, setDoc } from "firebase/firestore";

import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
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

export default function NewMemberCard() {


    const classes = useStyles();

    const nameRef = useRef();
    const roleRef = useRef();
    const picRef = useRef();


    const [edit, setEdit] = useState(false);
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [pic, setPic] = useState("");

    // const docSnap = getDoc(docRef);

    function handleClick(event) {

        // save the changes
        const newName = nameRef.current.value;
        const newRole = roleRef.current.value;


        const promises = [];
        const collectionRef = collection(db, "team");
        if (name !== newName) {
            promises.push(setDoc(collectionRef, { name: newName }));
        }
        if (role !== newRole) {
            promises.push(setDoc(collectionRef, { role: newRole }));
        }

        Promise.all(promises).then(() => {
            setEdit(!edit);

        }).catch((error) => {
            alert("Failed to update");
            console.log(error);
        });
    }


    async function fileChangedHandler(event) {
        // const file = event.target.files[0];
        // if (file) {
        //     if (file.size > 5000000) {
        //         alert("File is too large.");

        //     } else {
        //         updateProfilePicture(docId, file);
        //         alert("Picture has been changed successfully!");

        //     }

        // } else
        //     alert("Invalid file! Please try again!");
    }

    return (
        <Card className={classes.root}>

            <StyledMedia
                className={classes.media}
                image={pic}
                title="Contemplative Reptile"
            />
            <CardContent>
                <TextField inputRef={nameRef} defaultValue="name" />
                <TextField inputRef={roleRef} defaultValue="role" />
                <input type="file" id="fileButton" ref={picRef} onChange={fileChangedHandler} />
            </CardContent>

            <CardActions>
                <Button variant="contained" size="small" color="primary" onClick={handleClick}>
                    Add
                </Button>
            </CardActions>
        </Card>
    );
}

