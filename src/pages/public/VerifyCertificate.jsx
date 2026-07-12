import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router';
import { Award, ShieldCheck, ShieldAlert, Search, FileText, ArrowRight, User, Calendar, Star, Check } from 'lucide-react';
import { mockCertificates } from '../../data/users';
import './VerifyCertificate.css';

const VerifyCertificate = () => {
  const [searchParams] = useSearchParams();
  const [certId, setCertId] = useState('');
  const [searched, setSearched] = useState(false);
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    const urlId = searchParams.get('id');
    if (urlId) {
      setCertId(urlId);
      handleVerify(urlId);
    }
  }, [searchParams]);

  const handleVerify = (idToVerify) => {
    const id = idToVerify || certId;
    if (!id.trim()) return;

    setSearched(true);
    const found = mockCertificates.find(
      (c) => c.id.toLowerCase() === id.trim().toLowerCase()
    );
    setCertificate(found || null);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleVerify();
  };

  return (
    <div className="verify-page">
      <div className="container verify-container">
        <div className="verify-card card card--flat animate-scaleIn">
          <div className="verify-header">
            <div className="verify-logo-icon">
              <Award size={36} />
            </div>
            <h2>Verify Internship Certificate</h2>
            <p>Enter the unique certificate ID below to verify its authenticity instantly.</p>
          </div>

          <form onSubmit={handleSearchSubmit} className="verify-form">
            <div className="verify-search-box">
              <Search className="verify-search-icon" size={20} />
              <input
                type="text"
                className="form-input verify-search-input"
                placeholder="e.g. CERT-IS-2026-001"
                required
                value={certId}
                onChange={(e) => setCertId(e.target.value)}
              />
              <button type="submit" className="btn btn--primary verify-search-btn">
                Verify
              </button>
            </div>
          </form>

          {searched && (
            <div className="verify-results animate-fadeInUp">
              {certificate ? (
                <div className="verify-success card card--glass">
                  <div className="verify-success-badge">
                    <ShieldCheck size={28} />
                    <span>VERIFIED CERTIFICATE</span>
                  </div>

                  <div className="verify-details">
                    <div className="verify-detail-row">
                      <div className="verify-detail-icon"><User size={18} /></div>
                      <div className="verify-detail-content">
                        <label>Candidate Name</label>
                        <strong>{certificate.studentName}</strong>
                      </div>
                    </div>

                    <div className="verify-detail-row">
                      <div className="verify-detail-icon"><FileText size={18} /></div>
                      <div className="verify-detail-content">
                        <label>Internship Program</label>
                        <strong>{certificate.program} Remote Internship</strong>
                      </div>
                    </div>

                    <div className="verify-detail-row">
                      <div className="verify-detail-icon"><Calendar size={18} /></div>
                      <div className="verify-detail-content">
                        <label>Date of Issue</label>
                        <strong>{new Date(certificate.issueDate).toLocaleDateString('en-IN', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}</strong>
                      </div>
                    </div>

                    <div className="verify-detail-row">
                      <div className="verify-detail-icon"><Star size={18} /></div>
                      <div className="verify-detail-content">
                        <label>Grade Secured</label>
                        <strong>{certificate.grade} ({certificate.score}% Score)</strong>
                      </div>
                    </div>
                  </div>

                  <div className="verify-footer-banner">
                    <Check size={16} />
                    <span>This certificate is registered and authorized by InternSphere.</span>
                  </div>
                </div>
              ) : (
                <div className="verify-failed card card--glass">
                  <div className="verify-failed-badge">
                    <ShieldAlert size={28} />
                    <span>INVALID CERTIFICATE</span>
                  </div>
                  <h3>Certificate Not Found</h3>
                  <p>
                    The Certificate ID <code>{certId}</code> does not match any certificate in our records. Please verify the ID and try again.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="verify-info-notice">
            <p>
              Already have an account? <Link to="/login">Sign In here <ArrowRight size={14} /></Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;
