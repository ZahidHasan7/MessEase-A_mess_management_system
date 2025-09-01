import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, ManagerRoute } from './components/ProtectedRoute';

// Import Pages
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DailyMealEntryPage from './pages/DailyMealEntryPage.jsx';
import ExpenseManagementPage from './pages/ExpenseManagementPage.jsx';
import BazarSchedulePage from './pages/BazarSchedulePage.jsx';
import MemberManagementPage from './pages/MemberManagementPage.jsx';
import SettlementManagementPage from './pages/SettlementManagementPage.jsx';
import MonthlyReportPage from './pages/MonthlyReportPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import NoticeBoardPage from './pages/NoticeBoardPage.jsx'; // ✅ NEW: Import the new page

export const AppRouter = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Member Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            {/* ✅ NEW: Add the route for the notice board */}
            <Route path="/notice-board" element={<ProtectedRoute><NoticeBoardPage /></ProtectedRoute>} />
            <Route path="/monthly-report" element={<ProtectedRoute><MonthlyReportPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            {/* Protected Manager Routes */}
            <Route path="/daily-meal-entry" element={<ManagerRoute><DailyMealEntryPage /></ManagerRoute>} />
            <Route path="/expense-management" element={<ManagerRoute><ExpenseManagementPage /></ManagerRoute>} />
            <Route path="/bazar-schedule" element={<ManagerRoute><BazarSchedulePage /></ManagerRoute>} />
            <Route path="/member-management" element={<ManagerRoute><MemberManagementPage /></ManagerRoute>} />
            <Route path="/settlement" element={<ManagerRoute><SettlementManagementPage /></ManagerRoute>} />
            
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};