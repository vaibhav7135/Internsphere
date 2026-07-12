import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  Users,
  UserCheck,
  BookOpen,
  TrendingUp,
  ArrowUpRight,
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
import { internships } from '../../data/internships';
import './AdminDashboard.css';

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

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="admin-dash__chart-tooltip">
        <p className="admin-dash__chart-tooltip-label">{data.fullName}</p>
        <p className="admin-dash__chart-tooltip-value">{payload[0].value} Enrolled</p>
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeMentors: 0,
    activePrograms: internships.length,
    newStudentsThisWeek: 0,
    newMentorsThisWeek: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [recentRegistrations, setRecentRegistrations] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => (res.ok ? res.json() : []))
      .then((allUsers) => {
        const students = allUsers.filter((u) => u.role === 'student');
        const mentors = allUsers.filter((u) => u.role === 'mentor');

        // Calculate students registered in the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const newStudents = students.filter((s) => {
          if (!s.enrolledDate) return false;
          try {
            return new Date(s.enrolledDate) >= sevenDaysAgo;
          } catch {
            return false;
          }
        }).length;

        // Calculate new mentors this week
        const newMentors = mentors.filter((m) => {
          if (!m.enrolledDate) return false;
          try {
            return new Date(m.enrolledDate) >= sevenDaysAgo;
          } catch {
            return false;
          }
        }).length;

        // Set basic counts
        setStats({
          totalStudents: students.length,
          activeMentors: mentors.length,
          activePrograms: internships.length,
          newStudentsThisWeek: newStudents,
          newMentorsThisWeek: newMentors,
        });

        // Get 5 most recent registrations
        const sortedStudents = [...students]
          .sort((a, b) => {
            const dateA = a.enrolledDate ? new Date(a.enrolledDate) : new Date(0);
            const dateB = b.enrolledDate ? new Date(b.enrolledDate) : new Date(0);
            return dateB - dateA;
          })
          .slice(0, 5)
          .map((s) => ({
            id: s.id,
            name: s.name,
            program: s.enrolledProgram || 'Web Development',
            date: s.enrolledDate || new Date().toISOString().split('T')[0],
            status: s.status || 'pending',
          }));
        setRecentRegistrations(sortedStudents);

        // Group students by program domain for chart
        const programCounts = students.reduce((acc, s) => {
          const prog = s.enrolledProgram || 'Web Development';
          acc[prog] = (acc[prog] || 0) + 1;
          return acc;
        }, {});

        // Build chartData matching actual programs
        const builtChartData = internships.map((internship) => {
          // Extract initials of the program title e.g. "Web Development" -> "WD"
          const initials = internship.title
            .split(' ')
            .map((w) => w[0])
            .join('');
          return {
            program: initials,
            fullName: internship.title,
            registrations: programCounts[internship.title] || 0,
          };
        });
        setChartData(builtChartData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load admin stats:', err);
        setLoading(false);
      });
  }, []);

  const statsCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      change: `+${stats.newStudentsThisWeek} this week`,
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Active Mentors',
      value: stats.activeMentors,
      change: `+${stats.newMentorsThisWeek} this week`,
      icon: UserCheck,
      color: 'green',
    },
    {
      title: 'Active Programs',
      value: stats.activePrograms,
      change: `Total ${stats.activePrograms} Live`,
      icon: BookOpen,
      color: 'red',
    },
  ];

  const getStatusBadge = (status) => {
    const classMap = {
      active: 'badge badge--success',
      pending: 'badge badge--warning',
      completed: 'badge badge--primary',
    };
    return classMap[status] || 'badge badge--primary';
  };

  if (loading) {
    return (
      <div className="admin-dash" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '350px' }}>
        <div className="spinner" />
      </div>
    );
  }

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
            <span className="badge badge--primary">By Program Domain</span>
          </div>
          <div className="admin-dash__chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} barSize={32} margin={{ top: 5, right: 5, left: -22, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis
                  dataKey="program"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 11, fontWeight: 500 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
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
                    <td>
                      {reg.date ? new Date(reg.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
                    </td>
                    <td>
                      <span className={getStatusBadge(reg.status)}>
                        {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <Link to="/admin/students" className="btn btn--ghost btn--sm">
                        <Eye size={14} /> View
                      </Link>
                    </td>
                  </tr>
                ))}
                {recentRegistrations.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center" style={{ padding: '24px 0', color: 'var(--text-secondary)' }}>
                      No recent student registrations found.
                    </td>
                  </tr>
                )}
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
