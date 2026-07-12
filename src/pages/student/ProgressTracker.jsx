import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Award, BookOpen, FileCheck, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './ProgressTracker.css';

const ProgressTracker = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch(`/api/users/${user.id}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setStudent(data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching student progress details:', err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  const overallProgress = student?.progress !== undefined ? student.progress : 0;
  
  const assignmentsCompleted = student?.assignmentsCompleted !== undefined ? student.assignmentsCompleted : 0;
  const totalAssignments = student?.assignments?.length ? student.assignments.length : 8;
  const assessmentsPassed = student?.assessmentsPassed !== undefined ? student.assessmentsPassed : 0;
  const totalAssessments = student?.assessments?.length ? student.assessments.length : 5;

  const assignmentsPercent = totalAssignments > 0 ? Math.round((assignmentsCompleted / totalAssignments) * 100) : 0;
  const assessmentsPercent = totalAssessments > 0 ? Math.round((assessmentsPassed / totalAssessments) * 100) : 0;

  // Circular progress chart calculations
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (overallProgress / 100) * circumference;

  // Calculate dynamic weekly assignment score performance data
  const performanceData = Array.from({ length: 8 }, (_, idx) => {
    const weekNum = idx + 1;
    const weekAssignments = (student?.assignments || []).filter((a) => a.week === weekNum);
    const gradedAssignments = weekAssignments.filter(
      (a) => a.status === 'graded' && a.marks !== undefined && a.marks !== null
    );

    let score = 0;
    if (gradedAssignments.length > 0) {
      const totalSecured = gradedAssignments.reduce((sum, a) => sum + a.marks, 0);
      const totalMax = gradedAssignments.reduce((sum, a) => sum + (a.totalMarks || 100), 0);
      score = Math.round((totalSecured / totalMax) * 100);
    }

    return {
      week: `Wk ${weekNum}`,
      score: score,
    };
  });

  // Calculate milestones dynamically
  const completedWeeks = Math.floor((overallProgress / 100) * 8);

  const getMilestoneClass = (step) => {
    if (step === 'registration') return 'milestone-item--completed';
    
    if (step === 'fundamentals') {
      return completedWeeks >= 4 ? 'milestone-item--completed' : completedWeeks >= 1 ? 'milestone-item--active' : '';
    }
    
    if (step === 'advanced') {
      return completedWeeks >= 8 ? 'milestone-item--completed' : completedWeeks >= 4 ? 'milestone-item--active' : '';
    }
    
    if (step === 'project') {
      const projStatus = student?.project?.status;
      if (projStatus === 'approved') return 'milestone-item--completed';
      if (projStatus === 'under_review' || projStatus === 'revision_needed' || projStatus === 'not_submitted') {
        return 'milestone-item--active';
      }
      return '';
    }
    
    if (step === 'certificate') {
      return student?.project?.status === 'approved' ? 'milestone-item--completed' : '';
    }
    
    return '';
  };

  const getMilestoneIcon = (step) => {
    const mClass = getMilestoneClass(step);
    if (mClass === 'milestone-item--completed') {
      return <CheckCircle2 size={16} />;
    }
    
    if (step === 'fundamentals' || step === 'advanced') {
      return <BookOpen size={16} />;
    }
    if (step === 'project') {
      return <FileCheck size={16} />;
    }
    return <Award size={16} />;
  };

  const getEnrollmentDateLabel = () => {
    if (!student?.enrolledDate) return 'Enrolled on July 12, 2026';
    try {
      return `Enrolled on ${new Date(student.enrolledDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}`;
    } catch {
      return `Enrolled on ${student.enrolledDate}`;
    }
  };

  if (loading) {
    return (
      <div className="progress-tracker" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '350px' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="progress-tracker">
      <div className="progress-tracker__header animate-fadeInUp">
        <h1>Progress Tracker</h1>
        <p>Monitor your learning journey, assignment scores, and milestone completions.</p>
      </div>

      <div className="progress-tracker__grid">
        {/* Left Column - Overall Stats */}
        <div className="progress-tracker__main">
          {/* Progress Overview Card */}
          <div className="progress-tracker__overview card animate-fadeInUp delay-1">
            <div className="circular-progress-box">
              <svg height={radius * 2} width={radius * 2}>
                <circle
                  stroke="#E2E8F0"
                  fill="transparent"
                  strokeWidth={stroke}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />
                <circle
                  stroke="url(#progressGradient)"
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeDasharray={circumference + ' ' + circumference}
                  style={{ strokeDashoffset }}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#60A5FA" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="circular-progress-text">
                <h3>{overallProgress}%</h3>
                <span>Complete</span>
              </div>
            </div>

            <div className="progress-tracker__stats-details">
              <h3>Overall Progress</h3>
              <p>You have completed {overallProgress}% of the internship curriculum. Keep up the great work!</p>
              
              <div className="progress-subbar-list">
                <div className="progress-subbar-item">
                  <div className="subbar-label">
                    <span>Assignments ({assignmentsCompleted}/{totalAssignments})</span>
                    <span>{assignmentsPercent}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar__fill" style={{ width: `${assignmentsPercent}%` }} />
                  </div>
                </div>

                <div className="progress-subbar-item">
                  <div className="subbar-label">
                    <span>Assessments ({assessmentsPassed}/{totalAssessments})</span>
                    <span>{assessmentsPercent}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar__fill progress-bar__fill--warning" style={{ width: `${assessmentsPercent}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="progress-tracker__chart card animate-fadeInUp delay-2">
            <h3>Assignments Score Analysis</h3>
            <p className="chart-subtitle">Weekly scores achieved out of 100</p>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="week" tickLine={false} />
                  <YAxis domain={[0, 100]} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(37,99,235,0.05)' }} />
                  <Bar dataKey="score" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column - Milestones */}
        <div className="progress-tracker__sidebar">
          <div className="progress-milestones card animate-fadeInUp delay-2">
            <h3>Milestone Checklist</h3>
            <div className="milestone-list">
              {/* Registration */}
              <div className={`milestone-item ${getMilestoneClass('registration')}`}>
                <span className="milestone-icon">{getMilestoneIcon('registration')}</span>
                <div className="milestone-content">
                  <h5>Student Registration</h5>
                  <p>{getEnrollmentDateLabel()}</p>
                </div>
              </div>

              {/* Weeks 1-4 */}
              <div className={`milestone-item ${getMilestoneClass('fundamentals')}`}>
                <span className="milestone-icon">{getMilestoneIcon('fundamentals')}</span>
                <div className="milestone-content">
                  <h5>Week 1-4 Fundamentals</h5>
                  <p>
                    {completedWeeks >= 4
                      ? 'Fundamentals curriculum completed'
                      : completedWeeks >= 1
                      ? `In Progress (Week ${completedWeeks} modules completed)`
                      : 'Basics, modules and assignments pending'}
                  </p>
                </div>
              </div>

              {/* Weeks 5-8 */}
              <div className={`milestone-item ${getMilestoneClass('advanced')}`}>
                <span className="milestone-icon">{getMilestoneIcon('advanced')}</span>
                <div className="milestone-content">
                  <h5>Week 5-8 Advanced Development</h5>
                  <p>
                    {completedWeeks >= 8
                      ? 'Advanced curriculum completed'
                      : completedWeeks >= 4
                      ? `In Progress (Week ${completedWeeks} modules completed)`
                      : 'Advanced topics, backend and hooks pending'}
                  </p>
                </div>
              </div>

              {/* Capstone Project */}
              <div className={`milestone-item ${getMilestoneClass('project')}`}>
                <span className="milestone-icon">{getMilestoneIcon('project')}</span>
                <div className="milestone-content">
                  <h5>Capstone Project</h5>
                  <p>
                    {student?.project?.status === 'approved'
                      ? 'Project approved by mentor'
                      : student?.project?.status === 'under_review'
                      ? 'Submitted - Under mentor evaluation'
                      : student?.project?.status === 'revision_needed'
                      ? 'Revision Requested'
                      : student?.project?.status === 'not_submitted'
                      ? 'Project assigned - submission pending'
                      : 'Awaiting project prompt assignment'}
                  </p>
                </div>
              </div>

              {/* Certificate */}
              <div className={`milestone-item ${getMilestoneClass('certificate')}`}>
                <span className="milestone-icon">{getMilestoneIcon('certificate')}</span>
                <div className="milestone-content">
                  <h5>Certification</h5>
                  <p>
                    {student?.project?.status === 'approved'
                      ? 'Eligible for certificate distribution'
                      : 'Distributed upon project approval'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
