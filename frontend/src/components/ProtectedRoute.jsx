// src/components/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';

// Protects routes for any logged-in user
export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or a spinner component
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return <AppLayout>{children}</AppLayout>;
};

// Protects routes for managers only
export const ManagerRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.role !== 'manager') {
        return <Navigate to="/dashboard" />; // Or an "Access Denied" page
    }

    return <AppLayout>{children}</AppLayout>;
};