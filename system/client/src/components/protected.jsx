import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ userRole, allowedRoles, children }) => {
  if (!userRole) {
    return <Navigate to="/components/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
