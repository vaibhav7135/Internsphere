import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Users,
} from 'lucide-react';
import './ManageStudents.css';

const programs = ['All Programs', 'Web Development', 'Data Science', 'UI/UX Design', 'Machine Learning', 'App Development', 'Digital Marketing'];
const statuses = ['All Status', 'active', 'pending', 'completed'];

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('All Programs');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');

  // Student Form Details
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password',
    college: '',
    program: 'Web Development',
    batch: '',
    phone: '',
  });

  const itemsPerPage = 6;

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const allUsers = await response.json();
        const studentProfiles = allUsers.filter(u => u.role === 'student');
        
        const mappedProfiles = studentProfiles.map(s => ({
          id: s.id,
          name: s.name,
          email: s.email,
          college: s.college,
          program: s.enrolledProgram || 'Web Development',
          batch: s.batchId || 'WD-B1-2026',
          progress: s.progress || 0,
          status: s.status || 'pending',
          enrolledDate: s.enrolledDate || new Date().toISOString().split('T')[0],
        }));
        setStudents(mappedProfiles);
      }
    } catch (err) {
      console.error('Failed to fetch students from Spring Boot backend:', err);
    }
  };

  // Fetch from Spring Boot API on mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchProgram = filterProgram === 'All Programs' || s.program === filterProgram;
    const matchStatus = filterStatus === 'All Status' || s.status === filterStatus;
    return matchSearch && matchProgram && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student account?')) {
      try {
        const response = await fetch(`/api/users/student/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchStudents();
        } else {
          alert('Failed to delete student account.');
        }
      } catch (err) {
        console.error('Error deleting student:', err);
      }
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const response = await fetch('/api/users/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          college: formData.college,
          phone: formData.phone,
          program: formData.program,
          batch: formData.batch
        })
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({ name: '', email: '', password: 'password', college: '', program: 'Web Development', batch: '', phone: '' });
        fetchStudents();
      } else {
        const msg = await response.text();
        setErrorMsg(msg || 'Failed to create student account.');
      }
    } catch (err) {
      setErrorMsg('Server offline. Failed to connect to Spring Boot.');
    }
  };

  const getStatusBadge = (status) => {
    const map = { active: 'badge--success', pending: 'badge--warning', completed: 'badge--primary' };
    return `badge ${map[status] || 'badge--primary'}`;
  };

  const getProgressClass = (progress) => {
    if (progress >= 80) return 'progress-bar__fill--success';
    if (progress >= 50) return '';
    return 'progress-bar__fill--warning';
  };

  return (
    <div className="manage-students">
      <div className="manage-students__header animate-fadeInUp">
        <div>
          <h1 className="manage-students__title">Manage Students (Database Connection)</h1>
          <p className="manage-students__subtitle">Register student accounts and configure learning domains directly in MySQL</p>
        </div>
        <button className="btn btn--primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Create Student Account
        </button>
      </div>

      <div className="manage-students__filters animate-fadeInUp delay-1">
        <div className="manage-students__search">
          <Search size={18} className="manage-students__search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="manage-students__filter-group">
          <Filter size={16} />
          <select
            className="form-input form-select"
            value={filterProgram}
            onChange={(e) => { setFilterProgram(e.target.value); setCurrentPage(1); }}
          >
            {programs.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select
            className="form-input form-select"
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s === 'All Status' ? s : s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="manage-students__count animate-fadeInUp delay-1">
        <Users size={16} />
        <span>Showing {filtered.length} student{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="table-container animate-fadeInUp delay-2">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>College</th>
              <th>Domain Program</th>
              <th>Batch ID</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((student) => (
              <tr key={student.id}>
                <td>
                  <div className="manage-students__name-cell">
                    <div className="manage-students__avatar">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="manage-students__name">{student.name}</span>
                  </div>
                </td>
                <td>{student.email}</td>
                <td>{student.college}</td>
                <td><span className="badge badge--primary">{student.program}</span></td>
                <td><code className="manage-students__batch-code">{student.batch}</code></td>
                <td>
                  <div className="manage-students__progress-cell">
                    <div className="progress-bar">
                      <div
                        className={`progress-bar__fill ${getProgressClass(student.progress)}`}
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                    <span className="manage-students__progress-text">{student.progress}%</span>
                  </div>
                </td>
                <td>
                  <span className={getStatusBadge(student.status)}>
                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                  </span>
                </td>
                <td>
                  <div className="manage-students__actions">
                    <button className="btn btn--ghost btn--sm manage-students__delete-btn" onClick={() => handleDelete(student.id)} title="Delete">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan="8" className="manage-students__empty">No students found matching your criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="manage-students__pagination animate-fadeInUp delay-3">
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <div className="manage-students__page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`manage-students__page-btn ${page === currentPage ? 'manage-students__page-btn--active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop" onClick={() => { setShowModal(false); setErrorMsg(''); }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Create Student Account (MySQL)</h3>
              <button className="modal__close" onClick={() => { setShowModal(false); setErrorMsg(''); }}>
                <X size={20} />
              </button>
            </div>
            {errorMsg && (
              <div className="error-alert" style={{ color: 'var(--danger)', backgroundColor: 'var(--danger-bg)', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '13px' }}>
                {errorMsg}
              </div>
            )}
            <form onSubmit={handleAddStudent}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Deepak Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. deepak@demo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Login password (default: password)"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">College Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Delhi Technological University"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Internship Domain Program</label>
                <select
                  className="form-input form-select"
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                >
                  {programs.filter(p => p !== 'All Programs').map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Batch ID (Optional - Auto-generated if left blank)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. DS-B2-2026"
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                />
              </div>
              <div className="manage-students__modal-actions">
                <button type="button" className="btn btn--ghost" onClick={() => { setShowModal(false); setErrorMsg(''); }}>Cancel</button>
                <button type="submit" className="btn btn--primary">Register Student</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStudents;
