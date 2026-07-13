import { useState, useEffect } from 'react';
import { Users, Mail, GraduationCap, Award, Compass, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './TeamMembers.css';

const TeamMembers = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [teammates, setTeammates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' or 'teams'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      try {
        // 1. Fetch student's teams
        const teamsRes = await fetch(`/api/teams/student/${user.id}`);
        let teamsList = [];
        if (teamsRes.ok) {
          teamsList = await teamsRes.json();
          setTeams(teamsList);
        }

        // 2. Fetch student's teammate profiles
        const teammatesRes = await fetch(`/api/teams/student/${user.id}/teammates`);
        if (teammatesRes.ok) {
          const teammatesList = await teammatesRes.json();
          setTeammates(teammatesList);
        }

        setLoading(false);
      } catch (err) {
        console.error('Failed to load teammate data:', err);
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const filteredTeammates = teammates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.enrolledProgram.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProgressClass = (progress) => {
    if (progress >= 80) return 'progress-bar__fill--success';
    if (progress >= 50) return '';
    return 'progress-bar__fill--warning';
  };

  if (loading) {
    return (
      <div className="team-members" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '350px' }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="team-members animate-fadeInUp">
      <div className="team-members__header">
        <h1>Team Collaboration</h1>
        <p>View your collaborative teams and connect with your fellow internship teammates.</p>
      </div>

      {/* Tabs */}
      <div className="team-members__tabs">
        <button 
          className={`tab-btn ${activeTab === 'directory' ? 'tab-btn--active' : ''}`}
          onClick={() => setActiveTab('directory')}
        >
          <Users size={16} /> Teammates Directory ({teammates.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'teams' ? 'tab-btn--active' : ''}`}
          onClick={() => setActiveTab('teams')}
        >
          <Compass size={16} /> My Teams ({teams.length})
        </button>
      </div>

      {activeTab === 'directory' ? (
        <div className="team-members__directory">
          <div className="directory-search card card--glass">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by name, college, or domain program..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="teammates-grid">
            {filteredTeammates.map((teammate) => (
              <div className="teammate-card card animate-scaleIn" key={teammate.id}>
                <div className="teammate-card__top">
                  <div className="teammate-card__avatar">
                    {teammate.avatar || teammate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="teammate-card__meta">
                    <h3 className="teammate-card__name">{teammate.name}</h3>
                    <span className="badge badge--primary teammate-card__domain">{teammate.enrolledProgram}</span>
                  </div>
                </div>

                <div className="teammate-card__details">
                  <div className="detail-item">
                    <GraduationCap size={14} />
                    <span>{teammate.college}</span>
                  </div>
                  <div className="detail-item">
                    <Mail size={14} />
                    <a href={`mailto:${teammate.email}`} className="email-link">{teammate.email}</a>
                  </div>
                </div>

                <div className="teammate-card__progress">
                  <div className="progress-header">
                    <span>Internship Progress</span>
                    <strong>{teammate.progress}%</strong>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-bar__fill ${getProgressClass(teammate.progress)}`} 
                      style={{ width: `${teammate.progress}%` }} 
                    />
                  </div>
                </div>

                <div className="teammate-card__actions">
                  <a href={`mailto:${teammate.email}`} className="btn btn--primary btn--sm btn--full">
                    <Mail size={14} /> Send Message
                  </a>
                </div>
              </div>
            ))}

            {filteredTeammates.length === 0 && (
              <div className="empty-state card">
                <Users size={48} className="empty-icon" />
                <h3>No Teammates Found</h3>
                <p>{teammates.length === 0 ? "You haven't been assigned to any teams yet." : "No teammates match your search criteria."}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="team-members__teams-view">
          <div className="teams-list-grid">
            {teams.map((team) => (
              <div className="student-team-card card animate-scaleIn" key={team.dbId}>
                <div className="student-team-card__header">
                  <h3>{team.name}</h3>
                  <p>{team.description || "Project collaborative group."}</p>
                </div>
                <div className="student-team-card__members">
                  <h4>Team Members Assigned:</h4>
                  <div className="members-avatars-list">
                    {team.studentIds.map(sid => {
                      // Check if teammate exists, or if it is the current student
                      const isMe = sid === user.id;
                      const memberInfo = isMe ? user : teammates.find(t => t.id === sid);
                      if (!memberInfo) return null;
                      return (
                        <div className="member-avatar-chip" key={sid}>
                          <div className="member-avatar-chip__avatar">
                            {memberInfo.avatar || memberInfo.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="member-avatar-chip__name">
                            {memberInfo.name} {isMe && "(You)"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}

            {teams.length === 0 && (
              <div className="empty-state card">
                <Compass size={48} className="empty-icon" />
                <h3>No Active Teams</h3>
                <p>You are not currently assigned to any collaborative project teams.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
