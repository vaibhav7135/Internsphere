import { useState } from 'react';
import { Link } from 'react-router';
import {
  TrendingUp,
  CheckCircle2,
  Award,
  Clock,
  Calendar,
  FileText,
  BookOpen,
  MessageSquare,
  BarChart3,
  ArrowUpRight,
  Bell,
  Activity,
  AlertCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();

  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-IN', options);

  const progress = user?.progress || 0;
  const assignmentsCompleted = user?.assignmentsCompleted !== undefined ? user.assignmentsCompleted : 0;
  const totalAssignments = user?.assignments?.length ? user.assignments.length : 8;
  const assessmentsPassed = user?.assessmentsPassed !== undefined ? user.assessmentsPassed : 0;
  const totalAssessments = user?.assessments?.length ? user.assessments.length : 5;
  
  // Compute days remaining based on enrolled date (assume 60 days total duration)
  const enrolled = user?.enrolledDate ? new Date(user.enrolledDate) : new Date();
  let daysRemaining = 60;
  if (today >= enrolled) {
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const enrolledStart = new Date(enrolled.getFullYear(), enrolled.getMonth(), enrolled.getDate());
    const diffTime = todayStart - enrolledStart;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    daysRemaining = Math.max(0, 60 - diffDays);
  }

  // Load real dynamic upcoming deadlines from student's actual pending assignments
  const pendingAssignments = (user?.assignments || [])
    .filter(a => a.status === 'pending')
    .slice(0, 3)
    .map(a => ({
      id: a.id,
      title: a.title,
      type: 'assignment',
      dueDate: a.dueDate,
      icon: FileText,
      color: 'red'
    }));

  const pendingAssessments = (user?.assessments || [])
    .filter(a => a.status === 'pending')
    .slice(0, 1)
    .map(a => ({
      id: a.id,
      title: a.title,
      type: 'assessment',
      dueDate: '2026-07-20', // Default estimation
      icon: Award,
      color: 'yellow'
    }));

  const upcomingDeadlines = [...pendingAssignments, ...pendingAssessments];

  // Load real activities
  const recentActivity = user?.activities || [
    { id: 1, text: 'Enrolled in ' + (user?.enrolledProgram || 'Web Development') + ' internship.', time: '1 week ago', icon: CheckCircle2, color: 'green' }
  ];

  // Graph data based on overall progress percentage
  const weeklyProgressData = Array.from({ length: 8 }, (_, idx) => {
    const completedWeeks = Math.floor((progress / 100) * 8);
    let val = 0;
    if (idx < completedWeeks) {
      val = Math.round(((idx + 1) / 8) * 100);
    } else if (idx === completedWeeks) {
      val = progress;
    }
    return {
      week: `Week ${idx + 1}`,
      progress: val
    };
  });

  const getActivityIcon = (type) => {
    switch (type) {
      case 'assignment': return FileText;
      case 'assessment': return Award;
      case 'project': return BarChart3;
      default: return Activity;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'assignment': return 'blue';
      case 'assessment': return 'yellow';
      case 'project': return 'purple';
      default: return 'green';
    }
  };

  return (
    <div className="student-dashboard">
      <div className="student-dashboard__header animate-fadeInUp">
        <div className="student-dashboard__welcome">
          <h1>Welcome back, {user?.name?.split(' ')[0] || 'Student'} 👋</h1>
          <p>{user?.enrolledProgram ? `${user.enrolledProgram} Intern` : 'Intern'} • {formattedDate}</p>
        </div>
        <div className="student-dashboard__header-actions">
          <button className="student-dashboard__notification-btn">
            <Bell size={20} />
            <span className="student-dashboard__notification-dot"></span>
          </button>
        </div>
      </div>

      <div className="student-dashboard__stats animate-fadeInUp delay-1">
        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--blue">
            <TrendingUp size={24} />
          </div>
          <div className="stats-card__info">
            <h3>{progress}%</h3>
            <p>Overall Progress</p>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--green">
            <CheckCircle2 size={24} />
          </div>
          <div className="stats-card__info">
            <h3>{assignmentsCompleted}/{totalAssignments}</h3>
            <p>Assignments Done</p>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--yellow">
            <Award size={24} />
          </div>
          <div className="stats-card__info">
            <h3>{assessmentsPassed}/{totalAssessments}</h3>
            <p>Assessments Passed</p>
          </div>
        </div>

        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--red">
            <Clock size={24} />
          </div>
          <div className="stats-card__info">
            <h3>{daysRemaining}</h3>
            <p>Days Remaining</p>
          </div>
        </div>
      </div>

      <div className="student-dashboard__content">
        <div className="student-dashboard__main">
          <div className="student-dashboard__chart-card card animate-fadeInUp delay-2">
            <div className="student-dashboard__chart-header">
              <h3>Weekly Progress</h3>
              <span className="badge badge--primary">
                <TrendingUp size={12} /> On Track
              </span>
            </div>
            <div className="student-dashboard__chart">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={weeklyProgressData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="progress" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#progressGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="student-dashboard__activity card animate-fadeInUp delay-3">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {recentActivity.map((act) => {
                const IconComponent = getActivityIcon(act.type);
                const colorClass = getActivityColor(act.type);
                return (
                  <div className="activity-item" key={act.id}>
                    <div className={`activity-icon activity-icon--${colorClass}`}>
                      <IconComponent size={16} />
                    </div>
                    <div className="activity-details">
                      <p>{act.text}</p>
                      <span>{act.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="student-dashboard__sidebar">
          <div className="student-dashboard__deadlines card animate-fadeInUp delay-2">
            <h3>Upcoming Deadlines</h3>
            <div className="deadline-list">
              {upcomingDeadlines.map((deadline) => {
                const IconComponent = deadline.icon;
                return (
                  <div className="deadline-item" key={deadline.id}>
                    <div className={`deadline-icon deadline-icon--${deadline.color}`}>
                      <IconComponent size={18} />
                    </div>
                    <div className="deadline-info">
                      <h4>{deadline.title}</h4>
                      <p>Due: {new Date(deadline.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                    </div>
                  </div>
                );
              })}

              {upcomingDeadlines.length === 0 && (
                <div className="deadline-empty text-center" style={{ padding: 'var(--space-4) 0' }}>
                  <CheckCircle2 size={32} className="text-gradient" style={{ marginBottom: 'var(--space-2)' }} />
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>All caught up! No pending tasks.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
