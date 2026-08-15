import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const WholesaleRoute: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="py-16">
        <LoadingSpinner label="Checking wholesale partner credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.wholesaleStatus !== 'approved' && user?.role !== 'admin') {
    return <Navigate to="/wholesale" replace />;
  }

  return <Outlet />;
};
