import { useState, useEffect } from 'react';
import { CheckCircle, Calendar, ExternalLink, Send, Plus, FileText } from 'lucide-react';
import { Github } from '../../components/ui/BrandIcons';
import { useAuth } from '../../context/AuthContext';
import './ApproveProject.css';

const ApproveProject = () => {
  const { user: mentor } = useAuth();
  const [projects, setProjects] = useState([]);
  const [reviewItem, setReviewItem] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignForm, setAssignForm] = useState({
    promptTitle: '',
    promptDescription: '',
    requirements: '',
    deadline: '',
  });
  const [assignMsg, setAssignMsg] = useState('');

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const allUsers = await response.json();
        const domainStudents = allUsers.filter(
          (u) => u.role === 'student' && u.enrolledProgram === mentor?.enrolledProgram
        );

        const list = [];
        domainStudents.forEach((student) => {
          const p = student.project;
          if (p && p.status !== 'not_assigned' && p.status !== 'not_submitted') {
            list.push({
              studentDbId: student.dbId,
              studentId: student.id,
              studentName: student.name,
              studentEmail: student.email,
              projectTitle: p.title || 'Untitled Capstone Project',
              description: p.description || '',
              githubUrl: p.githubUrl || '',
              demoUrl: p.demoUrl || '',
              submittedDate: p.submittedAt || new Date().toISOString().split('T')[0],
              status: p.status,
              feedback: p.feedback || '',
            });
          }
        });
        setProjects(list);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  useEffect(() => {
    if (mentor) {
      fetchProjects();
    }
  }, [mentor]);

  const handleOpenReview = (item) => {
    setReviewItem(item);
    setFeedback(item.feedback || '');
  };

  const handleDecision = async (statusDecision) => {
    if (!reviewItem) return;

    try {
      const response = await fetch(`/api/mentor/projects/${reviewItem.studentDbId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusDecision,
          feedback,
        }),
      });

      if (response.ok) {
        setReviewItem(null);
        fetchProjects();
      } else {
        alert('Failed to evaluate project.');
      }
    } catch (err) {
      console.error('Error evaluating project:', err);
    }
  };

  const handleAssignProject = async (e) => {
    e.preventDefault();
    setAssignMsg('');

    try {
      const response = await fetch('/api/mentor/projects/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...assignForm,
          domain: mentor?.enrolledProgram,
        }),
      });

      if (response.ok) {
        const text = await response.text();
        setAssignMsg(text);
        setShowAssignModal(false);
        setAssignForm({ promptTitle: '', promptDescription: '', requirements: '', deadline: '' });
      } else {
        setAssignMsg('Failed to assign project.');
      }
    } catch (err) {
      setAssignMsg('Server offline.');
    }
  };

  return (
    <div className="approve-project">
      <div className="approve-project__header animate-fadeInUp">
        <div>
          <h1>Capstone Projects ({mentor?.enrolledProgram || 'All Programs'})</h1>
          <p>Assign project prompts, review submissions, and approve final capstone applications.</p>
        </div>
        <button className="btn btn--primary" onClick={() => setShowAssignModal(true)}>
          <Plus size={18} /> Assign Project
        </button>
      </div>

      {assignMsg && (
        <div className="card animate-fadeInUp" style={{ padding: '12px 16px', marginBottom: '16px', background: 'var(--success-bg)', color: 'var(--success)', fontSize: '0.9rem', borderLeft: '3px solid var(--success)' }}>
          ✅ {assignMsg}
        </div>
      )}

      <div className="approve-project__list">
        {projects.map((proj, idx) => (
          <div key={proj.studentDbId} className="approve-card card animate-fadeInUp" style={{ animationDelay: `${idx * 0.1}s` }}>
            <div className="approve-card-main">
              <div className="approve-card-header">
                <div>
                  <h3>{proj.projectTitle}</h3>
                  <p className="student-info">By: {proj.studentName} ({proj.studentEmail})</p>
                </div>
                <span className={`badge ${
                  proj.status === 'approved' ? 'badge--success' : proj.status === 'revision_needed' ? 'badge--danger' : 'badge--warning'
                }`}>
                  {proj.status === 'approved' ? 'Approved & Certified' : proj.status === 'revision_needed' ? 'Revision Requested' : 'Pending Review'}
                </span>
              </div>

              <div className="approve-card-details">
                <p className="project-description-text">{proj.description}</p>
                <div className="approve-metadata">
                  <span><Calendar size={13} /> Submitted: {new Date(proj.submittedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
                <div className="approve-links">
                  <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn--secondary btn--sm">
                    <Github size={14} /> Repository
                  </a>
                  {proj.demoUrl && (
                    <a href={proj.demoUrl} target="_blank" rel="noopener noreferrer" className="btn btn--secondary btn--sm">
                      <ExternalLink size={14} /> Live Demo
                    </a>
                  )}
                </div>

                {proj.feedback && proj.status === 'approved' && (
                  <div className="saved-review card card--flat" style={{ marginTop: '10px' }}>
                    <p><strong>Feedback:</strong> {proj.feedback}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="approve-card-actions">
              <button className="btn btn--primary btn--sm" onClick={() => handleOpenReview(proj)}>
                {proj.status === 'approved' ? 'View Evaluation' : 'Evaluate Project'}
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="review-empty text-center card" style={{ padding: '30px' }}>
            <FileText size={48} style={{ color: 'var(--text-secondary)', marginBottom: '12px' }} />
            <h3>No project submissions to review</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Students in your domain have not submitted their capstone projects yet. Use the "Assign Project" button above to publish a project prompt first.</p>
          </div>
        )}
      </div>

      {/* Evaluate Modal */}
      {reviewItem && (
        <div className="modal-backdrop" onClick={() => setReviewItem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Evaluate Capstone</h2>
              <button className="modal__close" onClick={() => setReviewItem(null)}>×</button>
            </div>
            <p className="grading-subtitle">Student: {reviewItem.studentName}</p>
            <div className="grading-form">
              <div className="form-group">
                <label className="form-label" htmlFor="feedback">Evaluation Comments</label>
                <textarea
                  id="feedback"
                  className="form-input form-textarea"
                  placeholder="Provide detailed feedback on project scope, API routes, security, and responsive styling..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  required
                />
              </div>
              <div className="modal-action-btn-group">
                <button type="button" className="btn btn--danger btn--full" onClick={() => handleDecision('revision_needed')}>
                  Request Revision
                </button>
                <button type="button" className="btn btn--success btn--full" onClick={() => handleDecision('approved')}>
                  Approve Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Project Modal */}
      {showAssignModal && (
        <div className="modal-backdrop" onClick={() => setShowAssignModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Assign Capstone Project</h2>
              <button className="modal__close" onClick={() => setShowAssignModal(false)}>×</button>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '16px' }}>
              This project prompt will be published to all <strong>{mentor?.enrolledProgram}</strong> students.
            </p>
            <form onSubmit={handleAssignProject}>
              <div className="form-group">
                <label className="form-label">Project Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Full-Stack SaaS Platform"
                  value={assignForm.promptTitle}
                  onChange={(e) => setAssignForm({ ...assignForm, promptTitle: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Project Description</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Describe the project scope, objectives, and expected deliverables..."
                  value={assignForm.promptDescription}
                  onChange={(e) => setAssignForm({ ...assignForm, promptDescription: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Requirements (one per line)</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder={"Responsive UI with CSS Grid/Flexbox\nFunctional React components with routing\nCustom Express.js backend with DB connectivity\nCRUD operations endpoints with validations\nUser registration and login features\nHosted deployment on Vercel or Render"}
                  value={assignForm.requirements}
                  onChange={(e) => setAssignForm({ ...assignForm, requirements: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Submission Deadline</label>
                <input
                  type="date"
                  className="form-input"
                  value={assignForm.deadline}
                  onChange={(e) => setAssignForm({ ...assignForm, deadline: e.target.value })}
                  required
                />
              </div>
              <div className="modal-action-btn-group">
                <button type="button" className="btn btn--ghost" onClick={() => setShowAssignModal(false)}>Cancel</button>
                <button type="submit" className="btn btn--primary">
                  <Send size={16} /> Publish Project Prompt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveProject;
