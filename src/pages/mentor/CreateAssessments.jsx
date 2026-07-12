import { useState, useEffect } from 'react';
import { ClipboardCheck, Plus, Trash, Clock, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './CreateAssessments.css';

const CreateAssessments = () => {
  const { user: mentor } = useAuth();
  const [assessmentsList, setAssessmentsList] = useState([]);
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [timeLimit, setTimeLimit] = useState(20);

  // Question Builder States
  const [questions, setQuestions] = useState([
    {
      questionText: 'What is the purpose of React state?',
      options: ['To hold persistent local data', 'To query the database directly', 'To define static global constants', 'To configure Webpack'],
      correctAnswer: 0,
    }
  ]);
  const [currentQText, setCurrentQText] = useState('');
  const [currentOptions, setCurrentOptions] = useState(['', '', '', '']);
  const [correctOptionIdx, setCorrectOptionIdx] = useState(0);

  const fetchAssessments = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const allUsers = await response.json();
        const domainStudents = allUsers.filter(
          (u) => u.role === 'student' && u.enrolledProgram === mentor?.enrolledProgram
        );

        // Group assessments by title to display unique quizzes
        const map = new Map();
        domainStudents.forEach((student) => {
          (student.assessments || []).forEach((a) => {
            if (!map.has(a.title)) {
              map.set(a.title, {
                id: a.dbId,
                title: a.title,
                topic: a.topic,
                questionsCount: a.questionsCount,
                timeLimit: a.timeLimit,
                submissions: 0,
              });
            }
            if (a.status === 'completed') {
              map.get(a.title).submissions += 1;
            }
          });
        });
        setAssessmentsList(Array.from(map.values()));
      }
    } catch (err) {
      console.error('Failed to fetch assessments:', err);
    }
  };

  useEffect(() => {
    if (mentor) {
      fetchAssessments();
    }
  }, [mentor]);

  const handleOptionChange = (idx, value) => {
    const updated = [...currentOptions];
    updated[idx] = value;
    setCurrentOptions(updated);
  };

  const handleAddQuestion = () => {
    if (!currentQText.trim()) {
      alert('Question text cannot be empty');
      return;
    }
    if (currentOptions.some(o => !o.trim())) {
      alert('All 4 options must be filled out');
      return;
    }

    setQuestions([
      ...questions,
      {
        questionText: currentQText,
        options: [...currentOptions],
        correctAnswer: correctOptionIdx,
      }
    ]);

    // Reset Question Builder
    setCurrentQText('');
    setCurrentOptions(['', '', '', '']);
    setCorrectOptionIdx(0);
  };

  const handleRemoveQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleSaveAssessment = async (e) => {
    e.preventDefault();
    if (questions.length === 0) {
      alert('Please add at least 1 question to the assessment');
      return;
    }

    try {
      const response = await fetch('/api/mentor/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          topic,
          questionsCount: questions.length,
          timeLimit,
          domain: mentor?.enrolledProgram,
        }),
      });

      if (response.ok) {
        setTitle('');
        setTopic('');
        setTimeLimit(20);
        setQuestions([]);
        fetchAssessments();
      } else {
        alert('Failed to publish assessment quiz.');
      }
    } catch (err) {
      console.error('Error publishing assessment:', err);
    }
  };

  return (
    <div className="create-assessments">
      <div className="create-assessments__header animate-fadeInUp">
        <h1>Create Assessment ({mentor?.enrolledProgram || 'All Programs'})</h1>
        <p>Design modular assessments, build tests, and add multiple-choice questions for students in your domain.</p>
      </div>

      <div className="create-assessments__grid">
        {/* Creation Form */}
        <div className="create-assessments__main animate-fadeInUp delay-1">
          <form onSubmit={handleSaveAssessment} className="card assessment-form">
            <h3>Assessment Parameters</h3>
            <p className="form-subtitle">Define general limits and configurations</p>

            <div className="form-group">
              <label className="form-label" htmlFor="title">Assessment Title</label>
              <input
                type="text"
                id="title"
                className="form-input"
                placeholder="e.g. Node.js & Express REST APIs"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="topic">Topic Coverage</label>
              <input
                type="text"
                id="topic"
                className="form-input"
                placeholder="e.g. CRUD Operations, Middleware, Routing"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="timeLimit">Time Limit (Minutes)</label>
              <div className="input-with-icon-box">
                <Clock size={16} className="input-box-icon" />
                <input
                  type="number"
                  id="timeLimit"
                  className="form-input input-box-with-icon"
                  required
                  min={5}
                  max={120}
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                />
              </div>
            </div>

            {/* Question Builder */}
            <div className="question-builder card card--flat">
              <h4>Question Builder</h4>
              <p className="form-subtitle">Assemble multiple-choice questions</p>

              <div className="form-group">
                <label className="form-label">Question Text</label>
                <textarea
                  className="form-input form-textarea form-textarea--sm"
                  placeholder="Enter the question text here..."
                  value={currentQText}
                  onChange={(e) => setCurrentQText(e.target.value)}
                />
              </div>

              <div className="builder-options-grid">
                {currentOptions.map((opt, optIdx) => (
                  <div key={optIdx} className="form-group">
                    <label className="form-label">Option {String.fromCharCode(65 + optIdx)}</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder={`Enter option ${String.fromCharCode(65 + optIdx)}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(optIdx, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label className="form-label">Correct Option Selector</label>
                <select
                  className="form-input form-select"
                  value={correctOptionIdx}
                  onChange={(e) => setCorrectOptionIdx(parseInt(e.target.value))}
                >
                  <option value={0}>Option A</option>
                  <option value={1}>Option B</option>
                  <option value={2}>Option C</option>
                  <option value={3}>Option D</option>
                </select>
              </div>

              <button type="button" className="btn btn--secondary btn--sm" onClick={handleAddQuestion}>
                <Plus size={14} /> Add Question to Test
              </button>
            </div>

            {/* Added Questions List */}
            {questions.length > 0 && (
              <div className="added-questions-list">
                <h4>Questions Added ({questions.length})</h4>
                <div className="questions-scroll">
                  {questions.map((q, idx) => (
                    <div key={idx} className="added-question-item">
                      <div className="added-question-item-header">
                        <h5>Q{idx + 1}: {q.questionText}</h5>
                        <button type="button" className="question-remove-btn" onClick={() => handleRemoveQuestion(idx)}>
                          <Trash size={14} />
                        </button>
                      </div>
                      <ul className="added-question-options">
                        {q.options.map((opt, oIdx) => (
                          <li key={oIdx} className={oIdx === q.correctAnswer ? 'text-success' : ''}>
                            {String.fromCharCode(65 + oIdx)}. {opt} {oIdx === q.correctAnswer && '✔️'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" className="btn btn--primary btn--full submit-assessment-btn">
              <Save size={16} /> Save and Launch Assessment
            </button>
          </form>
        </div>

        {/* Existing List Sidebar */}
        <div className="create-assessments__sidebar animate-fadeInUp delay-2">
          <div className="card existing-assessments-card">
            <h3>Active Assessments</h3>
            <p className="form-subtitle">Verify previously launched tests</p>

            <div className="assessments-sidebar-list">
              {assessmentsList.map((a) => (
                <div key={a.title} className="sidebar-assessment-item card card--flat">
                  <div className="sidebar-assessment-item-header">
                    <h4>{a.title}</h4>
                    <span className="badge badge--success">{a.submissions} Completed</span>
                  </div>
                  <p><strong>Topic:</strong> {a.topic}</p>
                  <div className="sidebar-assessment-meta">
                    <span>{a.questionsCount} Questions</span>
                    <span>{a.timeLimit} Mins</span>
                  </div>
                </div>
              ))}
              {assessmentsList.length === 0 && (
                <div className="sidebar-assessment-empty" style={{ textAlign: 'center', padding: '15px', color: 'var(--text-secondary)' }}>
                  No active assessments yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssessments;
