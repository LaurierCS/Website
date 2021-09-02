import { useState, useRef } from 'react';
import { Paper, TextField, Button } from '@material-ui/core';

import { Link, useHistory } from 'react-router-dom';
import { AuthProvider, useAuth } from './Contexts/AuthContext';

import styled from 'styled-components';

const PageContainer = styled.div`
    
    background: linear-gradient(45deg, #6CB3FF, #89F7FE);
    width: 100vw;
    height: 100vh;    
    display: grid;
    place-items: center;
`;

const StyledPaper = styled(Paper)`
    position: relative;    
    font-family: "Work Sans";
    display: grid;
    max-width: 30em;
    width: 80%;
    padding-bottom: 1em;
    padding: 2em;
`;

const Title = styled.h1`
    font-family: "Rubik";
    font-style: normal;
    font-weight: bold;
    font-size: 3em;
    text-align: center;
    color: #000000;
`;

const StyledForm = styled.div`
    display: grid;
    grid-row-gap: 0.5em;
    margin: 1em;
`;

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();

    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    async function handleSubmit(event) {
        event.preventDefault();

        const password = passwordRef.current.value;
        const email = emailRef.current.value;

        try {
            setError('');
            setLoading(true);
            await login(email, password);
            history.push("/dashboard");
        } catch (error) {
            setError("Failed to login");
            console.log(error);
        }

        setLoading(false);

    }

    return (
        <AuthProvider>
            <PageContainer>
                <StyledPaper>
                    <Title>LCS Admin Login</Title>
                    {error && <p >{error}</p>}
                    <StyledForm>
                        <TextField required inputRef={emailRef} label="Email"></TextField>
                        <TextField required inputRef={passwordRef} label="Password"></TextField>
                        <Button color="primary" variant="contained" onClick={handleSubmit} disabled={loading}>Login</Button>
                    </StyledForm>

                    <div>
                        <Link to="/forgot-password">Forgot password?</Link>
                    </div>

                </StyledPaper>

            </PageContainer >
        </AuthProvider >
    );
}