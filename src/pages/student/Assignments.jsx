import { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Send,
  Calendar,
  Star,
  BookOpen,
  Award,
  MessageSquare,
} from 'lucide-react';
import { Github } from '../../components/ui/BrandIcons';
import { useAuth } from '../../context/AuthContext';
import './Assignments.css';

const filterTabs = ['All', 'Pending', 'Submitted', 'Graded'];

const Assignments = () => {
  const { user } = useAuth();
  const { submitAssignment } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  
  // Submission Form State
  const [submitLink, setSubmitLink] = useState('');
  const [notes, setNotes] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const domain = user?.enrolledProgram || 'Web Development';
  const assignmentsData = user?.assignments || [];

  const filteredAssignments = assignmentsData.filter((a) => {
    if (activeFilter === 'All') return true;
    return a.status.toLowerCase() === activeFilter.toLowerCase();
  });

  // Select the first assignment in the filtered list if none is selected
  useEffect(() => {
    if (filteredAssignments.length > 0) {
      // Keep selection if it's still in the filtered list, otherwise reset to first
      const exists = filteredAssignments.find(a => selectedAssignment && a.id === selectedAssignment.id);
      if (!exists) {
        setSelectedAssignment(filteredAssignments[0]);
      } else {
        // Refresh detail view data with latest state from user profile
        const fresh = assignmentsData.find(a => a.id === selectedAssignment.id);
        setSelectedAssignment(fresh);
      }
    } else {
      setSelectedAssignment(null);
    }
  }, [activeFilter, user]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!submitLink.trim()) return;

    try {
      await submitAssignment(selectedAssignment.id, submitLink, notes);
      setSubmitLink('');
      setNotes('');
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'graded':
        return <span className="badge badge--success"><CheckCircle2 size={12} style={{ marginRight: '4px' }} /> Graded</span>;
      case 'submitted':
        return <span className="badge badge--warning"><Clock size={12} style={{ marginRight: '4px' }} /> Submitted</span>;
      case 'pending':
        return <span className="badge badge--danger"><AlertCircle size={12} style={{ marginRight: '4px' }} /> Pending</span>;
      default:
        return null;
    }
  };

  const isOverdue = (dueDate, status) => {
    return new Date(dueDate) < new Date() && status === 'pending';
  };

  return (
    <div className="assignments animate-fadeInUp">
      {/* Header Banner */}
      <div className="assignments__header">
        <div>
          <h1>Internship Coursework</h1>
          <p>Complete your domain tasks to track milestones and unlock certification inside <strong>{domain}</strong></p>
        </div>
        <div className="assignments__summary">
          <div className="assignments__summary-card">
            <span className="assignments__summary-value">
              {assignmentsData.filter((a) => a.status === 'graded').length}
            </span>
            <span className="assignments__summary-label">Graded</span>
          </div>
          <div className="assignments__summary-card assignments__summary-card--pending">
            <span className="assignments__summary-value">
              {assignmentsData.filter((a) => a.status === 'pending').length}
            </span>
            <span className="assignments__summary-label">Pending</span>
          </div>
        </div>
      </div>

      {/* Filter Options */}
      <div className="assignments__filters-bar">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            className={`assignments__filter-btn ${activeFilter === tab ? 'assignments__filter-btn--active' : ''}`}
            onClick={() => setActiveFilter(tab)}
          >
            {tab}
            <span className="assignments__filter-badge">
              {tab === 'All' ? assignmentsData.length : assignmentsData.filter(a => a.status.toLowerCase() === tab.toLowerCase()).length}
            </span>
          </button>
        ))}
      </div>

      {/* Main Split View Layout */}
      <div className="assignments__split-layout">
        
        {/* Left Side: Neat coursework list */}
        <div className="assignments__left-panel">
          <div className="assignments__list-scroller">
            {filteredAssignments.map((assignment) => {
              const active = selectedAssignment && selectedAssignment.id === assignment.id;
              const overdue = isOverdue(assignment.dueDate, assignment.status);
              
              return (
                <div
                  key={assignment.id}
                  className={`assignments__item-card ${active ? 'assignments__item-card--active' : ''} ${overdue ? 'assignments__item-card--overdue' : ''}`}
                  onClick={() => setSelectedAssignment(assignment)}
                >
                  <div className="assignments__item-icon">
                    <FileText size={18} />
                  </div>
                  <div className="assignments__item-details">
                    <div className="assignments__item-top-row">
                      <span className="assignments__item-week">Week {assignment.week}</span>
                      {getStatusBadge(assignment.status)}
                    </div>
                    <h3 className="assignments__item-title">{assignment.title}</h3>
                    <div className="assignments__item-meta">
                      <Calendar size={12} />
                      <span>Due: {new Date(assignment.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      {overdue && <span className="assignments__overdue-text">Overdue</span>}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredAssignments.length === 0 && (
              <div className="assignments__no-items card card--glass">
                <BookOpen size={36} className="no-items-icon" />
                <h4>No assignments found</h4>
                <p>No coursework matches the selected filter status.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Full description & Direct submission container */}
        <div className="assignments__right-panel">
          {selectedAssignment ? (
            <div className="assignments__detail-container card card--glass animate-scaleIn">
              {showSuccessAlert && (
                <div className="assignments__success-alert">
                  <CheckCircle2 size={16} />
                  <span>Assignment submitted successfully! Under mentor review.</span>
                </div>
              )}

              <div className="assignments__detail-header">
                <div>
                  <div className="assignments__detail-week-badge">Week {selectedAssignment.week} Coursework</div>
                  <h2 className="assignments__detail-title">{selectedAssignment.title}</h2>
                </div>
                <div>
                  {getStatusBadge(selectedAssignment.status)}
                </div>
              </div>

              <div className="assignments__detail-section">
                <h4>Assignment Description</h4>
                <p className="assignments__detail-desc">{selectedAssignment.description || 'No description provided.'}</p>
              </div>

              <div className="assignments__info-grid">
                <div className="assignments__info-box">
                  <Calendar size={16} className="info-box-icon" />
                  <div>
                    <span className="info-box-label">Due Date</span>
                    <span className="info-box-value">
                      {new Date(selectedAssignment.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="assignments__info-box">
                  <Award size={16} className="info-box-icon" />
                  <div>
                    <span className="info-box-label">Max Marks Available</span>
                    <span className="info-box-value">{selectedAssignment.totalMarks || 100} Marks</span>
                  </div>
                </div>
              </div>

              {/* Submission Status Blocks */}
              {selectedAssignment.status === 'pending' && (
                <div className="assignments__submission-section">
                  <h3>Submit Assignment Work</h3>
                  <form onSubmit={handleFormSubmit} className="assignments__submission-form">
                    <div className="form-group">
                      <label className="form-label">
                        <Github size={14} style={{ marginRight: '6px', color: 'var(--text-secondary)' }} />
                        GitHub Repository URL
                      </label>
                      <input
                        type="url"
                        className="form-input"
                        placeholder="e.g. https://github.com/yourusername/project-repo"
                        value={submitLink}
                        onChange={(e) => setSubmitLink(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        <MessageSquare size={14} style={{ marginRight: '6px', color: 'var(--text-secondary)' }} />
                        Notes/Comments for Mentor
                      </label>
                      <textarea
                        className="form-input form-textarea"
                        placeholder="Add details, notes, or descriptions about your solution..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <button type="submit" className="btn btn--primary btn--full submit-work-btn">
                      <Send size={15} /> Submit Work
                    </button>
                  </form>
                </div>
              )}

              {selectedAssignment.status === 'submitted' && (
                <div className="assignments__submitted-status-box">
                  <div className="status-box-header">
                    <Clock size={18} className="status-box-icon" />
                    <div>
                      <h4>Work Submitted</h4>
                      <p>Submitted on {new Date(selectedAssignment.submittedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>

                  <div className="status-box-body">
                    <div className="submitted-field">
                      <span>GitHub Link:</span>
                      <a href={selectedAssignment.githubUrl} target="_blank" rel="noreferrer" className="submitted-link">
                        <Github size={12} /> {selectedAssignment.githubUrl}
                      </a>
                    </div>
                    {selectedAssignment.notes && (
                      <div className="submitted-field submitted-field--vertical">
                        <span>My Notes:</span>
                        <p>{selectedAssignment.notes}</p>
                      </div>
                    )}
                    <div className="review-alert">
                      <AlertCircle size={14} />
                      <span>Currently under review. Your mentor will update marks and feedback soon.</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedAssignment.status === 'graded' && (
                <div className="assignments__graded-status-box">
                  <div className="graded-header-row">
                    <div className="graded-score-panel">
                      <span className="graded-label">Overall Score</span>
                      <div className="graded-marks-circle">
                        <strong>{selectedAssignment.marks}</strong>
                        <span>/{selectedAssignment.totalMarks}</span>
                      </div>
                    </div>
                    
                    <div className="graded-feedback-panel">
                      <span className="graded-label">Mentor Feedback</span>
                      <p className="graded-feedback-text">
                        "{selectedAssignment.feedback || 'Great work completing this assignment!'}"
                      </p>
                    </div>
                  </div>

                  <div className="status-box-body" style={{ marginTop: '15px', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                    <div className="submitted-field">
                      <span>Submitted GitHub Repo:</span>
                      <a href={selectedAssignment.githubUrl} target="_blank" rel="noreferrer" className="submitted-link">
                        <Github size={12} /> {selectedAssignment.githubUrl}
                      </a>
                    </div>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="assignments__no-selection card card--glass">
              <FileText size={48} className="no-selection-icon" />
              <h3>Coursework Details</h3>
              <p>Select an assignment from the left list to view specifications and submit your solutions.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Assignments;
