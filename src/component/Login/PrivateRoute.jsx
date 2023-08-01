import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, redirectTo }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  return isAuthenticated ? children : <Navigate to={redirectTo} />;
};

export default PrivateRoute;
