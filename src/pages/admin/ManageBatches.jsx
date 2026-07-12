import { useState } from 'react';
import {
  Plus,
  X,
  Calendar,
  Users,
  UserCheck,
  BookOpen,
  Clock,
} from 'lucide-react';
import { mockBatches, mockMentors } from '../../data/users';
import './ManageBatches.css';

const ManageBatches = () => {
  const [batches, setBatches] = useState(mockBatches);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    program: 'Web Development',
    startDate: '',
    endDate: '',
    mentor: mockMentors[0]?.name || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const programPrefix = formData.program.split(' ').map(w => w[0]).join('').toUpperCase();
    const batchNum = batches.filter(b => b.program === formData.program).length + 1;
    const year = new Date(formData.startDate).getFullYear();
    const newBatch = {
      id: `${programPrefix}-B${batchNum}-${year}`,
      program: formData.program,
      startDate: formData.startDate,
      endDate: formData.endDate,
      students: 0,
      mentor: formData.mentor,
      status: new Date(formData.startDate) > new Date() ? 'upcoming' : 'active',
    };
    setBatches(prev => [...prev, newBatch]);
    setShowModal(false);
    setFormData({ program: 'Web Development', startDate: '', endDate: '', mentor: mockMentors[0]?.name || '' });
  };

  const getStatusClass = (status) => {
    const map = {
      active: 'badge--success',
      upcoming: 'badge--info',
      completed: 'badge--warning',
    };
    return `badge ${map[status] || 'badge--primary'}`;
  };

  const getStatusColor = (status) => {
    const map = {
      active: 'var(--success)',
      upcoming: 'var(--info)',
      completed: 'var(--gray-500)',
    };
    return map[status] || 'var(--primary)';
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const programOptions = ['Web Development', 'Data Science', 'UI/UX Design', 'Machine Learning', 'App Development', 'Digital Marketing', 'Cybersecurity', 'Cloud Computing'];

  return (
    <div className="manage-batches">
      <div className="manage-batches__header animate-fadeInUp">
        <div>
          <h1 className="manage-batches__title">Manage Batches</h1>
          <p className="manage-batches__subtitle">Create and track internship batch schedules</p>
        </div>
        <button className="btn btn--primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Create Batch
        </button>
      </div>

      <div className="manage-batches__summary animate-fadeInUp delay-1">
        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--blue"><BookOpen size={22} /></div>
          <div className="stats-card__info">
            <h3>{batches.length}</h3>
            <p>Total Batches</p>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--green"><Users size={22} /></div>
          <div className="stats-card__info">
            <h3>{batches.filter(b => b.status === 'active').length}</h3>
            <p>Active Batches</p>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--yellow"><Users size={22} /></div>
          <div className="stats-card__info">
            <h3>{batches.reduce((sum, b) => sum + b.students, 0)}</h3>
            <p>Total Students</p>
          </div>
        </div>
      </div>

      <div className="manage-batches__grid animate-fadeInUp delay-2">
        {batches.map((batch) => (
          <div className="manage-batches__card card" key={batch.id}>
            <div className="manage-batches__card-top">
              <div
                className="manage-batches__card-indicator"
                style={{ background: getStatusColor(batch.status) }}
              />
              <span className={getStatusClass(batch.status)}>
                {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
              </span>
            </div>

            <div className="manage-batches__card-body">
              <code className="manage-batches__batch-id">{batch.id}</code>
              <h3 className="manage-batches__program-name">{batch.program}</h3>

              <div className="manage-batches__details">
                <div className="manage-batches__detail-item">
                  <Calendar size={15} />
                  <div>
                    <span className="manage-batches__detail-label">Start Date</span>
                    <span className="manage-batches__detail-value">{formatDate(batch.startDate)}</span>
                  </div>
                </div>
                <div className="manage-batches__detail-item">
                  <Clock size={15} />
                  <div>
                    <span className="manage-batches__detail-label">End Date</span>
                    <span className="manage-batches__detail-value">{formatDate(batch.endDate)}</span>
                  </div>
                </div>
                <div className="manage-batches__detail-item">
                  <Users size={15} />
                  <div>
                    <span className="manage-batches__detail-label">Students</span>
                    <span className="manage-batches__detail-value">{batch.students}</span>
                  </div>
                </div>
                <div className="manage-batches__detail-item">
                  <UserCheck size={15} />
                  <div>
                    <span className="manage-batches__detail-label">Mentor</span>
                    <span className="manage-batches__detail-value">{batch.mentor}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Create New Batch</h3>
              <button className="modal__close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Program</label>
                <select
                  className="form-input form-select"
                  value={formData.program}
                  onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                >
                  {programOptions.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="manage-batches__form-row">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date" className="form-input"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input
                    type="date" className="form-input"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Mentor</label>
                <select
                  className="form-input form-select"
                  value={formData.mentor}
                  onChange={(e) => setFormData({ ...formData, mentor: e.target.value })}
                >
                  {mockMentors.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
              </div>
              <div className="manage-batches__modal-actions">
                <button type="button" className="btn btn--ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn--primary">Create Batch</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBatches;
