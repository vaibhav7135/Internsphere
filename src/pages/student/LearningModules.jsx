import { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  PlayCircle,
  Lock,
  BookOpen,
  Clock,
  FileText,
  ExternalLink,
  Layers,
  Inbox,
  Video,
  Link as LinkIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './LearningModules.css';

const typeIcon = (contentType) => {
  const t = (contentType || '').toLowerCase();
  if (t === 'video') return <Video size={14} />;
  if (t === 'document') return <FileText size={14} />;
  return <LinkIcon size={14} />;
};

const LearningModules = () => {
  const { user } = useAuth();
  const [expandedModules, setExpandedModules] = useState([]);
  const [modules, setModules] = useState([]);     // from backend
  const [materials, setMaterials] = useState([]); // mentor-uploaded resources
  const [loading, setLoading] = useState(true);

  // ── Fetch both in parallel ──────────────────────────────
  useEffect(() => {
    if (!user) return;

    const fetchModules = fetch(`/api/students/${user.id}/modules`)
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => []);

    const fetchMaterials = fetch(`/api/students/${user.id}/materials`)
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => []);

    Promise.all([fetchModules, fetchMaterials]).then(([mods, mats]) => {
      setModules(mods);
      setMaterials(mats);
      // Auto-expand the first in-progress week
      if (mods.length > 0) {
        setExpandedModules([mods[0].week]);
      }
      setLoading(false);
    });
  }, [user]);

  // ── Compute status per week from student progress ───────
  const progressPercent = user?.progress || 0;
  const totalWeeks = modules.length || 8;
  const completedWeekCount = Math.floor((progressPercent / 100) * totalWeeks);

  const enrichedModules = modules.map((m, idx) => {
    let status = 'locked';
    if (idx < completedWeekCount) status = 'completed';
    else if (idx === completedWeekCount) status = 'in-progress';

    // Attach materials for this week
    const weekMats = materials.filter((mat) => mat.week === m.week);

    // Topics: split newline-delimited string
    const topicList = m.topics
      ? m.topics.split('\n').map((t) => t.trim()).filter(Boolean)
      : [];

    return { ...m, status, topicList, weekMats };
  });

  const completedCount = enrichedModules.filter((m) => m.status === 'completed').length;

  const toggleModule = (week) => {
    setExpandedModules((prev) =>
      prev.includes(week) ? prev.filter((w) => w !== week) : [...prev, week]
    );
  };

  const getStatusIcon = (status) => {
    if (status === 'completed')  return <CheckCircle2 size={20} />;
    if (status === 'in-progress') return <PlayCircle size={20} />;
    return <Lock size={20} />;
  };

  const getStatusLabel = (status) => {
    if (status === 'completed')  return 'Completed';
    if (status === 'in-progress') return 'In Progress';
    return 'Locked';
  };

  const getStatusBadge = (status) => {
    if (status === 'completed')   return 'badge--success';
    if (status === 'in-progress') return 'badge--warning';
    return 'badge--danger';
  };

  // ── Loading ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="learning-modules" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
        <div className="spinner" />
      </div>
    );
  }

  // ── No modules published yet ─────────────────────────────
  if (modules.length === 0) {
    return (
      <div className="learning-modules">
        <div className="learning-modules__header animate-fadeInUp">
          <div>
            <h1>Learning Modules</h1>
            <p>Your week-by-week learning journey guided by your mentor</p>
          </div>
        </div>
        <div className="learning-modules__empty card animate-fadeInUp delay-1">
          <Inbox size={52} />
          <h3>No Modules Published Yet</h3>
          <p>
            Your mentor hasn't published the learning curriculum yet.
            Once modules are created, they'll appear here with topics, resources, and your weekly progress.
          </p>
        </div>
      </div>
    );
  }

  // ── Main view ────────────────────────────────────────────
  return (
    <div className="learning-modules">
      <div className="learning-modules__header animate-fadeInUp">
        <div>
          <h1>Learning Modules — {user?.enrolledProgram || 'Your Program'}</h1>
          <p>Your week-by-week learning journey guided by your mentor</p>
        </div>
        <div className="learning-modules__progress-info">
          <span className="learning-modules__progress-text">
            {completedCount}/{enrichedModules.length} Completed
          </span>
          <div className="progress-bar" style={{ width: '160px' }}>
            <div
              className="progress-bar__fill"
              style={{ width: `${(completedCount / enrichedModules.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="learning-modules__list">
        {enrichedModules.map((module, index) => {
          const isExpanded = expandedModules.includes(module.week);
          return (
            <div
              key={module.dbId || module.week}
              className={`learning-modules__card animate-fadeInUp delay-${Math.min(index + 1, 5)} ${
                module.status === 'in-progress' ? 'learning-modules__card--active' : ''
              } ${module.status === 'locked' ? 'learning-modules__card--locked' : ''} ${
                module.status === 'completed' ? 'learning-modules__card--completed' : ''
              }`}
            >
              <button
                className="learning-modules__card-header"
                onClick={() => toggleModule(module.week)}
              >
                <div className="learning-modules__card-left">
                  <div className={`learning-modules__status-icon learning-modules__status-icon--${module.status}`}>
                    {getStatusIcon(module.status)}
                  </div>
                  <div className="learning-modules__card-title-area">
                    <h3>Week {module.week}: {module.title}</h3>
                    <div className="learning-modules__card-meta">
                      {module.duration && (
                        <span><Clock size={13} /> {module.duration}</span>
                      )}
                      {module.weekMats.length > 0 && (
                        <span><FileText size={13} /> {module.weekMats.length} Resource{module.weekMats.length !== 1 ? 's' : ''}</span>
                      )}
                      <span className={`badge ${getStatusBadge(module.status)}`}>
                        {getStatusLabel(module.status)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="learning-modules__card-toggle">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {isExpanded && (
                <div className="learning-modules__card-content">
                  {module.description && (
                    <p className="learning-modules__description">{module.description}</p>
                  )}

                  <div className="learning-modules__content-grid">
                    {/* Topics */}
                    {module.topicList.length > 0 && (
                      <div className="learning-modules__topics">
                        <h4><Layers size={16} /> Topics Covered</h4>
                        <ul>
                          {module.topicList.map((topic, i) => (
                            <li key={i}>
                              <CheckCircle2 size={14} />
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Resources */}
                    <div className="learning-modules__resources">
                      <h4><BookOpen size={16} /> Resources</h4>
                      {module.weekMats.length > 0 ? (
                        <ul>
                          {module.weekMats.map((mat) => (
                            <li key={mat.dbId}>
                              <a href={mat.url} target="_blank" rel="noopener noreferrer">
                                {typeIcon(mat.contentType)}
                                <span>{mat.title}</span>
                                <ExternalLink size={12} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                              </a>
                              {mat.description && (
                                <p className="learning-modules__resource-desc">{mat.description}</p>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="learning-modules__no-resources">No resources uploaded yet for this week.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningModules;
