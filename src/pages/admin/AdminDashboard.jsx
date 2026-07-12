import { useState } from 'react';
import { Link } from 'react-router';
import {
  Users,
  UserCheck,
  BookOpen,
  TrendingUp,
  ArrowUpRight,
  GraduationCap,
  Award,
  FileText,
  Calendar,
  Eye,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const registrationsData = [
  { month: 'Feb', registrations: 52 },
  { month: 'Mar', registrations: 68 },
  { month: 'Apr', registrations: 74 },
  { month: 'May', registrations: 89 },
  { month: 'Jun', registrations: 105 },
  { month: 'Jul', registrations: 97 },
];

const recentRegistrations = [
  { id: 1, name: 'Aarav Patel', program: 'Web Development', date: '2026-07-10', status: 'active' },
  { id: 2, name: 'Sneha Reddy', program: 'Data Science', date: '2026-07-09', status: 'active' },
  { id: 3, name: 'Karthik Nair', program: 'Machine Learning', date: '2026-07-08', status: 'pending' },
  { id: 4, name: 'Priya Singh', program: 'UI/UX Design', date: '2026-07-07', status: 'active' },
  { id: 5, name: 'Rahul Gupta', program: 'Web Development', date: '2026-07-06', status: 'pending' },
];

const quickActions = [
  {
    title: 'Manage Students',
    description: 'View, approve, and manage student enrollments',
    icon: Users,
    link: '/admin/students',
    color: 'blue',
  },
  {
    title: 'Generate Certificates',
    description: 'Issue certificates for completed internships',
    icon: Award,
    link: '/admin/certificates',
    color: 'green',
  },
  {
    title: 'View Reports',
    description: 'Analytics, enrollment trends, and performance reports',
    icon: FileText,
    link: '/admin/reports',
    color: 'yellow',
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="admin-dash__chart-tooltip">
        <p className="admin-dash__chart-tooltip-label">{label}</p>
        <p className="admin-dash__chart-tooltip-value">{payload[0].value} Enrolled</p>
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const { user } = useAuth();

  const statsCards = [
    { title: 'Total Students', value: '156', change: '+12%', icon: Users, color: 'blue' },
    { title: 'Active Mentors', value: '12', change: '+2', icon: UserCheck, color: 'green' },
    { title: 'Active Programs', value: '8', change: '+1', icon: BookOpen, color: 'red' },
  ];

  const getStatusBadge = (status) => {
    const classMap = {
      active: 'badge badge--success',
      pending: 'badge badge--warning',
      completed: 'badge badge--primary',
    };
    return classMap[status] || 'badge badge--primary';
  };

  return (
    <div className="admin-dash">
      <div className="admin-dash__header animate-fadeInUp">
        <div>
          <h1 className="admin-dash__title">Admin Dashboard</h1>
          <p className="admin-dash__subtitle">
            Welcome back, {user?.name || 'Admin'}! Here's what's happening today.
          </p>
        </div>
        <div className="admin-dash__header-date">
          <Calendar size={18} />
          <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="admin-dash__stats animate-fadeInUp delay-1">
        {statsCards.map((stat, index) => (
          <div className="stats-card" key={index}>
            <div className={`stats-card__icon stats-card__icon--${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div className="stats-card__info">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
            <span className="admin-dash__stats-change">
              <TrendingUp size={14} />
              {stat.change}
            </span>
          </div>
        ))}
      </div>

      <div className="admin-dash__grid animate-fadeInUp delay-2">
        <div className="admin-dash__chart-card card">
          <div className="admin-dash__chart-header">
            <h3>Enrollments Overview</h3>
            <span className="badge badge--primary">Last 6 Months</span>
          </div>
          <div className="admin-dash__chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={registrationsData} barSize={36} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 13 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 13 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(37, 99, 235, 0.06)' }} />
                <Bar dataKey="registrations" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-dash__registrations card">
          <div className="admin-dash__chart-header">
            <h3>Recent Registrations</h3>
            <Link to="/admin/students" className="admin-dash__view-all">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Program</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentRegistrations.map((reg) => (
                  <tr key={reg.id}>
                    <td>
                      <div className="admin-dash__student-info">
                        <div className="admin-dash__student-avatar">
                          {reg.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span>{reg.name}</span>
                      </div>
                    </td>
                    <td>{reg.program}</td>
                    <td>{new Date(reg.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                    <td>
                      <span className={getStatusBadge(reg.status)}>
                        {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn--ghost btn--sm">
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="admin-dash__quick-actions animate-fadeInUp delay-3">
        <h3 className="admin-dash__section-title">Quick Actions</h3>
        <div className="admin-dash__actions-grid">
          {quickActions.map((action, index) => (
            <Link to={action.link} className="admin-dash__action-card card" key={index}>
              <div className={`admin-dash__action-icon admin-dash__action-icon--${action.color}`}>
                <action.icon size={24} />
              </div>
              <h4>{action.title}</h4>
              <p>{action.description}</p>
              <span className="admin-dash__action-link">
                Go to {action.title} <ArrowUpRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
