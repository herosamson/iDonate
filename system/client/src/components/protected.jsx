import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ userRole, allowedRoles, children }) => {
  const location = useLocation();

  useEffect(() => {
    // Store the last visited path in localStorage on mount
    localStorage.setItem('lastVisitedPath', location.pathname);
  }, [location]);

  // If user is not logged in, redirect to login page
  if (!userRole) {
    return <Navigate to="/components/login" />;
  }

  // If user role is not allowed, redirect to the home page
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  // Render children if role is authorized
  return children;
};

export default ProtectedRoute;

