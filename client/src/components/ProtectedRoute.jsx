import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div style={{ padding: '6rem 2rem', textAlign: 'center', color: '#94a3b8' }}>Loading securely...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If the user's role is not in the allowed roles, redirect
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
