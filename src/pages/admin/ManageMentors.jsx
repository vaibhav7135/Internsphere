import { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  X,
  Star,
  Users,
  BookOpen,
  Award,
} from 'lucide-react';
import './ManageMentors.css';

const ManageMentors = () => {
  const [mentors, setMentors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', expertise: 'Web Development', experience: '5 years',
  });

  const fetchMentors = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const allUsers = await response.json();
        const mentorsList = allUsers.filter(u => u.role === 'mentor');
        const studentsList = allUsers.filter(u => u.role === 'student');

        const mapped = mentorsList.map(m => {
          const studentCount = studentsList.filter(s => s.enrolledProgram === m.enrolledProgram).length;
          return {
            id: m.id,
            dbId: m.dbId,
            name: m.name,
            email: m.email,
            expertise: m.enrolledProgram || 'Web Development',
            experience: m.college || '5 years', // experience is stored in college field
            assignedStudents: studentCount,
            programs: [m.enrolledProgram || 'Web Development'],
            rating: 4.8,
            status: m.status || 'active'
          };
        });
        setMentors(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch mentors:', err);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await fetch('/api/users/mentor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          expertise: formData.expertise,
          experience: formData.experience
        })
      });

      if (response.ok) {
        setShowModal(false);
        setFormData({ name: '', email: '', expertise: 'Web Development', experience: '5 years' });
        fetchMentors();
      } else {
        const text = await response.text();
        setErrorMsg(text || 'Failed to register mentor account.');
      }
    } catch (err) {
      setErrorMsg('Server offline. Failed to connect to database.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this mentor account?')) {
      try {
        const response = await fetch(`/api/users/student/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchMentors();
        } else {
          alert('Failed to remove mentor account.');
        }
      } catch (err) {
        console.error('Error removing mentor:', err);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setErrorMsg('');
    setFormData({ name: '', email: '', expertise: 'Web Development', experience: '5 years' });
  };

  const getInitials = (name) => {
    if (!name) return 'ME';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const colorPalette = ['#2563EB', '#7C3AED', '#EC4899', '#10B981', '#F59E0B', '#EF4444'];

  const totalAssignedStudents = mentors.reduce((sum, m) => sum + m.assignedStudents, 0);
  const avgRating = mentors.length > 0
    ? (mentors.reduce((sum, m) => sum + m.rating, 0) / mentors.length).toFixed(1)
    : '5.0';

  return (
    <div className="manage-mentors">
      <div className="manage-mentors__header animate-fadeInUp">
        <div>
          <h1 className="manage-mentors__title">Manage Mentors (Database Connection)</h1>
          <p className="manage-mentors__subtitle">Register mentor profiles and allocate learning paths dynamically in MySQL</p>
        </div>
        <button className="btn btn--primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Mentor Account
        </button>
      </div>

      <div className="manage-mentors__stats animate-fadeInUp delay-1">
        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--blue">
            <Users size={22} />
          </div>
          <div className="stats-card__info">
            <h3>{mentors.length}</h3>
            <p>Total Mentors</p>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--green">
            <Users size={22} />
          </div>
          <div className="stats-card__info">
            <h3>{totalAssignedStudents}</h3>
            <p>Total Students Assigned</p>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-card__icon stats-card__icon--yellow">
            <Star size={22} />
          </div>
          <div className="stats-card__info">
            <h3>{avgRating}</h3>
            <p>Average Rating</p>
          </div>
        </div>
      </div>

      <div className="manage-mentors__grid animate-fadeInUp delay-2">
        {mentors.map((mentor, index) => (
          <div className="manage-mentors__card card" key={mentor.id}>
            <div className="manage-mentors__card-header">
              <div
                className="manage-mentors__avatar"
                style={{ background: colorPalette[index % colorPalette.length] }}
              >
                {getInitials(mentor.name)}
              </div>
              <div className="manage-mentors__card-actions">
                <button className="btn btn--ghost btn--sm manage-mentors__delete-btn" onClick={() => handleDelete(mentor.id)} title="Remove">
                  <Trash2 size={14} /> Remove
                </button>
              </div>
            </div>

            <h3 className="manage-mentors__name">{mentor.name}</h3>
            <p className="manage-mentors__expertise">{mentor.expertise}</p>

            <div className="manage-mentors__meta">
              <div className="manage-mentors__meta-item">
                <Award size={14} />
                <span>{mentor.experience} experience</span>
              </div>
              <div className="manage-mentors__meta-item">
                <Users size={14} />
                <span>{mentor.assignedStudents} Students Assigned</span>
              </div>
              <div className="manage-mentors__meta-item">
                <BookOpen size={14} />
                <span>{mentor.programs.join(', ')}</span>
              </div>
            </div>

            <div className="manage-mentors__card-footer">
              <div className="manage-mentors__rating">
                <Star size={14} fill="#F59E0B" color="#F59E0B" />
                <span>{mentor.rating}</span>
              </div>
              <span className={`badge ${mentor.status === 'active' ? 'badge--success' : 'badge--warning'}`}>
                {mentor.status.charAt(0).toUpperCase() + mentor.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
        {mentors.length === 0 && (
          <div className="manage-mentors__empty" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            No mentor profiles registered in database.
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">Add New Mentor</h3>
              <button className="modal__close" onClick={closeModal}><X size={20} /></button>
            </div>
            {errorMsg && (
              <div className="error-alert" style={{ color: 'var(--danger)', backgroundColor: 'var(--danger-bg)', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '13px' }}>
                {errorMsg}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Dr. Ramesh Kumar"
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
                  placeholder="e.g. ramesh@demo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Expertise Program Domain</label>
                <select
                  className="form-input form-select"
                  value={formData.expertise}
                  onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                >
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Java Full Stack">Java Full Stack</option>
                  <option value="Python Development">Python Development</option>
                  <option value="Web Development">Web Development</option>
                  <option value="React.js">React.js</option>
                  <option value="Spring Boot">Spring Boot</option>
                  <option value="DevOps">DevOps</option>
                  <option value="AWS Cloud">AWS Cloud</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Years of Experience</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 8 years"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  required
                />
              </div>
              <div className="manage-mentors__modal-actions">
                <button type="button" className="btn btn--ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn--primary">Register Mentor</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMentors;
