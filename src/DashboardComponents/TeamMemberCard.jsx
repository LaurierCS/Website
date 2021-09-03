import styled from 'styled-components';
import { db, storage, updateProfilePicture } from '../API/firebase';
import { updateDoc, getDoc, doc, deleteDoc } from "firebase/firestore";

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
    background-color: white;
    margin-left: 1em;

`;

export default function TeamMemberCard({ docId }) {
    const docRef = doc(db, "team", docId);

    const classes = useStyles();

    const nameRef = useRef();
    const roleRef = useRef();
    const picRef = useRef();


    const [edit, setEdit] = useState(false);
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [pic, setPic] = useState("");


    const fetchData = async () => {
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        console.log(data);
        setName(data.name);
        setRole(data.role);
        setPic(data.pic);
    }
    useEffect(() => {
        fetchData();
    }, []);
    // const docSnap = getDoc(docRef);

    function handleClick(event) {
        if (!edit) {
            setEdit(!edit);
            return;
        }
        // save the changes
        const newName = nameRef.current.value;
        const newRole = roleRef.current.value;

        setPic(pic);

        const promises = [];

        if (name !== newName) {
            promises.push(updateDoc(docRef, { name: newName }));
        }
        if (role !== newRole) {
            promises.push(updateDoc(docRef, { role: newRole }));
        }

        Promise.all(promises).then(() => {
            fetchData();
            setEdit(!edit);

        }).catch((error) => {
            alert("Failed to update");
            console.log(error);
        });
    }


    async function fileChangedHandler(event) {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 5000000) {
                alert("File is too large.");

            } else {
                updateProfilePicture(docId, file);
                alert("Picture has been changed successfully!");

            }

        } else
            alert("Invalid file! Please try again!");
    }

    async function handleDelete() {
        deleteDoc(docRef);
    }

    return (
        <Card className={classes.root}>

            <StyledMedia
                className={classes.media}
                image={pic}
                title="Contemplative Reptile"
            />
            <CardContent>
                {!edit ?
                    <Typography gutterBottom variant="h5" component="h2">
                        {name}
                    </Typography>
                    : <TextField inputRef={nameRef} defaultValue={name} />}
                {!edit ?
                    <Typography variant="body2" color="textSecondary" component="p">
                        {role}
                    </Typography>
                    : <TextField inputRef={roleRef} defaultValue={role} />}
                {edit && <input type="file" id="fileButton" ref={picRef} onChange={fileChangedHandler} />}
            </CardContent>

            <CardActions>
                <Button variant="contained" size="small" color="primary" onClick={handleClick}>
                    {edit ? "Save" : "Edit"}
                </Button>
                <Button onClick={handleDelete}>
                    Delete
                </Button>
            </CardActions>
        </Card>
    );
}

