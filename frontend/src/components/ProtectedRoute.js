// src/components/ProtectedRoute.js

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    // Optionally, display a loading spinner
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};

ProtectedRoute.defaultProps = {
  requiredRole: null,
};

export default ProtectedRoute;