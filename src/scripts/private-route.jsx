import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSession } from '@hooks';

const PrivateRoute = () => {
    const currentUser = useSession();
    return currentUser ? <Outlet /> : <Navigate to="/login" />;
};
export default PrivateRoute;
