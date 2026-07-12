import { useState } from 'react';
import { Link } from 'react-router';
import {
  Users,
  ClipboardCheck,
  FolderCheck,
  Star,
  Upload,
  FilePlus,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import './MentorDashboard.css';

const progressData = [
  { name: 'Completed', value: 8, color: '#10B981' },
  { name: 'On Track', value: 10, color: '#2563EB' },
  { name: 'Needs Help', value: 4, color: '#F59E0B' },
  { name: 'At Risk', value: 2, color: '#EF4444' },
];

const recentSubmissions = [
  {
    id: 1,
    student: 'Aarav Patel',
    avatar: 'AP',
    assignment: 'React Todo App',
    date: '2026-07-10',
    status: 'pending',
  },
  {
    id: 2,
    student: 'Sneha Reddy',
    avatar: 'SR',
    assignment: 'REST API Integration',
    date: '2026-07-09',
    status: 'reviewed',
  },
  {
    id: 3,
    student: 'Rahul Gupta',
    avatar: 'RG',
    assignment: 'CSS Grid Layout',
    date: '2026-07-09',
    status: 'pending',
  },
  {
    id: 4,
    student: 'Ananya Das',
    avatar: 'AD',
    assignment: 'Node.js Authentication',
    date: '2026-07-08',
    status: 'revision',
  },
  {
    id: 5,
    student: 'Karthik Nair',
    avatar: 'KN',
    assignment: 'MongoDB CRUD Operations',
    date: '2026-07-08',
    status: 'reviewed',
  },
];

const statsCards = [
  {
    label: 'Total Students',
    value: '24',
    icon: Users,
    color: 'blue',
    change: '+3 this month',
  },
  {
    label: 'Pending Reviews',
    value: '8',
    icon: ClipboardCheck,
    color: 'yellow',
    change: '3 new today',
  },
  {
    label: 'Approved Projects',
    value: '5',
    icon: FolderCheck,
    color: 'green',
    change: '+2 this week',
  },
  {
    label: 'Average Rating',
    value: '4.8',
    icon: Star,
    color: 'red',
    change: '↑ 0.2 from last month',
  },
];

const statusConfig = {
  pending: { label: 'Pending', className: 'badge--warning', icon: Clock },
  reviewed: { label: 'Reviewed', className: 'badge--success', icon: CheckCircle },
  revision: { label: 'Revision Needed', className: 'badge--danger', icon: XCircle },
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="mentor-dash__chart-tooltip">
        <p className="mentor-dash__chart-tooltip-label">{payload[0].name}</p>
        <p className="mentor-dash__chart-tooltip-value">
          {payload[0].value} students
        </p>
      </div>
    );
  }
  return null;
};

const MentorDashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Mentor';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="mentor-dash">
      {/* Welcome Header */}
      <div className="mentor-dash__header animate-fadeInUp">
        <div className="mentor-dash__header-content">
          <h1 className="mentor-dash__title">
            {getGreeting()}, <span className="text-gradient">{firstName}</span> 👋
          </h1>
          <p className="mentor-dash__subtitle">
            Here's what's happening with your students today.
          </p>
        </div>
        <div className="mentor-dash__header-date">
          <Clock size={16} />
          <span>
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mentor-dash__stats">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`stats-card animate-fadeInUp delay-${index + 1}`}
            >
              <div className={`stats-card__icon stats-card__icon--${stat.color}`}>
                <Icon size={24} />
              </div>
              <div className="stats-card__info">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
                <span className="mentor-dash__stat-change">
                  <TrendingUp size={12} />
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="mentor-dash__grid">
        {/* Recent Submissions */}
        <div className="card mentor-dash__submissions animate-fadeInUp delay-3">
          <div className="mentor-dash__card-header">
            <h2 className="mentor-dash__card-title">
              <ClipboardCheck size={20} />
              Recent Submissions
            </h2>
            <Link to="/dashboard/review-submissions" className="btn btn--ghost btn--sm">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mentor-dash__submission-list">
            {recentSubmissions.map((sub) => {
              const config = statusConfig[sub.status];
              const StatusIcon = config.icon;
              return (
                <div key={sub.id} className="mentor-dash__submission-item">
                  <div className="mentor-dash__submission-left">
                    <div className="mentor-dash__submission-avatar">{sub.avatar}</div>
                    <div className="mentor-dash__submission-info">
                      <h4>{sub.student}</h4>
                      <p>{sub.assignment}</p>
                    </div>
                  </div>
                  <div className="mentor-dash__submission-right">
                    <span className="mentor-dash__submission-date">
                      {new Date(sub.date).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className={`badge ${config.className}`}>
                      <StatusIcon size={12} />
                      {config.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="mentor-dash__right-col">
          {/* Student Progress Chart */}
          <div className="card mentor-dash__chart-card animate-fadeInUp delay-4">
            <h2 className="mentor-dash__card-title">
              <TrendingUp size={20} />
              Student Progress
            </h2>
            <div className="mentor-dash__chart-wrapper">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={progressData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {progressData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mentor-dash__chart-center">
                <span className="mentor-dash__chart-center-value">24</span>
                <span className="mentor-dash__chart-center-label">Total</span>
              </div>
            </div>
            <div className="mentor-dash__chart-legend">
              {progressData.map((item) => (
                <div key={item.name} className="mentor-dash__chart-legend-item">
                  <span
                    className="mentor-dash__chart-legend-dot"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="mentor-dash__chart-legend-text">{item.name}</span>
                  <span className="mentor-dash__chart-legend-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card mentor-dash__actions animate-fadeInUp delay-5">
            <h2 className="mentor-dash__card-title">Quick Actions</h2>
            <div className="mentor-dash__actions-grid">
              <Link to="/dashboard/upload-materials" className="mentor-dash__action-btn">
                <div className="mentor-dash__action-icon mentor-dash__action-icon--blue">
                  <Upload size={20} />
                </div>
                <span>Upload Material</span>
              </Link>
              <Link to="/dashboard/create-assignments" className="mentor-dash__action-btn">
                <div className="mentor-dash__action-icon mentor-dash__action-icon--green">
                  <FilePlus size={20} />
                </div>
                <span>Create Assignment</span>
              </Link>
              <Link to="/dashboard/review-submissions" className="mentor-dash__action-btn">
                <div className="mentor-dash__action-icon mentor-dash__action-icon--yellow">
                  <Eye size={20} />
                </div>
                <span>Review Submissions</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
