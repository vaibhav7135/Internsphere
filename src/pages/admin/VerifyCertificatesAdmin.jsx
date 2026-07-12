import { useState } from 'react';
import { Search, ShieldCheck, ShieldAlert, Award, FileText, Calendar, Trash } from 'lucide-react';
import { mockCertificates } from '../../data/users';
import './VerifyCertificatesAdmin.css';

const VerifyCertificatesAdmin = () => {
  const [certs, setCerts] = useState(mockCertificates);
  const [searchId, setSearchId] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setSearched(true);
    const found = certs.find(c => c.id.toLowerCase() === searchId.trim().toLowerCase());
    setResult(found || null);
  };

  const handleRevoke = (id) => {
    if (window.confirm(`Are you sure you want to revoke certificate ${id}?`)) {
      setCerts(certs.filter(c => c.id !== id));
      if (result && result.id === id) {
        setResult(null);
        setSearched(false);
      }
      alert(`Certificate ${id} successfully revoked.`);
    }
  };

  return (
    <div className="verify-admin">
      <div className="verify-admin__header animate-fadeInUp">
        <h1>Verify & Revoke Certificates</h1>
        <p>Audit issued credentials, look up certificate registry details, or revoke valid certificates.</p>
      </div>

      <div className="verify-admin__grid">
        {/* Search Audit Side */}
        <div className="verify-admin__search card animate-fadeInUp delay-1">
          <h3>Registry Search</h3>
          <p className="form-subtitle">Search database records by certificate ID</p>

          <form onSubmit={handleSearch} className="verify-admin-search-form">
            <div className="verify-search-box">
              <Search className="verify-search-icon" size={18} />
              <input
                type="text"
                className="form-input verify-search-input"
                placeholder="e.g. CERT-IS-2026-001"
                required
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
              />
              <button type="submit" className="btn btn--primary verify-search-btn">
                Audit
              </button>
            </div>
          </form>

          {searched && (
            <div className="verify-admin-results mt-6">
              {result ? (
                <div className="verify-success card card--glass">
                  <div className="verify-success-badge">
                    <ShieldCheck size={24} />
                    <span>REGISTRY FOUND</span>
                  </div>

                  <div className="verify-details">
                    <p><strong>Candidate:</strong> {result.studentName}</p>
                    <p><strong>Program:</strong> {result.program} Remote Internship</p>
                    <p><strong>Issued On:</strong> {new Date(result.issueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p><strong>Score / Grade:</strong> {result.grade} ({result.score}%)</p>
                  </div>

                  <button className="btn btn--danger btn--sm btn--full mt-4" onClick={() => handleRevoke(result.id)}>
                    <Trash size={14} /> Revoke Certificate
                  </button>
                </div>
              ) : (
                <div className="verify-failed card card--glass">
                  <div className="verify-failed-badge">
                    <ShieldAlert size={24} />
                    <span>NOT FOUND</span>
                  </div>
                  <p>No active registry matched <code>{searchId}</code>.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Complete List Table */}
        <div className="verify-admin__list card animate-fadeInUp delay-2">
          <h3>Certificate Registry Database</h3>
          <p className="form-subtitle">All active certificates issued by the platform</p>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Cert ID</th>
                  <th>Candidate</th>
                  <th>Program</th>
                  <th>Issue Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {certs.map((c) => (
                  <tr key={c.id}>
                    <td><code>{c.id}</code></td>
                    <td>{c.studentName}</td>
                    <td>{c.program}</td>
                    <td>{new Date(c.issueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                    <td>
                      <button className="btn btn--danger btn--sm btn--icon" onClick={() => handleRevoke(c.id)} title="Revoke Certificate">
                        <Trash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificatesAdmin;
