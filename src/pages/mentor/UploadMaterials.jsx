import { useState, useEffect } from 'react';
import {
  Upload,
  FileText,
  Video,
  Link as LinkIcon,
  Plus,
  Trash2,
  CloudUpload,
  BookOpen,
  Calendar,
  CheckCircle,
  Layers,
  Edit3,
  Save,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './UploadMaterials.css';

const weekOptions = Array.from({ length: 8 }, (_, i) => ({
  value: i + 1,
  label: `Week ${i + 1}`,
}));

const contentTypes = [
  { value: 'video', label: 'Video', icon: Video },
  { value: 'document', label: 'Document', icon: FileText },
  { value: 'link', label: 'Link', icon: LinkIcon },
];

const typeConfig = {
  video:    { className: 'badge--danger',  icon: Video,    label: 'Video' },
  document: { className: 'badge--primary', icon: FileText, label: 'Document' },
  link:     { className: 'badge--info',    icon: LinkIcon, label: 'Link' },
  Video:    { className: 'badge--danger',  icon: Video,    label: 'Video' },
  Document: { className: 'badge--primary', icon: FileText, label: 'Document' },
  Link:     { className: 'badge--info',    icon: LinkIcon, label: 'Link' },
};

const UploadMaterials = () => {
  const { user: mentor } = useAuth();

  // ── Materials state ──────────────────────────────────────────────
  const [materials, setMaterials] = useState([]);
  const [matForm, setMatForm] = useState({ week: 1, title: '', description: '', type: 'video', url: '' });
  const [matSuccess, setMatSuccess] = useState(false);

  // ── Module state ─────────────────────────────────────────────────
  const [modules, setModules] = useState([]);
  const [editingModule, setEditingModule] = useState(null); // { week, title, description, topics, duration }
  const [moduleSuccess, setModuleSuccess] = useState('');

  // ── Fetch ────────────────────────────────────────────────────────
  const fetchMaterials = async () => {
    try {
      const res = await fetch('/api/mentor/materials');
      if (res.ok) {
        const all = await res.json();
        setMaterials(all.filter((m) => m.domain === mentor?.enrolledProgram));
      }
    } catch (e) { console.error(e); }
  };

  const fetchModules = async () => {
    if (!mentor?.enrolledProgram) return;
    try {
      const res = await fetch(`/api/mentor/modules?domain=${encodeURIComponent(mentor.enrolledProgram)}`);
      if (res.ok) setModules(await res.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (mentor) {
      fetchMaterials();
      fetchModules();
    }
  }, [mentor]);

  // ── Upload material ──────────────────────────────────────────────
  const handleMatSubmit = async (e) => {
    e.preventDefault();
    if (!matForm.title || !matForm.url) return;
    try {
      const res = await fetch('/api/mentor/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: matForm.title,
          week: Number(matForm.week),
          contentType: matForm.type,
          url: matForm.url,
          description: matForm.description,
          domain: mentor?.enrolledProgram,
        }),
      });
      if (res.ok) {
        setMatForm({ week: 1, title: '', description: '', type: 'video', url: '' });
        setMatSuccess(true);
        setTimeout(() => setMatSuccess(false), 3000);
        fetchMaterials();
      } else {
        alert('Failed to upload material.');
      }
    } catch (e) { console.error(e); }
  };

  const handleDeleteMaterial = async (id) => {
    if (!window.confirm('Delete this material?')) return;
    try {
      await fetch(`/api/mentor/materials/${id}`, { method: 'DELETE' });
      fetchMaterials();
    } catch (e) { console.error(e); }
  };

  // ── Save module ──────────────────────────────────────────────────
  const handleSaveModule = async (e) => {
    e.preventDefault();
    if (!editingModule?.title) return;
    try {
      const res = await fetch('/api/mentor/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingModule,
          domain: mentor?.enrolledProgram,
        }),
      });
      if (res.ok) {
        setModuleSuccess(`Week ${editingModule.week} module saved!`);
        setTimeout(() => setModuleSuccess(''), 3000);
        setEditingModule(null);
        fetchModules();
      } else {
        alert('Failed to save module.');
      }
    } catch (e) { console.error(e); }
  };

  const handleDeleteModule = async (id) => {
    if (!window.confirm('Delete this module?')) return;
    try {
      await fetch(`/api/mentor/modules/${id}`, { method: 'DELETE' });
      fetchModules();
    } catch (e) { console.error(e); }
  };

  const openNewModule = () => {
    const usedWeeks = new Set(modules.map((m) => m.week));
    let nextWeek = 1;
    while (usedWeeks.has(nextWeek) && nextWeek <= 8) nextWeek++;
    setEditingModule({ week: nextWeek, title: '', description: '', topics: '', duration: '' });
  };

  return (
    <div className="upload-materials">

      {/* ── Header ── */}
      <div className="upload-materials__header animate-fadeInUp">
        <h1 className="upload-materials__title">
          <CloudUpload size={28} />
          Manage Learning Content ({mentor?.enrolledProgram || 'All Programs'})
        </h1>
        <p className="upload-materials__subtitle">
          Define weekly modules and upload resources for students in {mentor?.enrolledProgram || 'your domain'}
        </p>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 1 — Weekly Module Definitions
      ══════════════════════════════════════════════════ */}
      <div className="card upload-materials__form-card animate-fadeInUp delay-1">
        <div className="upload-section-title-row">
          <h2><Layers size={20} /> Weekly Module Curriculum</h2>
          <button className="btn btn--primary btn--sm" onClick={openNewModule}>
            <Plus size={16} /> Add Module
          </button>
        </div>
        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
          Define each week's title, description, and topics. Students see this on their Learning Modules page.
        </p>

        {moduleSuccess && (
          <div className="upload-materials__success animate-fadeInDown" style={{ marginBottom: 'var(--space-4)' }}>
            <CheckCircle size={16} /> {moduleSuccess}
          </div>
        )}

        {/* Edit form */}
        {editingModule && (
          <form onSubmit={handleSaveModule} className="module-edit-form card card--flat animate-fadeInDown">
            <div className="module-edit-header">
              <h4>Week {editingModule.week} — {editingModule.title || 'New Module'}</h4>
              <button type="button" className="btn-icon" onClick={() => setEditingModule(null)}><X size={18} /></button>
            </div>
            <div className="upload-materials__form-grid">
              <div className="form-group">
                <label className="form-label">Week Number</label>
                <select
                  className="form-input form-select"
                  value={editingModule.week}
                  onChange={(e) => setEditingModule({ ...editingModule, week: Number(e.target.value) })}
                >
                  {weekOptions.map((w) => (
                    <option key={w.value} value={w.value}>{w.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Duration</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 4 hours"
                  value={editingModule.duration || ''}
                  onChange={(e) => setEditingModule({ ...editingModule, duration: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Module Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Introduction to React"
                required
                value={editingModule.title}
                onChange={(e) => setEditingModule({ ...editingModule, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-input form-textarea"
                placeholder="What will students learn this week?"
                value={editingModule.description || ''}
                onChange={(e) => setEditingModule({ ...editingModule, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Topics (one per line)</label>
              <textarea
                className="form-input form-textarea form-textarea--sm"
                placeholder={"JSX Syntax & Component Structure\nProps and State Management\nEvent Handling in React\nuseEffect Hook"}
                value={editingModule.topics || ''}
                onChange={(e) => setEditingModule({ ...editingModule, topics: e.target.value })}
              />
            </div>
            <div className="module-edit-footer">
              <button type="button" className="btn btn--ghost" onClick={() => setEditingModule(null)}>Cancel</button>
              <button type="submit" className="btn btn--primary"><Save size={16} /> Save Module</button>
            </div>
          </form>
        )}

        {/* Modules list */}
        <div className="module-list">
          {modules.length === 0 && !editingModule && (
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '12px 0' }}>
              No modules defined yet. Click "Add Module" to start building the curriculum.
            </p>
          )}
          {modules.map((mod) => (
            <div key={mod.dbId} className="module-list-item">
              <div className="module-list-item-left">
                <span className="module-week-tag">Week {mod.week}</span>
                <div>
                  <strong>{mod.title}</strong>
                  {mod.duration && <span className="module-duration"> · {mod.duration}</span>}
                  {mod.topics && (
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {mod.topics.split('\n').filter(Boolean).length} topics
                    </p>
                  )}
                </div>
              </div>
              <div className="module-list-item-actions">
                <button
                  className="btn btn--ghost btn--sm"
                  onClick={() => setEditingModule({ ...mod })}
                >
                  <Edit3 size={14} /> Edit
                </button>
                <button
                  className="btn btn--ghost btn--sm btn--danger-ghost"
                  onClick={() => handleDeleteModule(mod.dbId)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          SECTION 2 — Upload Resources
      ══════════════════════════════════════════════════ */}
      {matSuccess && (
        <div className="upload-materials__success animate-fadeInDown">
          <CheckCircle size={18} /> Resource uploaded successfully!
        </div>
      )}

      <div className="card upload-materials__form-card animate-fadeInUp delay-2">
        <h2 className="upload-materials__form-title"><Plus size={20} /> Upload Resource</h2>
        <form onSubmit={handleMatSubmit} className="upload-materials__form">
          <div className="upload-materials__form-grid">
            <div className="form-group">
              <label className="form-label">Week</label>
              <select
                name="week"
                className="form-input form-select"
                value={matForm.week}
                onChange={(e) => setMatForm({ ...matForm, week: e.target.value })}
              >
                {weekOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Content Type</label>
              <div className="upload-materials__type-selector">
                {contentTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      className={`upload-materials__type-btn ${matForm.type === type.value ? 'upload-materials__type-btn--active' : ''}`}
                      onClick={() => setMatForm({ ...matForm, type: type.value })}
                    >
                      <Icon size={16} /> {type.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Introduction to React Hooks"
              value={matForm.title}
              onChange={(e) => setMatForm({ ...matForm, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              {matForm.type === 'link' ? 'URL' : matForm.type === 'video' ? 'Video URL' : 'Document URL'}
            </label>
            <input
              type="url"
              className="form-input"
              placeholder="https://..."
              value={matForm.url}
              onChange={(e) => setMatForm({ ...matForm, url: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description / Notes (optional)</label>
            <textarea
              className="form-input form-textarea form-textarea--sm"
              placeholder="Brief description of what this resource covers..."
              value={matForm.description}
              onChange={(e) => setMatForm({ ...matForm, description: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn--primary btn--lg upload-materials__submit">
            <Upload size={18} /> Upload Resource
          </button>
        </form>
      </div>

      {/* Uploaded list */}
      <div className="upload-materials__list-section animate-fadeInUp delay-3">
        <h2 className="upload-materials__list-title">
          <BookOpen size={20} /> Uploaded Resources
          <span className="badge badge--primary">{materials.length}</span>
        </h2>
        <div className="upload-materials__list">
          {materials.map((material) => {
            const config = typeConfig[material.contentType] || typeConfig.link;
            const TypeIcon = config.icon;
            return (
              <div key={material.dbId} className="card upload-materials__item">
                <div className="upload-materials__item-left">
                  <div className="upload-materials__item-week">Week {material.week}</div>
                  <div className="upload-materials__item-info">
                    <h3 className="upload-materials__item-title">{material.title}</h3>
                    {material.description && (
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{material.description}</p>
                    )}
                    <div className="upload-materials__item-meta">
                      <span className={`badge ${config.className}`}>
                        <TypeIcon size={12} /> {config.label}
                      </span>
                      <span className="upload-materials__item-date">
                        <Calendar size={12} />
                        {material.uploadDate ? new Date(material.uploadDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn--ghost btn--sm btn--danger-ghost"
                  onClick={() => handleDeleteMaterial(material.dbId)}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
          {materials.length === 0 && (
            <div className="upload-materials__empty" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
              No resources uploaded for {mentor?.enrolledProgram} yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadMaterials;
