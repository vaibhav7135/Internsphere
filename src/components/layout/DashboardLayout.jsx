import { useState } from 'react';
import { Outlet, Navigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

const DashboardLayout = ({ allowedRole }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return (
    <div className={`dashboard-layout ${collapsed ? 'dashboard-layout--collapsed' : ''}`}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="dashboard-layout__main">
        <div className="dashboard-layout__content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
