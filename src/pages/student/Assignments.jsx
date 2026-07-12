import { useState } from 'react';
import { Link } from 'react-router';
import {
  FileText,
  Upload,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  X,
  Paperclip,
  Send,
  Filter,
  Calendar,
  Star,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { domainContent } from '../../data/domainContent';
import './Assignments.css';

const filterTabs = ['All', 'Pending', 'Submitted', 'Graded'];

const Assignments = () => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackAssignment, setFeedbackAssignment] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [submitLink, setSubmitLink] = useState('');

  const domain = user?.enrolledProgram || 'Web Development';
  const { submitAssignment } = useAuth();
  const assignmentsData = user?.assignments || [];

  const filteredAssignments = assignmentsData.filter((a) => {
    if (activeFilter === 'All') return true;
    return a.status.toLowerCase() === activeFilter.toLowerCase();
  });

  const handleSubmitClick = (assignment) => {
    setSelectedAssignment(assignment);
    setShowModal(true);
    setUploadFile(null);
    setSubmitLink('');
  };

  const handleViewFeedback = (assignment) => {
    setFeedbackAssignment(assignment);
    setShowFeedback(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    submitAssignment(selectedAssignment.id, submitLink, '');
    setShowModal(false);
    setSelectedAssignment(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'graded':
        return <span className="badge badge--success"><CheckCircle2 size={12} /> Graded</span>;
      case 'submitted':
        return <span className="badge badge--warning"><Clock size={12} /> Submitted</span>;
      case 'pending':
        return <span className="badge badge--danger"><AlertCircle size={12} /> Pending</span>;
      default:
        return null;
    }
  };

  const isOverdue = (dueDate, status) => {
    return new Date(dueDate) < new Date() && status === 'pending';
  };

  return (
    <div className="assignments">
      <div className="assignments__header animate-fadeInUp">
        <div>
          <h1>Assignments</h1>
          <p>Track, submit, and review your homework submissions in {domain}</p>
        </div>
        <div className="assignments__summary">
          <div className="assignments__summary-item">
            <span className="assignments__summary-value">
              {assignmentsData.filter((a) => a.status === 'graded').length}
            </span>
            <span className="assignments__summary-label">Graded</span>
          </div>
          <div className="assignments__summary-item">
            <span className="assignments__summary-value assignments__summary-value--warning">
              {assignmentsData.filter((a) => a.status === 'pending').length}
            </span>
            <span className="assignments__summary-label">Pending</span>
          </div>
        </div>
      </div>

      <div className="assignments__filters animate-fadeInUp delay-1">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            className={`assignments__filter-tab ${activeFilter === tab ? 'assignments__filter-tab--active' : ''}`}
            onClick={() => setActiveFilter(tab)}
          >
            {tab}
            {tab !== 'All' && (
              <span className="assignments__filter-count">
                {assignmentsData.filter((a) =>
                  tab === 'All' ? true : a.status.toLowerCase() === tab.toLowerCase()
                ).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="assignments__list">
        {filteredAssignments.map((assignment, index) => (
          <div
            key={assignment.id}
            className={`assignments__card card animate-fadeInUp delay-${Math.min(index + 1, 5)} ${
              isOverdue(assignment.dueDate, assignment.status) ? 'assignments__card--overdue' : ''
            }`}
          >
            <div className="assignments__card-top">
              <div className="assignments__card-icon">
                <FileText size={20} />
              </div>
              <div className="assignments__card-info">
                <div className="assignments__card-title-row">
                  <h3>{assignment.title}</h3>
                  {getStatusBadge(assignment.status)}
                </div>
                <p className="assignments__card-desc">{assignment.description}</p>
                <div className="assignments__card-meta">
                  <span className="assignments__card-week">Week {assignment.week}</span>
                  <span className="assignments__card-date">
                    <Calendar size={13} />
                    Due: {new Date(assignment.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  {isOverdue(assignment.dueDate, assignment.status) && (
                    <span className="assignments__overdue-tag">
                      <XCircle size={13} /> Overdue
                    </span>
                  )}
                  {assignment.marks !== null && (
                    <span className="assignments__card-marks">
                      <Star size={13} />
                      {assignment.marks}/{assignment.totalMarks}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="assignments__card-actions">
              {assignment.status === 'pending' && (
                <button
                  className="btn btn--primary btn--sm"
                  onClick={() => handleSubmitClick(assignment)}
                >
                  <Upload size={14} /> Submit
                </button>
              )}
              {assignment.status === 'graded' && (
                <button
                  className="btn btn--secondary btn--sm"
                  onClick={() => handleViewFeedback(assignment)}
                >
                  <Eye size={14} /> View Feedback
                </button>
              )}
              {assignment.status === 'submitted' && (
                <button className="btn btn--ghost btn--sm" disabled>
                  <Clock size={14} /> Under Review
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredAssignments.length === 0 && (
          <div className="assignments__empty">
            <FileText size={48} />
            <h3>No {activeFilter.toLowerCase()} assignments</h3>
            <p>There are no assignments matching this filter.</p>
          </div>
        )}
      </div>

      {showModal && selectedAssignment && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Submit Assignment</h2>
              <button className="modal__close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <p className="assignments__modal-subtitle">{selectedAssignment.title}</p>
            <form onSubmit={handleFormSubmit} className="assignments__submit-form">
              <div className="form-group">
                <label className="form-label">GitHub Repository URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://github.com/username/repo"
                  value={submitLink}
                  onChange={(e) => setSubmitLink(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Upload File (Optional)</label>
                <div className="assignments__upload-area">
                  <input
                    type="file"
                    id="file-upload"
                    className="assignments__file-input"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    accept=".zip,.rar,.pdf,.doc,.docx"
                  />
                  <label htmlFor="file-upload" className="assignments__upload-label">
                    <Paperclip size={20} />
                    <span>{uploadFile ? uploadFile.name : 'Click to upload or drag files here'}</span>
                    <span className="assignments__upload-hint">ZIP, PDF, DOC (Max 10MB)</span>
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes for Mentor (Optional)</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Any notes or comments about your submission..."
                  rows={3}
                ></textarea>
              </div>
              <button type="submit" className="btn btn--primary btn--full">
                <Send size={16} /> Submit Assignment
              </button>
            </form>
          </div>
        </div>
      )}

      {showFeedback && feedbackAssignment && (
        <div className="modal-backdrop" onClick={() => setShowFeedback(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Feedback</h2>
              <button className="modal__close" onClick={() => setShowFeedback(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="assignments__feedback-content">
              <h3>{feedbackAssignment.title}</h3>
              <div className="assignments__feedback-score">
                <div className="assignments__score-circle">
                  <span className="assignments__score-value">{feedbackAssignment.marks}</span>
                  <span className="assignments__score-total">/{feedbackAssignment.totalMarks}</span>
                </div>
                <span className={`badge ${feedbackAssignment.marks >= 90 ? 'badge--success' : feedbackAssignment.marks >= 70 ? 'badge--warning' : 'badge--danger'}`}>
                  {feedbackAssignment.marks >= 90 ? 'Excellent' : feedbackAssignment.marks >= 70 ? 'Good' : 'Needs Improvement'}
                </span>
              </div>
              <div className="assignments__feedback-text">
                <h4>Mentor's Feedback</h4>
                <p>{feedbackAssignment.feedback}</p>
              </div>
              <div className="assignments__feedback-details">
                <div className="assignments__feedback-detail">
                  <span className="assignments__feedback-label">Submitted On</span>
                  <span>{new Date(feedbackAssignment.submittedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="assignments__feedback-detail">
                  <span className="assignments__feedback-label">Due Date</span>
                  <span>{new Date(feedbackAssignment.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
