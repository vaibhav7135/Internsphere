import { useState, useEffect } from 'react';
import { ClipboardCheck, Play, Award, CheckCircle, Clock, X, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { domainContent } from '../../data/domainContent';
import './Assessments.css';

const sampleQuizQuestions = [
  {
    id: 1,
    questionText: 'Which of the following is correct about modular programming?',
    options: [
      'It isolates code into reusable and standalone modules',
      'It requires all code to reside in a single file',
      'It is only supported in compiled languages',
      'None of the above'
    ],
    correctAnswer: 0
  },
  {
    id: 2,
    questionText: 'What is a core benefit of testing applications?',
    options: [
      'It guarantees there will be zero future enhancements',
      'It reduces manual verification efforts and ensures regression safety',
      'It increases application bundle size exponentially',
      'It disables security parameters'
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    questionText: 'What does environment variable configuration support?',
    options: [
      'Storing secrets outside of source control code repositories',
      'Speeding up browser rendering engines',
      'Translating codebase files into multiple languages',
      'Defining custom CSS variables'
    ],
    correctAnswer: 0
  }
];

const Assessments = () => {
  const { user } = useAuth();

  const domain = user?.enrolledProgram || 'Web Development';
  const { submitAssessment } = useAuth();
  const assessments = user?.assessments || [];

  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState(0);
  
  // Timer state (seconds)
  const [timeLeft, setTimeLeft] = useState(0);

  // Derived active questions
  const activeQuestions = selectedAssessment?.questions?.length > 0 
    ? selectedAssessment.questions 
    : sampleQuizQuestions;

  // Auto-submit timer effect
  useEffect(() => {
    let timer;
    if (showQuizModal && !quizSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Time is up! Auto-submit
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showQuizModal, quizSubmitted, timeLeft]);

  // Use a ref-less approach by relying on the current state inside the effect
  const handleAutoSubmit = () => {
    handleQuizSubmit();
  };

  const handleStartQuiz = (assessment) => {
    setSelectedAssessment(assessment);
    setCurrentQuestion(0);
    setSelectedOptions({});
    setQuizSubmitted(false);
    setCalculatedScore(0);
    setTimeLeft(assessment.timeLimit * 60); // convert minutes to seconds
    setShowQuizModal(true);
  };

  const handleOptionSelect = (optionIdx) => {
    setSelectedOptions(prev => ({ ...prev, [currentQuestion]: optionIdx }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < activeQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuizSubmit = () => {
    let correctCounts = 0;
    activeQuestions.forEach((q, idx) => {
      if (selectedOptions[idx] === q.correctAnswer) {
        correctCounts += 1;
      }
    });

    const percent = Math.round((correctCounts / activeQuestions.length) * 100);
    setCalculatedScore(percent);
    setQuizSubmitted(true);

    // Submit and persist quiz result dynamically
    submitAssessment(selectedAssessment.id, percent);
  };

  const closeQuizModal = () => {
    setShowQuizModal(false);
    setSelectedAssessment(null);
  };

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="assessments">
      <div className="assessments__header animate-fadeInUp">
        <h1>Assessments</h1>
        <p>Test your knowledge with weekly quizzes and modular assessments in {domain}</p>
      </div>

      <div className="assessments__grid">
        {assessments.map((a, idx) => (
          <div
            key={a.id}
            className={`assessments__card card animate-fadeInUp delay-${Math.min(idx + 1, 5)} ${
              a.status === 'locked' ? 'assessments__card--locked' : ''
            }`}
          >
            <div className="assessments__card-header">
              <span className={`badge ${
                a.status === 'completed' ? 'badge--success' : a.status === 'pending' ? 'badge--warning' : 'badge--primary'
              }`}>
                {a.status === 'completed' ? 'Completed' : a.status === 'pending' ? 'Available' : 'Locked'}
              </span>
              <div className="assessments__card-time">
                <Clock size={14} />
                <span>{a.timeLimit} mins</span>
              </div>
            </div>

            <h3 className="assessments__card-title">{a.title}</h3>
            <p className="assessments__card-topic"><strong>Topics:</strong> {a.topic}</p>

            <div className="assessments__card-footer">
              <div className="assessments__card-info">
                <span>{a.questionsCount} Questions</span>
              </div>

              {a.status === 'completed' ? (
                <div className="assessments__card-score">
                  <Award size={16} className="text-gradient" />
                  <span className="assessments__score-num">{a.score}%</span>
                </div>
              ) : a.status === 'pending' ? (
                <button className="btn btn--primary btn--sm" onClick={() => handleStartQuiz(a)}>
                  <Play size={12} /> Start Quiz
                </button>
              ) : (
                <button className="btn btn--secondary btn--sm" disabled>
                  Locked
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showQuizModal && selectedAssessment && (
        <div className="modal-backdrop" onClick={closeQuizModal}>
          <div className="modal modal--quiz" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">{selectedAssessment.title}</h2>
              <button className="modal__close" onClick={closeQuizModal}>
                <X size={20} />
              </button>
            </div>

            {!quizSubmitted ? (
              <div className="quiz-content">
                <div className="quiz-progress">
                  <div className="quiz-progress-label">
                    <span>Question {currentQuestion + 1} of {activeQuestions.length}</span>
                    <span className={timeLeft <= 60 ? 'text-danger' : ''}>
                      Time remaining: {formatTime(timeLeft)}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar__fill"
                      style={{ width: `${((currentQuestion + 1) / activeQuestions.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="quiz-question-box card">
                  <p className="quiz-question">{activeQuestions[currentQuestion].questionText}</p>
                  <div className="quiz-options">
                    {activeQuestions[currentQuestion].options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        className={`quiz-option-btn ${selectedOptions[currentQuestion] === optIdx ? 'quiz-option-btn--selected' : ''}`}
                        onClick={() => handleOptionSelect(optIdx)}
                      >
                        <span className="quiz-option-letter">{String.fromCharCode(65 + optIdx)}</span>
                        <span className="quiz-option-text">{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="quiz-nav">
                  <button
                    className="btn btn--secondary btn--sm"
                    disabled={currentQuestion === 0}
                    onClick={handlePrevQuestion}
                  >
                    Previous
                  </button>

                  {currentQuestion < activeQuestions.length - 1 ? (
                    <button
                      className="btn btn--primary btn--sm"
                      disabled={selectedOptions[currentQuestion] === undefined}
                      onClick={handleNextQuestion}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      className="btn btn--success btn--sm"
                      disabled={selectedOptions[currentQuestion] === undefined}
                      onClick={() => handleQuizSubmit()}
                    >
                      Submit Assessment
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="quiz-results-view text-center">
                <div className="quiz-result-icon">
                  <CheckCircle size={48} className="text-gradient" />
                </div>
                <h3>Quiz Completed!</h3>
                <p>You have submitted the quiz successfully.</p>
                <div className="quiz-result-score-box card">
                  <label>Your Score</label>
                  <h2>{calculatedScore}%</h2>
                  <p className="status-label">
                    {calculatedScore >= 80 ? (
                      <span className="badge badge--success">PASS</span>
                    ) : (
                      <span className="badge badge--danger">FAIL (Needs 80% to pass)</span>
                    )}
                  </p>
                </div>
                <div className="quiz-results-breakdown">
                  <p>Correct Answers: {activeQuestions.filter((q, idx) => selectedOptions[idx] === q.correctAnswer).length} / {activeQuestions.length}</p>
                </div>
                <button className="btn btn--primary" onClick={closeQuizModal}>
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Assessments;
