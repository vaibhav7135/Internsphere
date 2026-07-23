import { useState, useEffect } from 'react';
import { Plus, X, Calendar, Users, UserCheck, Layers, Trash2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './ManageBatchesMentor.css';

const ManageBatchesMentor = () => {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  
  // Assign modal state
  const [domainStudents, setDomainStudents] = useState([]);
  const [assignedStudentIds, setAssignedStudentIds] = useState(new Set());
  
  // Create modal state
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
  });

  const fetchBatches = async () => {
    try {
      const response = await fetch(`/api/batches/mentor/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setBatches(data);
      }
    } catch (err) {
      console.error('Failed to fetch batches:', err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchBatches();
    }
  }, [user]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: user.enrolledProgram,
          mentorId: user.id,
          startDate: formData.startDate,
          endDate: formData.endDate,
        }),
      });
      if (response.ok) {
        setShowCreateModal(false);
        setFormData({ startDate: '', endDate: '' });
        fetchBatches();
      } else {
        alert('Failed to create batch');
      }
    } catch (err) {
      console.error('Error creating batch:', err);
    }
  };

  const handleDelete = async (batchCode) => {
    if (!window.confirm(`Are you sure you want to delete batch ${batchCode}?`)) return;
    try {
      const response = await fetch(`/api/batches/${batchCode}`, { method: 'DELETE' });
      if (response.ok) {
        fetchBatches();
      } else {
        alert('Failed to delete batch');
      }
    } catch (err) {
      console.error('Error deleting batch:', err);
    }
  };

  const openAssignModal = async (batch) => {
    setSelectedBatch(batch);
    try {
      // Fetch domain students
      const usersRes = await fetch('/api/users');
      let students = [];
      if (usersRes.ok) {
        const allUsers = await usersRes.json();
        students = allUsers.filter(u => u.role === 'student' && u.enrolledProgram === user.enrolledProgram);
        setDomainStudents(students);
      }

      // Fetch currently assigned students for this batch
      const batchStudentsRes = await fetch(`/api/batches/${batch.batchCode}/students`);
      if (batchStudentsRes.ok) {
        const batchStudents = await batchStudentsRes.json();
        const assignedIds = new Set(batchStudents.map(s => s.id));
        setAssignedStudentIds(assignedIds);
      }
      
      setShowAssignModal(true);
    } catch (err) {
      console.error('Error preparing assign modal:', err);
    }
  };

  const toggleStudentSelection = (studentId) => {
    const newSelected = new Set(assignedStudentIds);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setAssignedStudentIds(newSelected);
  };

  const handleAssignSubmit = async () => {
    if (!selectedBatch) return;
    try {
      const response = await fetch(`/api/batches/${selectedBatch.batchCode}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentIds: Array.from(assignedStudentIds),
        }),
      });
      
      if (response.ok) {
        setShowAssignModal(false);
        fetchBatches();
      } else {
        alert('Failed to assign students');
      }
    } catch (err) {
      console.error('Error assigning students:', err);
    }
  };

  const getStatusClass = (status) => {
    const map = {
      active: 'badge--success',
      upcoming: 'badge--info',
      completed: 'badge--warning',
    };
    return `badge ${map[status] || 'badge--primary'}`;
  };

  const totalBatches = batches.length;
  const activeBatches = batches.filter(b => b.status === 'active').length;
  const totalStudents = batches.reduce((sum, b) => sum + (b.studentCount || 0), 0);

  return (
    <div className="manage-batches-mentor">
      <div className="manage-batches-mentor__header animate-fadeInUp">
        <div>
          <h1 className="manage-batches-mentor__title">
            <Layers size={28} />
            Manage Batches
          </h1>
          <p className="manage-batches-mentor__subtitle">
            Create batches and assign your students for {user?.enrolledProgram}
          </p>
        </div>
        <button className="btn btn--primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={18} /> Create New Batch
        </button>
      </div>

      <div className="manage-batches-mentor__stats animate-fadeInUp delay-1">
        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--blue"><Layers size={22} /></div>
          <div className="stats-card__info">
            <h3>{totalBatches}</h3>
            <p>Total Batches</p>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--green"><CheckCircle2 size={22} /></div>
          <div className="stats-card__info">
            <h3>{activeBatches}</h3>
            <p>Active Batches</p>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--yellow"><Users size={22} /></div>
          <div className="stats-card__info">
            <h3>{totalStudents}</h3>
            <p>Total Students Assigned</p>
          </div>
        </div>
      </div>

      <div className="manage-batches-mentor__grid animate-fadeInUp delay-2">
        {batches.map((batch) => (
          <div className="card manage-batches-mentor__card" key={batch.batchCode}>
            <div className="manage-batches-mentor__card-header">
              <h3>{batch.batchCode}</h3>
              <span className={getStatusClass(batch.status)}>
                {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
              </span>
            </div>
            
            <p className="manage-batches-mentor__domain">{batch.domain}</p>
            
            <div className="manage-batches-mentor__details">
              <div className="manage-batches-mentor__detail">
                <Calendar size={16} />
                <span>
                  {new Date(batch.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} 
                  {' - '} 
                  {new Date(batch.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="manage-batches-mentor__detail">
                <Users size={16} />
                <span>{batch.studentCount || 0} Students Assigned</span>
              </div>
            </div>

            <div className="manage-batches-mentor__actions">
              <button className="btn btn--secondary btn--sm" onClick={() => openAssignModal(batch)}>
                <UserCheck size={16} /> Assign Students
              </button>
              <button className="btn btn--ghost btn--sm btn--danger-text" onClick={() => handleDelete(batch.batchCode)}>
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
        {batches.length === 0 && (
          <div className="manage-batches-mentor__empty card">
            <p>No batches found. Create your first batch to get started.</p>
          </div>
        )}
      </div>

      {/* Create Batch Modal */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Create New Batch</h3>
              <button className="modal__close" onClick={() => setShowCreateModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <div className="form-group">
                <label className="form-label">Domain</label>
                <input type="text" className="form-input" value={user?.enrolledProgram} disabled />
              </div>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={formData.startDate}
                  onChange={e => setFormData({...formData, startDate: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={formData.endDate}
                  onChange={e => setFormData({...formData, endDate: e.target.value})}
                  required 
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn btn--ghost" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn btn--primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Students Modal */}
      {showAssignModal && (
        <div className="modal-backdrop" onClick={() => setShowAssignModal(false)}>
          <div className="modal modal--lg" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Assign Students to {selectedBatch?.batchCode}</h3>
              <button className="modal__close" onClick={() => setShowAssignModal(false)}><X size={20} /></button>
            </div>
            <div className="manage-batches-mentor__students-list">
              {domainStudents.length > 0 ? (
                domainStudents.map(student => (
                  <div key={student.id} className="manage-batches-mentor__student-row">
                    <input 
                      type="checkbox" 
                      id={`student-${student.id}`}
                      checked={assignedStudentIds.has(student.id)}
                      onChange={() => toggleStudentSelection(student.id)}
                    />
                    <label htmlFor={`student-${student.id}`}>
                      {student.name} ({student.email})
                    </label>
                  </div>
                ))
              ) : (
                <p>No students found in your domain.</p>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
              <button type="button" className="btn btn--ghost" onClick={() => setShowAssignModal(false)}>Cancel</button>
              <button type="button" className="btn btn--primary" onClick={handleAssignSubmit}>Save Assignments</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBatchesMentor;
