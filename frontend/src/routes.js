import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import GroupsPage from './pages/GroupsPage';
import ExpensesPage from './pages/ExpensesPage';
import SettlementPage from './pages/SettlementPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/groups" />} />
      <Route path="/groups" element={<GroupsPage />} />
      <Route path="/groups/:groupId/expenses" element={<ExpensesPage />} />
      <Route path="/groups/:groupId/settlement" element={<SettlementPage />} />
    </Routes>
  );
}

export default AppRoutes;