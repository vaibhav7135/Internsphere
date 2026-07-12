import { useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  X,
  Star,
  Users,
  Clock,
  IndianRupee,
  ToggleLeft,
  ToggleRight,
  BookOpen,
} from 'lucide-react';
import { internships } from '../../data/internships';
import './ManagePrograms.css';

const ManagePrograms = () => {
  const [programs, setPrograms] = useState(
    internships.map(p => ({ ...p, status: 'active' }))
  );
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    level: 'Beginner',
    price: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProgram) {
      setPrograms(prev => prev.map(p =>
        p.id === editingProgram.id
          ? { ...p, ...formData, price: Number(formData.price) }
          : p
      ));
    } else {
      const newProgram = {
        id: `program-${Date.now()}`,
        ...formData,
        price: Number(formData.price),
        enrolled: 0,
        rating: 0,
        reviews: 0,
        status: 'active',
      };
      setPrograms(prev => [...prev, newProgram]);
    }
    closeModal();
  };

  const handleEdit = (program) => {
    setEditingProgram(program);
    setFormData({
      title: program.title,
      duration: program.duration,
      level: program.level,
      price: program.price,
      description: program.description || '',
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setPrograms(prev => prev.filter(p => p.id !== id));
  };

  const toggleStatus = (id) => {
    setPrograms(prev => prev.map(p =>
      p.id === id
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
        : p
    ));
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProgram(null);
    setFormData({ title: '', duration: '', level: 'Beginner', price: '', description: '' });
  };

  return (
    <div className="manage-programs">
      <div className="manage-programs__header animate-fadeInUp">
        <div>
          <h1 className="manage-programs__title">Manage Programs</h1>
          <p className="manage-programs__subtitle">Create, edit, and manage internship programs</p>
        </div>
        <button className="btn btn--primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Program
        </button>
      </div>

      <div className="manage-programs__summary animate-fadeInUp delay-1">
        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--blue"><BookOpen size={22} /></div>
          <div className="stats-card__info">
            <h3>{programs.length}</h3>
            <p>Total Programs</p>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--green"><Users size={22} /></div>
          <div className="stats-card__info">
            <h3>{programs.reduce((sum, p) => sum + (p.enrolled || 0), 0).toLocaleString()}</h3>
            <p>Total Enrolled</p>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--yellow"><Star size={22} /></div>
          <div className="stats-card__info">
            <h3>{(programs.filter(p => p.rating > 0).reduce((sum, p) => sum + p.rating, 0) / programs.filter(p => p.rating > 0).length).toFixed(1)}</h3>
            <p>Average Rating</p>
          </div>
        </div>
      </div>

      <div className="table-container animate-fadeInUp delay-2">
        <table className="table">
          <thead>
            <tr>
              <th>Program Name</th>
              <th>Duration</th>
              <th>Level</th>
              <th>Price</th>
              <th>Enrolled</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((program) => (
              <tr key={program.id}>
                <td>
                  <div className="manage-programs__name-cell">
                    <div
                      className="manage-programs__color-dot"
                      style={{ background: program.color || 'var(--primary)' }}
                    />
                    <span className="manage-programs__name">{program.title}</span>
                  </div>
                </td>
                <td>
                  <div className="manage-programs__duration">
                    <Clock size={14} />
                    <span>{program.duration}</span>
                  </div>
                </td>
                <td><span className="badge badge--primary">{program.level}</span></td>
                <td>
                  <span className="manage-programs__price">
                    <IndianRupee size={14} />{program.price?.toLocaleString('en-IN')}
                  </span>
                </td>
                <td>
                  <span className="manage-programs__enrolled">
                    <Users size={14} /> {program.enrolled?.toLocaleString() || 0}
                  </span>
                </td>
                <td>
                  <div className="manage-programs__rating">
                    <Star size={14} fill={program.rating > 0 ? '#F59E0B' : 'none'} color="#F59E0B" />
                    <span>{program.rating || '—'}</span>
                  </div>
                </td>
                <td>
                  <button
                    className="manage-programs__toggle"
                    onClick={() => toggleStatus(program.id)}
                    title={`Toggle ${program.status}`}
                  >
                    {program.status === 'active' ? (
                      <ToggleRight size={28} className="manage-programs__toggle--active" />
                    ) : (
                      <ToggleLeft size={28} className="manage-programs__toggle--inactive" />
                    )}
                    <span className={`badge ${program.status === 'active' ? 'badge--success' : 'badge--danger'}`}>
                      {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                    </span>
                  </button>
                </td>
                <td>
                  <div className="manage-programs__actions">
                    <button className="btn btn--ghost btn--sm" onClick={() => handleEdit(program)} title="Edit">
                      <Edit3 size={14} />
                    </button>
                    <button className="btn btn--ghost btn--sm manage-programs__delete-btn" onClick={() => handleDelete(program.id)} title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">{editingProgram ? 'Edit Program' : 'Add New Program'}</h3>
              <button className="modal__close" onClick={closeModal}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Program Name</label>
                <input
                  type="text" className="form-input" placeholder="Enter program name"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="manage-programs__form-row">
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    type="text" className="form-input" placeholder="e.g., 8 Weeks"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Level</label>
                  <select
                    className="form-input form-select" value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Beginner to Intermediate</option>
                    <option>Intermediate to Advanced</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input
                  type="number" className="form-input" placeholder="Enter price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input form-textarea" placeholder="Enter program description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="manage-programs__modal-actions">
                <button type="button" className="btn btn--ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn--primary">
                  {editingProgram ? 'Save Changes' : 'Add Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePrograms;
