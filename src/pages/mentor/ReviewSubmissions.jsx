import { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, Send } from 'lucide-react';
import { Github } from '../../components/ui/BrandIcons';
import { useAuth } from '../../context/AuthContext';
import './ReviewSubmissions.css';

const ReviewSubmissions = () => {
  const { user: mentor } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('pending'); // 'all', 'pending', 'graded'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Grading Form State
  const [gradingItem, setGradingItem] = useState(null);
  const [marks, setMarks] = useState(90);
  const [feedback, setFeedback] = useState('');

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const allUsers = await response.json();
        const domainStudents = allUsers.filter(
          (u) => u.role === 'student' && u.enrolledProgram === mentor?.enrolledProgram
        );

        const list = [];
        domainStudents.forEach((student) => {
          (student.assignments || []).forEach((a) => {
            if (a.status === 'submitted' || a.status === 'graded') {
              list.push({
                id: a.dbId,
                studentName: student.name,
                studentEmail: student.email,
                assignmentTitle: a.title,
                week: a.week,
                date: a.submittedDate || new Date().toISOString().split('T')[0],
                githubUrl: a.githubUrl || '',
                notes: a.notes || '',
                status: a.status === 'submitted' ? 'pending' : 'graded',
                marks: a.marks,
                feedback: a.feedback || '',
              });
            }
          });
        });
        setSubmissions(list);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    }
  };

  useEffect(() => {
    if (mentor) {
      fetchSubmissions();
    }
  }, [mentor]);

  const handleOpenGrading = (item) => {
    setGradingItem(item);
    setMarks(item.marks || 90);
    setFeedback(item.feedback || '');
  };

  const handleSaveGrading = async (e) => {
    e.preventDefault();
    if (!gradingItem) return;

    try {
      const response = await fetch(`/api/mentor/submissions/${gradingItem.id}/grade`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          marks: parseInt(marks),
          feedback,
        }),
      });

      if (response.ok) {
        setGradingItem(null);
        fetchSubmissions();
      } else {
        alert('Failed to save grading.');
      }
    } catch (err) {
      console.error('Error saving grade:', err);
    }
  };

  const filteredItems = submissions.filter((sub) => {
    const matchesSearch =
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab =
      activeTab === 'all' ? true : sub.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  return (
    <div className="review-submissions">
      <div className="review-submissions__header animate-fadeInUp">
        <h1>Review Submissions ({mentor?.enrolledProgram || 'All Programs'})</h1>
        <p>Evaluate student homework files, assign grades, and write constructive remarks.</p>
      </div>

      {/* Tabs and search bar */}
      <div className="review-submissions__toolbar animate-fadeInUp delay-1">
        <div className="review-tabs">
          <button
            className={`review-tab ${activeTab === 'pending' ? 'review-tab--active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Review
            <span className="badge badge--danger">
              {submissions.filter(s => s.status === 'pending').length}
            </span>
          </button>
          <button
            className={`review-tab ${activeTab === 'graded' ? 'review-tab--active' : ''}`}
            onClick={() => setActiveTab('graded')}
          >
            Reviewed
          </button>
          <button
            className={`review-tab ${activeTab === 'all' ? 'review-tab--active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
        </div>

        <div className="review-search">
          <Search size={18} className="review-search-icon" />
          <input
            type="text"
            className="form-input review-search-input"
            placeholder="Search student or assignment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="review-submissions__list">
        {filteredItems.map((item, idx) => (
          <div key={item.id} className="review-item-card card animate-fadeInUp" style={{ animationDelay: `${idx * 0.08}s` }}>
            <div className="review-item-main">
              <div className="review-item-header">
                <div>
                  <h3>{item.studentName}</h3>
                  <p className="student-email">{item.studentEmail}</p>
                </div>
                <span className={`badge ${item.status === 'graded' ? 'badge--success' : 'badge--warning'}`}>
                  {item.status === 'graded' ? 'Graded' : 'Pending Review'}
                </span>
              </div>

              <div className="review-item-details">
                <p><strong>Assignment:</strong> {item.assignmentTitle} (Week {item.week})</p>
                <p><strong>Submitted On:</strong> {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                {item.notes && (
                  <p className="review-student-notes" style={{ padding: '8px', backgroundColor: 'var(--background-alt)', borderRadius: '4px', margin: '10px 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <strong>Student Notes:</strong> {item.notes}
                  </p>
                )}
                
                <div className="review-links">
                  <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" className="review-link">
                    <Github size={14} /> View Repository
                  </a>
                </div>

                {item.status === 'graded' && (
                  <div className="review-grades-saved card card--flat" style={{ marginTop: '10px' }}>
                    <p><strong>Grade:</strong> {item.marks} / 100</p>
                    <p><strong>Feedback:</strong> {item.feedback}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="review-item-actions">
              <button className="btn btn--primary btn--sm" onClick={() => handleOpenGrading(item)}>
                {item.status === 'graded' ? 'Edit Evaluation' : 'Grade Submission'}
              </button>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="review-empty text-center card">
            <CheckCircle size={48} className="text-gradient" />
            <h3>No submissions found</h3>
            <p>You have cleared all pending items in this view.</p>
          </div>
        )}
      </div>

      {/* Grading Modal */}
      {gradingItem && (
        <div className="modal-backdrop" onClick={() => setGradingItem(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Evaluate Submission</h2>
              <button className="modal__close" onClick={() => setGradingItem(null)}>
                ×
              </button>
            </div>
            <p className="grading-subtitle">Student: {gradingItem.studentName}</p>
            <form onSubmit={handleSaveGrading} className="grading-form">
              <div className="form-group">
                <label className="form-label" htmlFor="marks">Marks Secured (Out of 100)</label>
                <input
                  type="number"
                  id="marks"
                  className="form-input"
                  min={0}
                  max={100}
                  required
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="feedback">Constructive Feedback</label>
                <textarea
                  id="feedback"
                  className="form-input form-textarea"
                  placeholder="Provide remarks on code structure, optimization, and responsive views..."
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn--primary btn--full">
                <Send size={16} /> Submit Evaluation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSubmissions;
