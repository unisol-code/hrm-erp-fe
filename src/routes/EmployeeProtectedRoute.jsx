import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAuthState } from "../state/isAuthenticatedAtom";

const EmployeeProtectedRoute = () => {
  const { isAuthenticated } = useRecoilValue(userAuthState);
  const token = sessionStorage.getItem("token");
  const isEmployeeLogin = sessionStorage.getItem("isEmployeeLogin") === "true";
  const isSuperAdmin = sessionStorage.getItem("isSuperAdminLogin") === "true";
  const isHR = sessionStorage.getItem("isHrLogin") === "true";

  if (!isAuthenticated && !token) {
    return <Navigate to="/" />;
  }

  if (isSuperAdmin && isHR) {
    return <Navigate to="/hrDashboard" />;
  }

  if (isEmployeeLogin) {
    return <Outlet />;
  }

  return <Navigate to="/" />;
};

export default EmployeeProtectedRoute;
