import { useState, useEffect } from 'react';
import { Plus, X, Users, BookOpen, Trash2, Edit3, Clipboard, HelpCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './ManageTeams.css';

const ManageTeams = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [editingTeam, setEditingTeam] = useState(null);

  // Form Fields
  const [teamName, setTeamName] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  const fetchTeamsAndStudents = async () => {
    try {
      // 1. Fetch all users from database to get assigned students
      const usersRes = await fetch('/api/users');
      let studentList = [];
      if (usersRes.ok) {
        const allUsers = await usersRes.json();
        // Mentor should see students matching their program domain
        studentList = allUsers.filter(
          (u) => u.role === 'student' && u.enrolledProgram === user?.enrolledProgram
        );
        setStudents(studentList);
      }

      // 2. Fetch teams created by this mentor
      const teamsRes = await fetch(`/api/teams/mentor/${user?.id || 'mentor-1'}`);
      if (teamsRes.ok) {
        const teamsData = await teamsRes.json();
        
        // Enhance teams data with actual student profiles
        const populatedTeams = teamsData.map(t => {
          const members = (t.studentIds || []).map(sid => 
            studentList.find(s => s.id === sid)
          ).filter(Boolean);
          
          return {
            ...t,
            members
          };
        });

        setTeams(populatedTeams);
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to load teams or students:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamsAndStudents();
  }, [user]);

  const handleOpenCreateModal = () => {
    setEditingTeam(null);
    setTeamName('');
    setTeamDesc('');
    setSelectedStudentIds([]);
    setErrorMsg('');
    setShowModal(true);
  };

  const handleOpenEditModal = (team) => {
    setEditingTeam(team);
    setTeamName(team.name);
    setTeamDesc(team.description || '');
    setSelectedStudentIds(team.studentIds || []);
    setErrorMsg('');
    setShowModal(true);
  };

  const handleToggleStudent = (sid) => {
    setSelectedStudentIds(prev => 
      prev.includes(sid) ? prev.filter(id => id !== sid) : [...prev, sid]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!teamName.trim()) {
      setErrorMsg('Team name is required');
      return;
    }

    const payload = {
      dbId: editingTeam ? editingTeam.dbId : null,
      name: teamName,
      description: teamDesc,
      mentorId: user?.id || 'mentor-1',
      studentIds: selectedStudentIds
    };

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowModal(false);
        fetchTeamsAndStudents();
      } else {
        const txt = await res.text();
        setErrorMsg(txt || 'Failed to save team.');
      }
    } catch (err) {
      setErrorMsg('Connection failed. Database offline.');
    }
  };

  const handleDelete = async (dbId) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    try {
      const res = await fetch(`/api/teams/${dbId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchTeamsAndStudents();
      } else {
        alert('Failed to delete team.');
      }
    } catch (err) {
      console.error('Error deleting team:', err);
    }
  };

  if (loading) {
    return (
      <div className="manage-teams" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '350px' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="manage-teams animate-fadeInUp">
      <div className="manage-teams__header">
        <div>
          <h1>Manage Teams</h1>
          <p>Organize students into collaborative groups. Students can be assigned to multiple teams.</p>
        </div>
        <button className="btn btn--primary" onClick={handleOpenCreateModal}>
          <Plus size={18} /> Create Team
        </button>
      </div>

      <div className="manage-teams__domain-bar card card--glass">
        <BookOpen size={16} />
        <span>Currently managing teams for: <strong>{user?.enrolledProgram || 'Web Development'}</strong> domain</span>
      </div>

      <div className="manage-teams__grid">
        {teams.map((team) => (
          <div className="team-card card animate-scaleIn" key={team.dbId}>
            <div className="team-card__header">
              <div>
                <h3 className="team-card__title">{team.name}</h3>
                <p className="team-card__desc">{team.description || 'No description provided.'}</p>
              </div>
              <div className="team-card__actions">
                <button className="team-card__action-btn" onClick={() => handleOpenEditModal(team)} title="Edit Team">
                  <Edit3 size={15} />
                </button>
                <button className="team-card__action-btn team-card__action-btn--delete" onClick={() => handleDelete(team.dbId)} title="Delete Team">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div className="team-card__members-section">
              <div className="team-card__members-title">
                <Users size={14} />
                <span>Team Members ({team.members.length})</span>
              </div>
              
              <div className="team-card__members-list">
                {team.members.map((member) => (
                  <div className="team-card__member-row" key={member.id}>
                    <div className="team-card__member-avatar">
                      {member.avatar || member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="team-card__member-details">
                      <span className="team-card__member-name">{member.name}</span>
                      <span className="team-card__member-college">{member.college}</span>
                    </div>
                    <div className="team-card__member-progress" title={`Progress: ${member.progress}%`}>
                      <span className="badge badge--sm">{member.progress}%</span>
                    </div>
                  </div>
                ))}
                {team.members.length === 0 && (
                  <p className="team-card__empty-members">No student members assigned yet.</p>
                )}
              </div>
            </div>
          </div>
        ))}

        {teams.length === 0 && (
          <div className="manage-teams__empty card">
            <Clipboard size={48} className="manage-teams__empty-icon" />
            <h3>No Teams Created</h3>
            <p>Get started by creating your first project team and assigning members.</p>
            <button className="btn btn--secondary" onClick={handleOpenCreateModal}>
              Create Team Now
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal modal--lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">{editingTeam ? 'Edit Team Details' : 'Create New Team'}</h3>
              <button className="modal__close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            {errorMsg && (
              <div className="error-alert" style={{ color: 'var(--danger)', backgroundColor: 'var(--danger-bg)', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '13px' }}>
                {errorMsg}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Team Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Web Team Alpha"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea
                  className="form-input form-textarea"
                  placeholder="Describe the team's project focus or objective"
                  value={teamDesc}
                  onChange={(e) => setTeamDesc(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Assign Students 
                  <span className="form-label-helper" style={{ marginLeft: '6px', fontWeight: 'normal', color: 'var(--text-secondary)', fontSize: '12px' }}>
                    (Students can belong to multiple teams)
                  </span>
                </label>

                <div className="modal-student-selector">
                  {students.map((student) => {
                    const isSelected = selectedStudentIds.includes(student.id);
                    return (
                      <div 
                        className={`student-select-item ${isSelected ? 'student-select-item--selected' : ''}`}
                        key={student.id}
                        onClick={() => handleToggleStudent(student.id)}
                      >
                        <div className="student-select-item__checkbox">
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => {}} // Handled by outer click
                          />
                        </div>
                        <div className="student-select-item__avatar">
                          {student.avatar || student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="student-select-item__info">
                          <strong>{student.name}</strong>
                          <span>{student.college}</span>
                        </div>
                      </div>
                    );
                  })}
                  {students.length === 0 && (
                    <p className="no-students-placeholder">No students currently enrolled in your program domain.</p>
                  )}
                </div>
              </div>

              <div className="manage-teams__modal-actions">
                <button type="button" className="btn btn--ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn--primary">
                  {editingTeam ? 'Save Changes' : 'Create Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTeams;
