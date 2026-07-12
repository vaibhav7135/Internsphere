import { useState } from 'react';
import { Award, FileText, CheckCircle2, User, Search, RefreshCw, Download } from 'lucide-react';
import { mockStudents, mockCertificates } from '../../data/users';
import { generateCertificatePDF } from '../../utils/generateCertificate';
import './GenerateCertificates.css';

const initialEligible = [
  { id: 'student-6', name: 'Ananya Das', email: 'ananya@example.com', program: 'Web Development', progress: 100, completedDate: '2026-06-30' },
  { id: 'student-9', name: 'Harish Kumar', email: 'harish@example.com', program: 'Data Science', progress: 100, completedDate: '2026-07-08' },
];

const GenerateCertificates = () => {
  const [eligibleList, setEligibleList] = useState(initialEligible);
  const [issuedList, setIssuedList] = useState(mockCertificates);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(eligibleList.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleGenerate = () => {
    if (selectedIds.length === 0) return;

    const generatedCerts = [];
    const updatedEligible = eligibleList.filter((student) => {
      if (selectedIds.includes(student.id)) {
        const certId = `CERT-IS-2026-00${issuedList.length + generatedCerts.length + 1}`;
        const newCert = {
          id: certId,
          studentName: student.name,
          studentEmail: student.email,
          program: student.program,
          issueDate: new Date().toISOString().split('T')[0],
          grade: 'A+',
          score: 95,
          status: 'issued',
          verified: true,
        };
        generatedCerts.push(newCert);
        return false; // Remove from eligible list
      }
      return true;
    });

    setIssuedList([...generatedCerts, ...issuedList]);
    setEligibleList(updatedEligible);
    setSelectedIds([]);
    alert(`Successfully generated ${generatedCerts.length} certificates!`);
  };

  const handleDownload = (cert) => {
    generateCertificatePDF(cert);
  };

  const filteredIssued = issuedList.filter((c) =>
    c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="generate-certs">
      <div className="generate-certs__header animate-fadeInUp">
        <h1>Generate Certificates</h1>
        <p>Issue verified completion certificates for students who finished all program elements.</p>
      </div>

      <div className="generate-certs__grid">
        {/* Left Column: Eligible List to Generate */}
        <div className="generate-certs__main animate-fadeInUp delay-1">
          <div className="card eligible-card">
            <div className="card-header-flex">
              <h3>Eligible Students</h3>
              {selectedIds.length > 0 && (
                <button className="btn btn--primary btn--sm" onClick={handleGenerate}>
                  <RefreshCw size={14} /> Issue Selected ({selectedIds.length})
                </button>
              )}
            </div>
            <p className="form-subtitle">Candidates with 100% course element completion progress</p>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedIds.length === eligibleList.length && eligibleList.length > 0}
                        disabled={eligibleList.length === 0}
                      />
                    </th>
                    <th>Candidate</th>
                    <th>Program</th>
                    <th>Progress</th>
                    <th>Completion Date</th>
                  </tr>
                </thead>
                <tbody>
                  {eligibleList.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(student.id)}
                          onChange={() => handleCheckboxChange(student.id)}
                        />
                      </td>
                      <td>
                        <strong>{student.name}</strong>
                        <p className="student-email">{student.email}</p>
                      </td>
                      <td>{student.program}</td>
                      <td><span className="badge badge--success">{student.progress}%</span></td>
                      <td>{new Date(student.completedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                    </tr>
                  ))}

                  {eligibleList.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-4">
                        All eligible certificates have been generated. No pending candidates.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Issued Logs */}
        <div className="generate-certs__sidebar animate-fadeInUp delay-2">
          <div className="card issued-card">
            <h3>Issued Registry</h3>
            <p className="form-subtitle">Previously generated validated certificates log</p>

            <div className="search-box mb-4">
              <Search size={16} className="search-box-icon" />
              <input
                type="text"
                className="form-input search-box-input"
                placeholder="Search candidate name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="issued-scroll-list">
              {filteredIssued.map((c) => (
                <div key={c.id} className="issued-item-card card card--flat">
                  <div className="issued-item-header">
                    <h4>{c.studentName}</h4>
                    <button className="download-btn" onClick={() => handleDownload(c)} title="Download PDF">
                      <Download size={14} />
                    </button>
                  </div>
                  <code className="cert-code">{c.id}</code>
                  <p className="program-text">{c.program} - Grade: {c.grade}</p>
                </div>
              ))}

              {filteredIssued.length === 0 && (
                <div className="text-center text-muted py-4">
                  No certificates matching query.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateCertificates;
