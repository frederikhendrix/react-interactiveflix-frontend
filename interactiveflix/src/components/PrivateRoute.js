import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children, roles }) => {
  const { currentUser, role } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  if (!roles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PrivateRoute;
