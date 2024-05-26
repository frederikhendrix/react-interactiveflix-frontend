import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children, roles }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Add your logic to check for user roles here
  // Example: if (!roles.includes(currentUser.role)) { return <Navigate to="/unauthorized" />; }

  return children;
};

export default PrivateRoute;
