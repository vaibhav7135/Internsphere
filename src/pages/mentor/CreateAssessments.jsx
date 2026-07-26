import { useState, useEffect } from 'react';
import { ClipboardCheck, Plus, Trash, Clock, Save, Edit2, Trash2, Calendar, X, Sparkles, FileText, Zap, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { questionBank, parseBulkQuestions } from '../../data/questionBank';
import './CreateAssessments.css';

const CreateAssessments = () => {
  const { user: mentor } = useAuth();
  const [assessmentsList, setAssessmentsList] = useState([]);
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [timeLimit, setTimeLimit] = useState(20);
  const [dueDate, setDueDate] = useState('');
  const [editingOriginalTitle, setEditingOriginalTitle] = useState(null);

  // Batch Selection
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');

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

  // Bulk Import & AI Bank States
  const [builderMode, setBuilderMode] = useState('manual'); // 'manual' | 'bulk' | 'preset'
  const [bulkText, setBulkText] = useState('');
  const [selectedBankTopic, setSelectedBankTopic] = useState(Object.keys(questionBank)[0]);
  const [bankCount, setBankCount] = useState(5);
  const [importSuccessMsg, setImportSuccessMsg] = useState('');

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
                dueDate: a.dueDate || '',
                questions: a.questions || [],
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

  const fetchBatches = async () => {
    try {
      const response = await fetch(`/api/batches/mentor/${mentor?.id}`);
      if (response.ok) {
        const data = await response.json();
        setBatches(data);
      }
    } catch (err) {
      console.error('Failed to fetch batches:', err);
    }
  };

  useEffect(() => {
    if (mentor) {
      fetchAssessments();
      fetchBatches();
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

  const handleBulkImport = () => {
    const parsed = parseBulkQuestions(bulkText);
    if (parsed.length === 0) {
      alert("Could not parse any valid questions. Please check the formatting example!");
      return;
    }
    setQuestions([...questions, ...parsed]);
    setBulkText('');
    setBuilderMode('manual');
    setImportSuccessMsg(`Successfully imported ${parsed.length} questions!`);
    setTimeout(() => setImportSuccessMsg(''), 5000);
  };

  const handlePresetGenerate = () => {
    const bank = questionBank[selectedBankTopic] || [];
    const selectedQs = bank.slice(0, bankCount);
    if (selectedQs.length === 0) {
      alert("No questions available for this topic.");
      return;
    }
    setQuestions([...questions, ...selectedQs]);
    setBuilderMode('manual');
    setImportSuccessMsg(`Successfully generated and added ${selectedQs.length} questions from "${selectedBankTopic}"!`);
    setTimeout(() => setImportSuccessMsg(''), 5000);
  };

  const handleSaveAssessment = async (e) => {
    e.preventDefault();
    if (questions.length === 0) {
      alert('Please add at least 1 question to the assessment');
      return;
    }

    try {
      const url = '/api/mentor/assessments';
      const method = editingOriginalTitle ? 'PUT' : 'POST';
      const payload = {
        title,
        topic,
        questionsCount: questions.length,
        timeLimit,
        dueDate,
        domain: mentor?.enrolledProgram,
        batchCode: selectedBatch || undefined,
        questions,
      };
      if (editingOriginalTitle) {
        payload.originalTitle = editingOriginalTitle;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setTitle('');
        setTopic('');
        setTimeLimit(20);
        setDueDate('');
        setQuestions([]);
        setEditingOriginalTitle(null);
        fetchAssessments();
      } else {
        alert(editingOriginalTitle ? 'Failed to update assessment.' : 'Failed to publish assessment quiz.');
      }
    } catch (err) {
      console.error('Error saving assessment:', err);
    }
  };

  const handleStartEdit = (a) => {
    setEditingOriginalTitle(a.title);
    setTitle(a.title);
    setTopic(a.topic);
    setTimeLimit(a.timeLimit || 20);
    setDueDate(a.dueDate || '');
    setQuestions(
      a.questions && a.questions.length > 0
        ? a.questions.map((q) => ({
            questionText: q.questionText,
            options: q.options || [],
            correctAnswer: q.correctAnswer || 0,
          }))
        : []
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingOriginalTitle(null);
    setTitle('');
    setTopic('');
    setTimeLimit(20);
    setDueDate('');
    setQuestions([]);
  };

  const handleDeleteAssessment = async (title) => {
    if (!window.confirm(`Are you sure you want to delete the assessment "${title}" for all students?`)) {
      return;
    }
    try {
      const response = await fetch(
        `/api/mentor/assessments?title=${encodeURIComponent(title)}&domain=${encodeURIComponent(mentor?.enrolledProgram || '')}`,
        {
          method: 'DELETE',
        }
      );
      if (response.ok) {
        if (editingOriginalTitle === title) {
          handleCancelEdit();
        }
        fetchAssessments();
      } else {
        alert('Failed to delete assessment.');
      }
    } catch (err) {
      console.error('Error deleting assessment:', err);
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
              <label className="form-label">Target Batch</label>
              <select
                className="form-input form-select"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
              >
                <option value="">All Students (Domain-wide)</option>
                {batches.map(b => (
                  <option key={b.batchCode} value={b.batchCode}>
                    {b.batchCode} ({b.status === 'active' ? 'Active' : 'Upcoming'})
                  </option>
                ))}
              </select>
            </div>

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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="timeLimit">Time Limit (Mins)</label>
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

              <div className="form-group">
                <label className="form-label" htmlFor="dueDate">Due Date</label>
                <div className="input-with-icon-box">
                  <Calendar size={16} className="input-box-icon" />
                  <input
                    type="date"
                    id="dueDate"
                    className="form-input input-box-with-icon"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Question Builder */}
            <div className="question-builder card card--flat">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h4 style={{ margin: 0 }}>Question Builder</h4>
                  <p className="form-subtitle" style={{ margin: 0 }}>Choose how to assemble test questions</p>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className={`btn btn--sm ${builderMode === 'manual' ? 'btn--primary' : 'btn--ghost'}`}
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                    onClick={() => setBuilderMode('manual')}
                  >
                    ✏️ Manual Entry
                  </button>
                  <button
                    type="button"
                    className={`btn btn--sm ${builderMode === 'bulk' ? 'btn--primary' : 'btn--ghost'}`}
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                    onClick={() => setBuilderMode('bulk')}
                  >
                    ⚡ Bulk Paste / Import
                  </button>
                  <button
                    type="button"
                    className={`btn btn--sm ${builderMode === 'preset' ? 'btn--primary' : 'btn--ghost'}`}
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                    onClick={() => setBuilderMode('preset')}
                  >
                    ✨ AI Question Bank
                  </button>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '12px 0 16px 0' }} />

              {builderMode === 'manual' && (
                <>
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
                </>
              )}

              {builderMode === 'bulk' && (
                <div className="bulk-import-section animate-fadeInUp">
                  <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', marginBottom: '14px', borderLeft: '4px solid var(--primary)' }}>
                    <p style={{ margin: '0 0 6px 0', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      💡 Tip: Paste raw questions from Word, Google Docs, or ChatGPT directly!
                    </p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                      {`Format Example:
1. What is React?
A) A UI library *
B) A database
C) An operating system
D) A compiler

(Mark the correct answer option with an asterisk * or type (correct) next to it)`}
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Paste Raw Text Questions</label>
                    <textarea
                      className="form-input form-textarea"
                      style={{ minHeight: '160px', fontFamily: 'monospace', fontSize: '0.85rem' }}
                      placeholder="Paste your numbered questions and options here..."
                      value={bulkText}
                      onChange={(e) => setBulkText(e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    className="btn btn--primary btn--sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    onClick={handleBulkImport}
                  >
                    <Zap size={14} /> Parse & Import All Questions
                  </button>
                </div>
              )}

              {builderMode === 'preset' && (
                <div className="preset-bank-section animate-fadeInUp">
                  <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', marginBottom: '14px', borderLeft: '4px solid var(--success)' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      ✨ <strong>Instant Assessment Generator:</strong> Select a curated domain topic and instantly populate your test with verified technical questions!
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '15px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Select Domain Topic Bank</label>
                      <select
                        className="form-input form-select"
                        value={selectedBankTopic}
                        onChange={(e) => setSelectedBankTopic(e.target.value)}
                      >
                        {Object.keys(questionBank).map((topicKey) => (
                          <option key={topicKey} value={topicKey}>{topicKey}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label">Question Count</label>
                      <select
                        className="form-input form-select"
                        value={bankCount}
                        onChange={(e) => setBankCount(parseInt(e.target.value))}
                      >
                        <option value={3}>3 Questions</option>
                        <option value={5}>5 Questions</option>
                        <option value={8}>8 Questions</option>
                        <option value={10}>10 Questions (Full)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn--primary btn--sm"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--success)' }}
                    onClick={handlePresetGenerate}
                  >
                    <Sparkles size={14} /> Auto-Generate & Add Questions
                  </button>
                </div>
              )}
            </div>

            {/* Success Message Banner */}
            {importSuccessMsg && (
              <div className="badge badge--success animate-fadeInUp" style={{ display: 'block', padding: '12px 16px', margin: '16px 0', fontSize: '0.95rem', textAlign: 'center', borderRadius: '8px', border: '1px solid var(--success)' }}>
                ✔️ {importSuccessMsg}
              </div>
            )}

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

            <div style={{ display: 'flex', gap: '10px' }}>
              {editingOriginalTitle && (
                <button
                  type="button"
                  className="btn btn--ghost"
                  style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  onClick={handleCancelEdit}
                >
                  <X size={16} /> Cancel Edit
                </button>
              )}
              <button
                type="submit"
                className="btn btn--primary submit-assessment-btn"
                style={{ flex: editingOriginalTitle ? '2' : '1' }}
              >
                <Save size={16} /> {editingOriginalTitle ? 'Update Assessment' : 'Save and Launch Assessment'}
              </button>
            </div>
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
                  {a.dueDate && (
                    <p style={{ margin: '4px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <strong>Due:</strong> {a.dueDate}
                    </p>
                  )}
                  <div className="sidebar-assessment-meta">
                    <span>{a.questionsCount} Questions</span>
                    <span>{a.timeLimit} Mins</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '8px' }}>
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => handleStartEdit(a)}
                      style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px' }}
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={() => handleDeleteAssessment(a.title)}
                      style={{ color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px' }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
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
