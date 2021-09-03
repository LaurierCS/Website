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
        height: 100,
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

    const [name, setName] = useState("name");
    const [role, setRole] = useState("role");

    function handleNameChange() {
        setName(nameRef.current.value);
    }

    function handleRoleChange() {
        setRole(roleRef.current.value);
    }

    return (
        <Card className={classes.root}>

            <StyledMedia
                className={classes.media}
                // image={pic}
                title="Contemplative Reptile"
            />
            <CardContent>
                <TextField inputRef={nameRef} onChange={handleNameChange} value={name} />
                <TextField inputRef={roleRef} onChange={handleRoleChange} value={role} />
                <p>(add the picture after)</p>
            </CardContent>

            <CardActions>
                <Button variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => handleAdd(name, role)}>
                    Add
                </Button>
            </CardActions>
        </Card >
    );
}

