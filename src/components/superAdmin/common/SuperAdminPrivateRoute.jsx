import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const SuperAdminPrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.superAdmin);
  return token ? children : <Navigate to="/super-login" replace />;
};

export default SuperAdminPrivateRoute;
