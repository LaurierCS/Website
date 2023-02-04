import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from './hooks/auth';

const PrivateRoute = () => {
    const { currentUser } = useContext(AuthContext);
    return currentUser ? <Outlet /> : <Navigate to="/login" />;
};
export default PrivateRoute;
