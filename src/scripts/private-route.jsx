import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useFirebaseAuth } from '@hooks';

const PrivateRoute = () => {
    const { currentUser } = useFirebaseAuth();
    return currentUser ? <Outlet /> : <Navigate to="/login" />;
};
export default PrivateRoute;
