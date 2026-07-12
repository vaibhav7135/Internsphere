import { useState, useEffect } from 'react';
import {
  Award,
  Download,
  ShieldCheck,
  Users,
  CheckCircle,
  Send,
  Calendar,
  Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateCertificatePDF } from '../../utils/generateCertificate';
import './DistributeCertificates.css';

const DistributeCertificates = () => {
  const { user: mentor } = useAuth();
  const [students, setStudents] = useState([]);
  const [issuedCerts, setIssuedCerts] = useState({}); // studentId => cert details
  const [issueModal, setIssueModal] = useState(null);
  const [grade, setGrade] = useState('A');
  const [score, setScore] = useState(90);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('eligible'); // 'eligible' | 'issued' | 'all'

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const allUsers = await response.json();
        const domainStudents = allUsers.filter(
          (u) => u.role === 'student' && u.enrolledProgram === mentor?.enrolledProgram
        );
        setStudents(domainStudents);

        // Load previously issued certs from localStorage
        const storedCerts = JSON.parse(localStorage.getItem('issuedCertificates') || '{}');
        setIssuedCerts(storedCerts);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  useEffect(() => {
    if (mentor) {
      fetchStudents();
    }
  }, [mentor]);

  const isEligible = (student) => {
    return student.progress >= 100;
  };

  const hasCertificate = (student) => {
    return !!issuedCerts[student.id];
  };

  const handleOpenIssue = (student) => {
    setIssueModal(student);
    setGrade('A');
    setScore(90);
  };

  const handleIssueCertificate = () => {
    if (!issueModal) return;

    const certId = `CERT-IS-${Date.now().toString().slice(-6)}`;
    const certDetails = {
      studentName: issueModal.name,
      studentEmail: issueModal.email,
      program: issueModal.enrolledProgram,
      issueDate: new Date().toISOString().split('T')[0],
      certificateId: certId,
      grade,
      score,
      issuedBy: mentor.name,
    };

    const updated = { ...issuedCerts, [issueModal.id]: certDetails };
    setIssuedCerts(updated);
    localStorage.setItem('issuedCertificates', JSON.stringify(updated));
    setIssueModal(null);
  };

  const handleDownloadCert = (student) => {
    const cert = issuedCerts[student.id];
    if (cert) {
      generateCertificatePDF(cert);
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterTab === 'eligible') return matchesSearch && isEligible(s) && !hasCertificate(s);
    if (filterTab === 'issued') return matchesSearch && hasCertificate(s);
    return matchesSearch; // 'all'
  });

  const eligibleCount = students.filter((s) => isEligible(s) && !hasCertificate(s)).length;
  const issuedCount = students.filter((s) => hasCertificate(s)).length;

  return (
    <div className="distribute-certs">
      <div className="distribute-certs__header animate-fadeInUp">
        <div>
          <h1>Distribute Certificates</h1>
          <p>
            Issue completion certificates to students who have finished their{' '}
            <strong>{mentor?.enrolledProgram || 'program'}</strong> internship.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="distribute-certs__stats animate-fadeInUp delay-1">
        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--blue">
            <Users size={22} />
          </div>
          <div className="stats-card__info">
            <h3>{students.length}</h3>
            <p>Total Students</p>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--green">
            <CheckCircle size={22} />
          </div>
          <div className="stats-card__info">
            <h3>{eligibleCount}</h3>
            <p>Eligible for Certificate</p>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--yellow">
            <Award size={22} />
          </div>
          <div className="stats-card__info">
            <h3>{issuedCount}</h3>
            <p>Certificates Issued</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs + Search */}
      <div className="distribute-certs__controls animate-fadeInUp delay-2">
        <div className="distribute-certs__tabs">
          <button
            className={`distribute-certs__tab ${filterTab === 'eligible' ? 'distribute-certs__tab--active' : ''}`}
            onClick={() => setFilterTab('eligible')}
          >
            Eligible ({eligibleCount})
          </button>
          <button
            className={`distribute-certs__tab ${filterTab === 'issued' ? 'distribute-certs__tab--active' : ''}`}
            onClick={() => setFilterTab('issued')}
          >
            Issued ({issuedCount})
          </button>
          <button
            className={`distribute-certs__tab ${filterTab === 'all' ? 'distribute-certs__tab--active' : ''}`}
            onClick={() => setFilterTab('all')}
          >
            All Students ({students.length})
          </button>
        </div>
        <div className="distribute-certs__search">
          <Search size={16} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Student List */}
      <div className="distribute-certs__list">
        {filteredStudents.map((student, idx) => (
          <div
            key={student.id}
            className="distribute-certs__card card animate-fadeInUp"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="distribute-certs__card-left">
              <div className="distribute-certs__avatar">
                {student.avatar || student.name?.slice(0, 2).toUpperCase()}
              </div>
              <div className="distribute-certs__info">
                <h3>{student.name}</h3>
                <p className="distribute-certs__email">{student.email}</p>
                <div className="distribute-certs__meta-row">
                  <span className="badge badge--primary">{student.enrolledProgram}</span>
                  <span className="distribute-certs__progress-label">
                    Progress: <strong>{student.progress || 0}%</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="distribute-certs__card-right">
              {hasCertificate(student) ? (
                <div className="distribute-certs__issued-info">
                  <span className="badge badge--success">
                    <ShieldCheck size={12} /> Certificate Issued
                  </span>
                  <span className="distribute-certs__cert-id">
                    {issuedCerts[student.id].certificateId}
                  </span>
                  <button
                    className="btn btn--secondary btn--sm"
                    onClick={() => handleDownloadCert(student)}
                  >
                    <Download size={14} /> Download PDF
                  </button>
                </div>
              ) : isEligible(student) ? (
                <button
                  className="btn btn--primary btn--sm"
                  onClick={() => handleOpenIssue(student)}
                >
                  <Send size={14} /> Issue Certificate
                </button>
              ) : (
                <span className="badge badge--danger">Not Eligible ({student.progress || 0}%)</span>
              )}
            </div>
          </div>
        ))}

        {filteredStudents.length === 0 && (
          <div className="distribute-certs__empty card" style={{ padding: '40px', textAlign: 'center' }}>
            <Award size={48} style={{ color: 'var(--text-secondary)', marginBottom: '12px' }} />
            <h3 style={{ color: 'var(--text-secondary)' }}>
              {filterTab === 'eligible'
                ? 'No students are eligible for certificates yet.'
                : filterTab === 'issued'
                ? 'No certificates have been issued yet.'
                : 'No students found.'}
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Students must reach 100% progress to become eligible for certificate distribution.
            </p>
          </div>
        )}
      </div>

      {/* Issue Certificate Modal */}
      {issueModal && (
        <div className="modal-backdrop" onClick={() => setIssueModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">Issue Certificate</h2>
              <button className="modal__close" onClick={() => setIssueModal(null)}>×</button>
            </div>

            <div className="distribute-certs__modal-body">
              <div className="distribute-certs__modal-student">
                <div className="distribute-certs__avatar distribute-certs__avatar--lg">
                  {issueModal.avatar || issueModal.name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3>{issueModal.name}</h3>
                  <p>{issueModal.email}</p>
                  <span className="badge badge--primary">{issueModal.enrolledProgram}</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Grade</label>
                <select
                  className="form-input form-select"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                >
                  <option value="A+">A+ (Outstanding)</option>
                  <option value="A">A (Excellent)</option>
                  <option value="B+">B+ (Very Good)</option>
                  <option value="B">B (Good)</option>
                  <option value="C">C (Satisfactory)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Final Score (%)</label>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                />
              </div>

              <div className="distribute-certs__modal-preview">
                <Award size={20} style={{ color: 'var(--primary)' }} />
                <span>
                  Certificate will be generated for <strong>{issueModal.name}</strong> with grade{' '}
                  <strong>{grade}</strong> and score <strong>{score}%</strong>.
                </span>
              </div>

              <div className="modal-action-btn-group">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setIssueModal(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={handleIssueCertificate}
                >
                  <Award size={16} /> Issue Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributeCertificates;
