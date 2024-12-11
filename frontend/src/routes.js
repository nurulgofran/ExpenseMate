import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import GroupsPage from './pages/GroupsPage';
import ExpensesPage from './pages/ExpensesPage';
import SettlementPage from './pages/SettlementPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

function AppRoutes() {
  const token = localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/" element={token ? <Navigate to="/groups" /> : <Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/groups" element={token ? <GroupsPage /> : <Navigate to="/login" />} />
      <Route path="/groups/:groupId/expenses" element={token ? <ExpensesPage /> : <Navigate to="/login" />} />
      <Route path="/groups/:groupId/settlement" element={token ? <SettlementPage /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default AppRoutes;