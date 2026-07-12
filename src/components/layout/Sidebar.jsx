import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  GraduationCap, LayoutDashboard, BookOpen, FileText, ClipboardCheck,
  FolderUp, BarChart3, Award, CreditCard, User, LogOut,
  Users, Upload, PenTool, MessageSquare, CheckCircle, Settings,
  Briefcase, UserCheck, DollarSign, FileCheck, PieChart,
  ChevronLeft, ChevronRight, Menu, X, Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const menuItems = {
  student: [
    { path: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/student/modules', icon: BookOpen, label: 'Learning Modules' },
    { path: '/student/assignments', icon: FileText, label: 'Assignments' },
    { path: '/student/assessments', icon: ClipboardCheck, label: 'Assessments' },
    { path: '/student/project', icon: FolderUp, label: 'Project Submission' },
    { path: '/student/progress', icon: BarChart3, label: 'Progress Tracker' },
    { path: '/student/profile', icon: User, label: 'Profile' },
  ],
  mentor: [
    { path: '/mentor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/mentor/students', icon: Users, label: 'Assigned Students' },
    { path: '/mentor/materials', icon: Upload, label: 'Upload Materials' },
    { path: '/mentor/assignments', icon: PenTool, label: 'Create Assignments' },
    { path: '/mentor/assessments', icon: ClipboardCheck, label: 'Create Assessments' },
    { path: '/mentor/reviews', icon: FileCheck, label: 'Review Submissions' },
    { path: '/mentor/feedback', icon: MessageSquare, label: 'Give Feedback' },
    { path: '/mentor/projects', icon: CheckCircle, label: 'Approve Projects' },
    { path: '/mentor/certificates', icon: Award, label: 'Distribute Certificates' },
  ],
  admin: [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/students', icon: Users, label: 'Manage Students' },
    { path: '/admin/mentors', icon: UserCheck, label: 'Manage Mentors' },
    { path: '/admin/programs', icon: Briefcase, label: 'Manage Programs' },
    { path: '/admin/batches', icon: Layers, label: 'Manage Batches' },
    { path: '/admin/certificates', icon: Award, label: 'Generate Certificates' },
    { path: '/admin/verify', icon: FileCheck, label: 'Verify Certificates' },
    { path: '/admin/reports', icon: PieChart, label: 'View Reports' },
  ],
};

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const items = menuItems[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <button className="sidebar__mobile-toggle" onClick={() => setMobileOpen(true)}>
        <Menu size={22} />
      </button>

      {mobileOpen && (
        <div className="sidebar__overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${mobileOpen ? 'sidebar--mobile-open' : ''}`}>
        <div className="sidebar__header">
          <Link to="/" className="sidebar__logo">
            <div className="sidebar__logo-icon">
              <GraduationCap size={20} />
            </div>
            {!collapsed && <span className="sidebar__logo-text">InternSphere</span>}
          </Link>
          <button className="sidebar__close-mobile" onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar__user">
          <div className="sidebar__avatar">{user?.avatar}</div>
          {!collapsed && (
            <div className="sidebar__user-info">
              <p className="sidebar__user-name">{user?.name}</p>
              <p className="sidebar__user-role">{user?.role}</p>
            </div>
          )}
        </div>

        <nav className="sidebar__nav">
          <ul className="sidebar__list">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`sidebar__item ${isActive ? 'sidebar__item--active' : ''}`}
                    title={collapsed ? item.label : ''}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon size={20} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar__footer">
          <button
            className="sidebar__item sidebar__item--logout"
            onClick={handleLogout}
            title={collapsed ? 'Logout' : ''}
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>

          <button
            className="sidebar__collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
