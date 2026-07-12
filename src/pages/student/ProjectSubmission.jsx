import { useState, useEffect } from 'react';
import { FolderUp, Link as LinkIcon, Send, AlertCircle, CheckCircle, Clock, FileText, Inbox } from 'lucide-react';
import { Github } from '../../components/ui/BrandIcons';
import { useAuth } from '../../context/AuthContext';
import './ProjectSubmission.css';

const ProjectSubmission = () => {
  const { user, submitProject } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubUrl: '',
    demoUrl: '',
    notes: '',
  });

  // Fetch project data from backend
  useEffect(() => {
    if (user) {
      fetch(`/api/users/${user.id}`)
        .then((res) => res.ok ? res.json() : null)
        .then((data) => {
          if (data?.project) {
            setProject(data.project);
            if (data.project.title) {
              setFormData({
                title: data.project.title || '',
                description: data.project.description || '',
                githubUrl: data.project.githubUrl || '',
                demoUrl: data.project.demoUrl || '',
                notes: data.project.notes || '',
              });
            }
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  const status = project?.status || 'not_assigned';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitProject(formData);
    // Optimistically update status
    setProject((prev) => ({ ...prev, ...formData, status: 'under_review', submittedAt: new Date().toISOString().split('T')[0] }));
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'under_review':
        return <span className="badge badge--warning"><Clock size={12} /> Under Review</span>;
      case 'approved':
        return <span className="badge badge--success"><CheckCircle size={12} /> Approved</span>;
      case 'revision_needed':
        return <span className="badge badge--danger"><AlertCircle size={12} /> Revision Requested</span>;
      case 'not_submitted':
        return <span className="badge badge--primary">Not Submitted</span>;
      case 'not_assigned':
        return <span className="badge badge--danger">Not Assigned Yet</span>;
      default:
        return <span className="badge badge--primary">Not Submitted</span>;
    }
  };

  if (loading) {
    return (
      <div className="project-submission" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <div className="spinner" />
      </div>
    );
  }

  // No project assigned by mentor yet
  if (status === 'not_assigned' || !project?.promptTitle) {
    return (
      <div className="project-submission">
        <div className="project-submission__header animate-fadeInUp">
          <h1>Final Project Submission</h1>
          <p>Submit your final capstone project here for mentor evaluation.</p>
        </div>

        <div className="project-submission__empty card animate-fadeInUp delay-1" style={{ padding: '60px 30px', textAlign: 'center' }}>
          <Inbox size={56} style={{ color: 'var(--text-secondary)', marginBottom: '16px' }} />
          <h2 style={{ marginBottom: '8px', color: 'var(--text-primary)' }}>No Project Assigned Yet</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', margin: '0 auto', lineHeight: '1.6' }}>
            Your mentor has not assigned a capstone project for your program yet. 
            Once the mentor uploads the project prompt and requirements, they will appear here and you'll be able to submit your work.
          </p>
          <div style={{ marginTop: '20px' }}>
            {getStatusBadge()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="project-submission">
      <div className="project-submission__header animate-fadeInUp">
        <h1>Final Project Submission</h1>
        <p>Submit your final capstone project here for mentor evaluation and certificate generation.</p>
      </div>

      <div className="project-submission__grid">
        {/* Left column - details & submission form */}
        <div className="project-submission__main">
          {/* Project Prompt — loaded from mentor */}
          <div className="project-submission__prompt card animate-fadeInUp delay-1">
            <h3>Capstone Project Prompt: {project.promptTitle}</h3>
            <p className="project-prompt-desc">
              {project.promptDescription}
            </p>
            {project.requirements && (
              <div className="project-requirements">
                <h4>Requirements Checklist:</h4>
                <ul>
                  {project.requirements.split('\n').filter(Boolean).map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="project-deadline-box">
              <span><strong>Deadline:</strong> {project.deadline ? new Date(project.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'TBD'}</span>
              <span><strong>Status:</strong> {getStatusBadge()}</span>
            </div>
          </div>

          {/* Form */}
          {status === 'not_submitted' || status === 'revision_needed' ? (
            <div className="project-submission__form-card card animate-fadeInUp delay-2">
              <h3>Submit Project Details</h3>
              <form onSubmit={handleSubmit} className="project-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="title">Project Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="form-input"
                    placeholder="e.g. InternSphere Learning Portal"
                    required
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="description">Project Description</label>
                  <textarea
                    id="description"
                    name="description"
                    className="form-input form-textarea"
                    placeholder="Provide a brief explanation of what your application does, tech stack used, and main features..."
                    required
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="githubUrl">GitHub Repository URL</label>
                    <div className="project-input-wrapper">
                      <Github size={16} className="project-input-icon" />
                      <input
                        type="url"
                        id="githubUrl"
                        name="githubUrl"
                        className="form-input project-input-with-icon"
                        placeholder="https://github.com/username/project"
                        required
                        value={formData.githubUrl}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="demoUrl">Live Demo URL</label>
                    <div className="project-input-wrapper">
                      <LinkIcon size={16} className="project-input-icon" />
                      <input
                        type="url"
                        id="demoUrl"
                        name="demoUrl"
                        className="form-input project-input-with-icon"
                        placeholder="https://project.vercel.app"
                        required
                        value={formData.demoUrl}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="notes">Notes for Mentor (Optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    className="form-input form-textarea form-textarea--sm"
                    placeholder="Any specific environment variables, instructions, or features you want the mentor to pay attention to..."
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="btn btn--primary btn--full">
                  Submit Final Project <Send size={16} />
                </button>
              </form>
            </div>
          ) : (
            <div className="project-submission__submitted card animate-fadeInUp delay-2">
              <div className="submitted-header">
                <h3>Your Submission Details</h3>
                {getStatusBadge()}
              </div>

              <div className="submitted-details-grid">
                <div className="submitted-row">
                  <span>Project Title:</span>
                  <strong>{project?.title}</strong>
                </div>
                <div className="submitted-row">
                  <span>Submission Date:</span>
                  <strong>{project?.submittedAt}</strong>
                </div>
                <div className="submitted-row">
                  <span>Description:</span>
                  <p>{project?.description}</p>
                </div>
                <div className="submitted-links">
                  <a href={project?.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn--secondary btn--sm">
                    <Github size={14} /> Repository
                  </a>
                  <a href={project?.demoUrl} target="_blank" rel="noopener noreferrer" className="btn btn--secondary btn--sm">
                    <LinkIcon size={14} /> Live Demo
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right column - status & review feedback */}
        <div className="project-submission__sidebar">
          {/* Status Tracker */}
          <div className="project-status-tracker card animate-fadeInUp delay-2">
            <h3>Evaluation Process</h3>
            <div className="tracker-steps">
              <div className="tracker-step tracker-step--completed">
                <span className="tracker-step-icon"><CheckCircle size={16} /></span>
                <div className="tracker-step-text">
                  <h5>Project Assigned</h5>
                  <p>Mentor published project prompt.</p>
                </div>
              </div>

              <div className={`tracker-step ${status !== 'not_submitted' ? 'tracker-step--completed' : ''}`}>
                <span className="tracker-step-icon">
                  {status === 'not_submitted' ? '2' : <CheckCircle size={16} />}
                </span>
                <div className="tracker-step-text">
                  <h5>Submission</h5>
                  <p>Link repositories and upload demo URLs.</p>
                </div>
              </div>

              <div className={`tracker-step ${status === 'under_review' ? 'tracker-step--active' : status === 'approved' ? 'tracker-step--completed' : ''}`}>
                <span className="tracker-step-icon">
                  {status === 'approved' ? <CheckCircle size={16} /> : '3'}
                </span>
                <div className="tracker-step-text">
                  <h5>Mentor Review</h5>
                  <p>Mentor tests code and provides grades.</p>
                </div>
              </div>

              <div className={`tracker-step ${status === 'approved' ? 'tracker-step--completed' : ''}`}>
                <span className="tracker-step-icon">
                  {status === 'approved' ? <CheckCircle size={16} /> : '4'}
                </span>
                <div className="tracker-step-text">
                  <h5>Certification</h5>
                  <p>Mentor distributes certificate upon approval.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Card */}
          {(status === 'under_review') && (
            <div className="project-feedback card animate-fadeInUp delay-3">
              <h3>Mentor Feedback</h3>
              <div className="feedback-pending">
                <Clock size={32} />
                <p>Your project is currently under evaluation. Please check back in 2-3 business days for grades and reviews.</p>
              </div>
            </div>
          )}

          {project?.feedback && (status === 'approved' || status === 'revision_needed') && (
            <div className="project-feedback card animate-fadeInUp delay-3">
              <h3>Mentor Feedback</h3>
              <p style={{ lineHeight: '1.6', color: 'var(--text-primary)' }}>{project.feedback}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectSubmission;
