import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userAuthState } from '../state/isAuthenticatedAtom';

const AdminProtectedRoute = () => {
    const { isAuthenticated } = useRecoilValue(userAuthState);
    const token = sessionStorage.getItem("token");
    const isSuperAdmin = sessionStorage.getItem("isSuperAdminLogin") === 'true';
    const isHR = sessionStorage.getItem("isHrLogin") === 'true';

    if (!isAuthenticated && !token) {
        return <Navigate to="/" />;
    }

    if (!isSuperAdmin && !isHR) {
        return <Navigate to="/EmployeeDashboard" />;
    }

    if (isSuperAdmin && isHR) {
        return <Outlet />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute; 