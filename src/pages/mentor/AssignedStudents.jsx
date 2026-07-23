import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  MessageSquare,
  X,
  Mail,
  GraduationCap,
  Calendar,
  BarChart3,
  Users,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AssignedStudents.css';

const statusConfig = {
  active: { label: 'Active', className: 'badge--success' },
  pending: { label: 'Pending', className: 'badge--warning' },
  completed: { label: 'Completed', className: 'badge--primary' },
};

const AssignedStudents = () => {
  const { user: mentor } = useAuth();
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Batch Filter
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('all');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const allUsers = await response.json();
          // Filter students who are in this mentor's program domain
          const filteredList = allUsers.filter(
            (u) => u.role === 'student' && u.enrolledProgram === mentor?.enrolledProgram
          );
          
          const mapped = filteredList.map(s => ({
            id: s.id,
            name: s.name,
            email: s.email,
            college: s.college || 'N/A',
            program: s.enrolledProgram,
            progress: s.progress || 0,
            status: s.status || 'active',
            enrolledDate: s.enrolledDate || new Date().toISOString().split('T')[0],
          }));
          setStudents(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch assigned students:', err);
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
    if (mentor) {
      fetchStudents();
      fetchBatches();
    }
  }, [mentor]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.college.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || student.status === statusFilter;
        
      const matchesBatch = selectedBatch === 'all' || student.batchCode === selectedBatch;

      return matchesSearch && matchesStatus && matchesBatch;
    });
  }, [students, searchQuery, statusFilter, selectedBatch]);

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'progress-bar__fill--success';
    if (progress >= 50) return '';
    return 'progress-bar__fill--warning';
  };

  return (
    <div className="assigned-students">
      {/* Page Header */}
      <div className="assigned-students__header animate-fadeInUp">
        <div>
          <h1 className="assigned-students__title">
            <Users size={28} />
            Assigned Students ({mentor?.enrolledProgram || 'All Domains'})
          </h1>
          <p className="assigned-students__subtitle">
            Monitor and track learning performance of students in your domain program
          </p>
        </div>
        <div className="assigned-students__count">
          <span className="assigned-students__count-value">{filteredStudents.length}</span>
          <span className="assigned-students__count-label">Students</span>
        </div>
      </div>

      {/* Filters */}
      <div className="assigned-students__filters animate-fadeInUp delay-1">
        <div className="assigned-students__search">
          <Search size={18} className="assigned-students__search-icon" />
          <input
            type="text"
            className="form-input assigned-students__search-input"
            placeholder="Search by name, email, or college..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="assigned-students__filter-group">
          <Layers size={16} />
          <select
            className="form-input form-select assigned-students__filter-select"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            <option value="all">All Batches</option>
            {batches.map(b => (
              <option key={b.batchCode} value={b.batchCode}>
                {b.batchCode}
              </option>
            ))}
          </select>
        </div>
        <div className="assigned-students__filter-group">
          <Filter size={16} />
          <select
            className="form-input form-select assigned-students__filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container animate-fadeInUp delay-2">
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>College</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => {
              const config = statusConfig[student.status] || { label: 'Active', className: 'badge--success' };
              return (
                <tr key={student.id}>
                  <td>
                    <div className="assigned-students__student-cell">
                      <div className="assigned-students__avatar">
                        {student.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <span className="assigned-students__student-name">
                        {student.name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="assigned-students__email">{student.email}</span>
                  </td>
                  <td>{student.college}</td>
                  <td>
                    <div className="assigned-students__progress-cell">
                      <div className="progress-bar">
                        <div
                          className={`progress-bar__fill ${getProgressColor(student.progress)}`}
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="assigned-students__progress-text">
                        {student.progress}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${config.className}`}>{config.label}</span>
                  </td>
                  <td>
                    <div className="assigned-students__actions">
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => setSelectedStudent(student)}
                        title="View Details"
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={6} className="assigned-students__empty">
                  No students enrolled in your domain program.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="modal-backdrop" onClick={() => setSelectedStudent(null)}>
          <div className="modal assigned-students__modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Student Details</h3>
              <button
                className="modal__close"
                onClick={() => setSelectedStudent(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="assigned-students__modal-body">
              <div className="assigned-students__modal-profile">
                <div className="assigned-students__modal-avatar">
                  {selectedStudent.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <h3>{selectedStudent.name}</h3>
                <span className={`badge ${(statusConfig[selectedStudent.status] || {className: 'badge--success'}).className}`}>
                  {(statusConfig[selectedStudent.status] || {label: 'Active'}).label}
                </span>
              </div>

              <div className="assigned-students__modal-details">
                <div className="assigned-students__modal-detail">
                  <Mail size={16} />
                  <span>{selectedStudent.email}</span>
                </div>
                <div className="assigned-students__modal-detail">
                  <GraduationCap size={16} />
                  <span>{selectedStudent.college}</span>
                </div>
                <div className="assigned-students__modal-detail">
                  <BarChart3 size={16} />
                  <span>Program: {selectedStudent.program}</span>
                </div>
                <div className="assigned-students__modal-detail">
                  <Calendar size={16} />
                  <span>
                    Enrolled:{' '}
                    {new Date(selectedStudent.enrolledDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className="assigned-students__modal-progress">
                <div className="assigned-students__modal-progress-header">
                  <span>Overall Progress</span>
                  <span className="assigned-students__modal-progress-value">
                    {selectedStudent.progress}%
                  </span>
                </div>
                <div className="progress-bar" style={{ height: '12px' }}>
                  <div
                    className={`progress-bar__fill ${getProgressColor(selectedStudent.progress)}`}
                    style={{ width: `${selectedStudent.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignedStudents;
