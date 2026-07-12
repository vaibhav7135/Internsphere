import { useState } from 'react';
import { Star, MessageSquare, Send, Users, ShieldAlert } from 'lucide-react';
import { mockStudents } from '../../data/users';
import './GiveFeedback.css';

const GiveFeedback = () => {
  const [selectedStudentId, setSelectedStudentId] = useState(mockStudents[0]?.id || '');
  const [rating, setRating] = useState(4);
  const [hoverRating, setHoverRating] = useState(null);
  
  // Category Ratings
  const [categories, setCategories] = useState({
    codeQuality: 4,
    communication: 4,
    timeliness: 5,
    creativity: 4,
  });

  const [feedbackText, setFeedbackText] = useState('');
  const [savedFeedback, setSavedFeedback] = useState([
    {
      id: 1,
      studentName: 'Aarav Patel',
      rating: 5,
      date: '2026-06-30',
      text: 'Exceptional work in the first phase. Very proactive and code is well optimized.',
    },
    {
      id: 2,
      studentName: 'Sneha Reddy',
      rating: 4,
      date: '2026-07-02',
      text: 'Good progress. Code readability could be improved with descriptive variables.',
    }
  ]);

  const handleCategoryRatingChange = (catName, score) => {
    setCategories({ ...categories, [catName]: score });
  };

  const handleSaveFeedback = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      alert('Feedback text cannot be empty');
      return;
    }

    const student = mockStudents.find(s => s.id === selectedStudentId);

    const newFeedback = {
      id: savedFeedback.length + 1,
      studentName: student ? student.name : 'Unknown Candidate',
      rating,
      date: new Date().toISOString().split('T')[0],
      text: feedbackText,
    };

    setSavedFeedback([newFeedback, ...savedFeedback]);
    setFeedbackText('');
    setRating(4);
    setCategories({ codeQuality: 4, communication: 4, timeliness: 5, creativity: 4 });
  };

  return (
    <div className="give-feedback">
      <div className="give-feedback__header animate-fadeInUp">
        <h1>Give Feedback</h1>
        <p>Conduct student performance evaluations, rate progress, and log developmental feedback.</p>
      </div>

      <div className="give-feedback__grid">
        {/* Feedback form */}
        <div className="give-feedback__main animate-fadeInUp delay-1">
          <form onSubmit={handleSaveFeedback} className="card feedback-form">
            <h3>New Performance Evaluation</h3>
            <p className="form-subtitle">Assess professional parameters and add feedback comments</p>

            <div className="form-group">
              <label className="form-label" htmlFor="student">Select Candidate</label>
              <div className="select-with-icon-box">
                <Users size={16} className="select-box-icon" />
                <select
                  id="student"
                  className="form-input form-select select-box-with-icon"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                >
                  {mockStudents.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.college})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Star Rating */}
            <div className="form-group">
              <label className="form-label">Overall Rating</label>
              <div className="star-rating-box">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className="star-btn"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                  >
                    <Star
                      size={24}
                      fill={star <= (hoverRating || rating) ? '#F59E0B' : 'transparent'}
                      color={star <= (hoverRating || rating) ? '#F59E0B' : '#94A3B8'}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="category-ratings-box card card--flat">
              <h4>Category Scores</h4>
              <div className="category-rating-row">
                <span>Code Quality & Architecture</span>
                <div className="cat-stars">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      type="button"
                      key={score}
                      onClick={() => handleCategoryRatingChange('codeQuality', score)}
                    >
                      <Star size={16} fill={score <= categories.codeQuality ? '#2563EB' : 'transparent'} color="#2563EB" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="category-rating-row">
                <span>Communication & Proactiveness</span>
                <div className="cat-stars">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      type="button"
                      key={score}
                      onClick={() => handleCategoryRatingChange('communication', score)}
                    >
                      <Star size={16} fill={score <= categories.communication ? '#2563EB' : 'transparent'} color="#2563EB" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="category-rating-row">
                <span>Timeliness & Deadlines Adherence</span>
                <div className="cat-stars">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      type="button"
                      key={score}
                      onClick={() => handleCategoryRatingChange('timeliness', score)}
                    >
                      <Star size={16} fill={score <= categories.timeliness ? '#2563EB' : 'transparent'} color="#2563EB" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="category-rating-row">
                <span>Creativity & Problem Solving</span>
                <div className="cat-stars">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      type="button"
                      key={score}
                      onClick={() => handleCategoryRatingChange('creativity', score)}
                    >
                      <Star size={16} fill={score <= categories.creativity ? '#2563EB' : 'transparent'} color="#2563EB" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="text">Evaluation Feedback Details</label>
              <textarea
                id="text"
                className="form-input form-textarea"
                placeholder="Describe candidate progress, key highlights, and constructive feedback remarks..."
                required
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn--primary btn--full">
              <Send size={16} /> Save Performance Log
            </button>
          </form>
        </div>

        {/* Sidebar logs */}
        <div className="give-feedback__sidebar animate-fadeInUp delay-2">
          <div className="card feedback-logs-card">
            <h3>Recent Log History</h3>
            <p className="form-subtitle">Evaluations filed on active student profiles</p>

            <div className="feedback-logs-list">
              {savedFeedback.map((fb) => (
                <div key={fb.id} className="feedback-log-item card card--flat">
                  <div className="feedback-log-header">
                    <h4>{fb.studentName}</h4>
                    <div className="feedback-log-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={12}
                          fill={star <= fb.rating ? '#F59E0B' : 'transparent'}
                          color={star <= fb.rating ? '#F59E0B' : '#94A3B8'}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="log-date">{new Date(fb.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <p className="log-text">"{fb.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiveFeedback;
