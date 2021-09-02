import { Button, Paper } from '@material-ui/core';
import React, { useState } from 'react';
import { useAuth } from './Contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
//import styled from 'styled-components';


function Dashboard() {
    const [error, setError] = useState("");
    const { currentUser, logout } = useAuth();
    const history = useHistory();

    async function handleLogout(event) {
        setError('');
        try {
            await logout();
            history.push("/login");
        } catch {
            setError("Failed to logout");
        }
    }

    return (
        <div>
            <Paper >
                <h1>Dashboard</h1>
                {error && alert(error)}
                <h2>Profile: {currentUser.email}</h2>
            </Paper>
            <Link to="/update-profile">Update Profile</Link>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    );
}

export default Dashboard;