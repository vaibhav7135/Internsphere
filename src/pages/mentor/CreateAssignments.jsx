import { useState, useEffect } from 'react';
import {
  FilePlus,
  Plus,
  Calendar,
  Award,
  BookOpen,
  CheckCircle,
  ClipboardList,
  FileText,
  Edit,
  X,
  Trash2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './CreateAssignments.css';

const CreateAssignments = () => {
  const { user: mentor } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    week: 1,
    dueDate: '',
    maxMarks: 100,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // Edit Assignment State
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    week: 1,
    dueDate: '',
  });

  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const allUsers = await response.json();
        const domainStudents = allUsers.filter(
          (u) => u.role === 'student' && u.enrolledProgram === mentor?.enrolledProgram
        );

        // Group assignments by title to display unique assignments
        const map = new Map();
        domainStudents.forEach((student) => {
          (student.assignments || []).forEach((a) => {
            if (!map.has(a.title)) {
              map.set(a.title, {
                id: a.dbId,
                title: a.title,
                description: a.description,
                week: a.week,
                dueDate: a.dueDate,
                maxMarks: a.totalMarks,
                submissions: 0,
              });
            }
            if (a.status === 'submitted' || a.status === 'graded') {
              map.get(a.title).submissions += 1;
            }
          });
        });
        setAssignments(Array.from(map.values()));
      }
    } catch (err) {
      console.error('Failed to fetch assignments:', err);
    }
  };

  useEffect(() => {
    if (mentor) {
      fetchAssignments();
    }
  }, [mentor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'week' || name === 'maxMarks' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate) return;

    try {
      const response = await fetch('/api/mentor/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          dueDate: formData.dueDate,
          week: Number(formData.week),
          domain: mentor?.enrolledProgram,
        }),
      });

      if (response.ok) {
        setFormData({ title: '', description: '', week: 1, dueDate: '', maxMarks: 100 });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        fetchAssignments();
      } else {
        alert('Failed to publish assignment.');
      }
    } catch (err) {
      console.error('Error publishing assignment:', err);
    }
  };

  // Edit Handlers
  const handleStartEdit = (assignment) => {
    setEditingAssignment(assignment);
    setEditFormData({
      title: assignment.title,
      description: assignment.description || '',
      week: assignment.week,
      dueDate: assignment.dueDate,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === 'week' ? Number(value) : value,
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editFormData.title || !editFormData.dueDate) return;

    try {
      const response = await fetch('/api/mentor/assignments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalTitle: editingAssignment.title,
          title: editFormData.title,
          description: editFormData.description,
          dueDate: editFormData.dueDate,
          week: Number(editFormData.week),
          domain: mentor?.enrolledProgram,
        }),
      });

      if (response.ok) {
        setEditingAssignment(null);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        fetchAssignments();
      } else {
        alert('Failed to update published assignment.');
      }
    } catch (err) {
      console.error('Error updating assignment:', err);
    }
  };

  const handleDeleteAssignment = async (title) => {
    if (!window.confirm(`Are you sure you want to delete the assignment "${title}" for all students?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/mentor/assignments?title=${encodeURIComponent(title)}&domain=${encodeURIComponent(mentor?.enrolledProgram)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        fetchAssignments();
      } else {
        alert('Failed to delete assignment.');
      }
    } catch (err) {
      console.error('Error deleting assignment:', err);
    }
  };

  return (
    <div className="create-assignments">
      {/* Header */}
      <div className="create-assignments__header animate-fadeInUp">
        <h1 className="create-assignments__title">
          <FilePlus size={28} />
          Create Assignments ({mentor?.enrolledProgram || 'All Programs'})
        </h1>
        <p className="create-assignments__subtitle">
          Release and manage weekly assignments for students enrolled in {mentor?.enrolledProgram || 'your domain'}
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="create-assignments__success animate-fadeInDown">
          <CheckCircle size={18} />
          Assignments successfully saved and updated!
        </div>
      )}

      {/* Creation Form */}
      <div className="card create-assignments__form-card animate-fadeInUp delay-1">
        <h2 className="create-assignments__form-title">
          <Plus size={20} />
          New Assignment
        </h2>
        <form onSubmit={handleSubmit} className="create-assignments__form">
          <div className="form-group">
            <label className="form-label">Assignment Title</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g., Build a React Dashboard"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-input form-textarea"
              placeholder="Describe the assignment objectives and expectations..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="create-assignments__form-row">
            <div className="form-group">
              <label className="form-label">Week Number</label>
              <select
                name="week"
                className="form-input form-select"
                value={formData.week}
                onChange={handleChange}
              >
                {Array.from({ length: 8 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Week {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                name="dueDate"
                className="form-input"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Max Marks</label>
              <input
                type="number"
                name="maxMarks"
                className="form-input"
                placeholder="100"
                min="1"
                value={formData.maxMarks}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn btn--primary btn--lg create-assignments__submit">
            <FilePlus size={18} />
            Create & Publish Assignment
          </button>
        </form>
      </div>

      {/* Existing Assignments Table */}
      <div className="create-assignments__list-section animate-fadeInUp delay-2">
        <h2 className="create-assignments__list-title">
          <ClipboardList size={20} />
          Existing Assignments
          <span className="badge badge--primary">{assignments.length}</span>
        </h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Week</th>
                <th>Due Date</th>
                <th>Max Marks</th>
                <th>Submissions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.title}>
                  <td>
                    <div className="create-assignments__title-cell">
                      <FileText size={16} className="create-assignments__title-icon" />
                      <div>
                        <span className="create-assignments__title-text">{assignment.title}</span>
                        {assignment.description && (
                          <p className="create-assignments__desc-text">{assignment.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge--primary">Week {assignment.week}</span>
                  </td>
                  <td>
                    <span className="create-assignments__date">
                      <Calendar size={13} />
                      {new Date(assignment.dueDate).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </td>
                  <td>
                    <span className="create-assignments__marks">
                      <Award size={13} />
                      {assignment.maxMarks}
                    </span>
                  </td>
                  <td>
                    <span className="create-assignments__submissions">
                      {assignment.submissions} student{assignment.submissions !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => handleStartEdit(assignment)}
                        style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        className="btn btn--ghost btn--sm"
                        onClick={() => handleDeleteAssignment(assignment.title)}
                        style={{ color: 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {assignments.length === 0 && (
                <tr>
                  <td colSpan="6" className="create-assignments__empty" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                    No assignments published for {mentor?.enrolledProgram} yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal Popup */}
      {editingAssignment && (
        <div className="modal-backdrop" onClick={() => setEditingAssignment(null)}>
          <div className="modal modal--lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Edit Published Assignment</h3>
              <button className="modal__close" onClick={() => setEditingAssignment(null)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="form-group">
                <label className="form-label">Assignment Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-input"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-input form-textarea"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  rows={4}
                />
              </div>

              <div className="create-assignments__form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label className="form-label">Week Number</label>
                  <select
                    name="week"
                    className="form-input form-select"
                    value={editFormData.week}
                    onChange={handleEditChange}
                  >
                    {Array.from({ length: 8 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Week {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    name="dueDate"
                    className="form-input"
                    value={editFormData.dueDate}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                <button type="button" className="btn btn--ghost" onClick={() => setEditingAssignment(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAssignments;
