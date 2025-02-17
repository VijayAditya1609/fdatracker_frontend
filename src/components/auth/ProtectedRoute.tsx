import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  
  // Check if user is authenticated by verifying token exists
  const token = localStorage.getItem('authToken');
  const isUserAuthenticated = isAuthenticated && !!token;

  if (!isUserAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/" replace />;
  }

  // Render the protected component if authenticated
  return <>{children}</>;
}