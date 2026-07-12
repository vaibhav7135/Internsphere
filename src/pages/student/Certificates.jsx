import { useState } from 'react';
import { Award, Download, ShieldCheck, Lock, ExternalLink, Calendar, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generateCertificatePDF } from '../../utils/generateCertificate';
import './Certificates.css';

const Certificates = () => {
  const { user } = useAuth();
  
  // Use progress to determine certificate availability. 
  // For demo support, let's allow generating a mock certificate even if progress is less than 100%.
  const [allowDemoDownload, setAllowDemoDownload] = useState(true);

  const mockCertificateDetails = {
    studentName: user?.name || 'Aarav Patel',
    studentEmail: user?.email || 'student@demo.com',
    program: 'Web Development',
    issueDate: new Date().toISOString().split('T')[0],
    certificateId: 'CERT-IS-2026-001',
    grade: 'A+',
    score: 95,
  };

  const handleDownload = () => {
    generateCertificatePDF(mockCertificateDetails);
  };

  return (
    <div className="certificates">
      <div className="certificates__header animate-fadeInUp">
        <h1>My Certificates</h1>
        <p>View, download, and verify your program completion certificates.</p>
      </div>

      <div className="certificates__grid">
        {/* Certificate Card */}
        {allowDemoDownload || user?.progress === 100 ? (
          <div className="certificates__card card animate-fadeInUp delay-1">
            <div className="certificates__card-top">
              <div className="certificates__badge-wrapper">
                <div className="certificates__logo-badge">
                  <Award size={28} />
                </div>
                <div className="certificates__status">
                  <span className="badge badge--success">
                    <ShieldCheck size={12} /> Verified
                  </span>
                </div>
              </div>
              <h3 className="certificates__title">Certificate of Internship Completion</h3>
              <p className="certificates__program">{mockCertificateDetails.program} Remote Internship</p>
              
              <div className="certificates__meta">
                <div className="certificates__meta-item">
                  <Calendar size={14} />
                  <span>Issued: {new Date(mockCertificateDetails.issueDate).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}</span>
                </div>
                <div className="certificates__meta-item">
                  <Search size={14} />
                  <span>ID: {mockCertificateDetails.certificateId}</span>
                </div>
              </div>
            </div>

            <div className="certificates__card-actions">
              <button onClick={handleDownload} className="btn btn--primary btn--sm">
                <Download size={14} /> Download PDF
              </button>
              <a
                href={`/verify-certificate?id=${mockCertificateDetails.certificateId}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn--secondary btn--sm"
              >
                <ExternalLink size={14} /> Verify Online
              </a>
            </div>
          </div>
        ) : (
          <div className="certificates__card certificates__card--locked card animate-fadeInUp delay-1">
            <div className="certificates__badge-wrapper">
              <div className="certificates__logo-badge certificates__logo-badge--locked">
                <Lock size={28} />
              </div>
              <div className="certificates__status">
                <span className="badge badge--danger">Locked</span>
              </div>
            </div>
            <h3 className="certificates__title">Certificate of Internship Completion</h3>
            <p className="certificates__program">{mockCertificateDetails.program} Remote Internship</p>
            
            <p className="certificates__locked-text">
              Complete all learning modules, assignments, and the final project to unlock your certificate.
            </p>

            <div className="certificates__progress-box">
              <div className="certificates__progress-label">
                <span>Current Progress</span>
                <span>{user?.progress || 0}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar__fill" style={{ width: `${user?.progress || 0}%` }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Demo helper */}
      {!allowDemoDownload && user?.progress < 100 && (
        <div className="certificates__demo-helper card animate-fadeInUp delay-2">
          <h4>💡 Instructor Demo Feature</h4>
          <p>Your current progress is under 100%, but you can bypass this to test the certificate generation PDF system.</p>
          <button className="btn btn--primary btn--sm" onClick={() => setAllowDemoDownload(true)}>
            Enable Certificate Mock Download
          </button>
        </div>
      )}
    </div>
  );
};

export default Certificates;
