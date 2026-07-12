import { User, Mail, Phone, GraduationCap, Calendar, BookOpen, Award, MapPin, BadgeCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="profile-info-row">
    <div className="profile-info-icon">
      <Icon size={16} />
    </div>
    <div className="profile-info-content">
      <span className="profile-info-label">{label}</span>
      <span className="profile-info-value">{value || '—'}</span>
    </div>
  </div>
);

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <div className="profile-page__header animate-fadeInUp">
        <h1>My Profile</h1>
        <p>Your account information as registered with InternSphere.</p>
      </div>

      <div className="profile-page__grid">
        {/* Left — Personal & Academic Info */}
        <div className="profile-page__main">

          {/* Avatar Card */}
          <div className="card profile-card-form profile-hero-card animate-fadeInUp delay-1">
            <div className="profile-avatar-row">
              <div className="profile-large-avatar">{user?.avatar || user?.name?.[0]?.toUpperCase() || 'S'}</div>
              <div className="profile-avatar-text">
                <h2>{user?.name || 'Student'}</h2>
                <span className="badge badge--primary">{user?.role?.toUpperCase() || 'STUDENT'}</span>
                {user?.enrolledProgram && (
                  <p className="profile-program-tag">
                    <BookOpen size={13} /> {user.enrolledProgram}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="card profile-card-form animate-fadeInUp delay-2">
            <h3>Personal Information</h3>
            <p className="form-subtitle">Contact details associated with your account</p>

            <div className="profile-info-list">
              <InfoRow icon={User}  label="Full Name"     value={user?.name} />
              <InfoRow icon={Mail}  label="Email Address" value={user?.email} />
              <InfoRow icon={Phone} label="Phone Number"  value={user?.phone} />
              <InfoRow icon={MapPin} label="Location"     value={user?.location || 'India'} />
            </div>
          </div>

          {/* Academic Information */}
          <div className="card profile-card-form animate-fadeInUp delay-3">
            <h3>Academic Profile</h3>
            <p className="form-subtitle">Your college and program details</p>

            <div className="profile-info-list">
              <InfoRow icon={GraduationCap} label="College / University" value={user?.college} />
              <InfoRow icon={Calendar}      label="Current Year"         value={user?.year} />
              <InfoRow icon={BookOpen}      label="Enrolled Program"     value={user?.enrolledProgram} />
              <InfoRow icon={Award}         label="Batch"                value={user?.batch || 'July 2026'} />
            </div>
          </div>
        </div>

        {/* Right — Status & Notice */}
        <div className="profile-page__sidebar">

          {/* Enrollment Status */}
          <div className="card profile-card-form animate-fadeInUp delay-2">
            <h3>Enrollment Status</h3>
            <p className="form-subtitle">Your internship program details</p>

            <div className="profile-status-chip">
              <BadgeCheck size={20} />
              <span>Active Intern</span>
            </div>

            <div className="profile-info-list" style={{ marginTop: '16px' }}>
              <InfoRow icon={BookOpen}  label="Program"      value={user?.enrolledProgram || 'Web Development'} />
              <InfoRow icon={Calendar}  label="Start Date"   value={user?.startDate || 'July 12, 2026'} />
              <InfoRow icon={Award}     label="Mentor"       value={user?.mentorName || 'Assigned by Admin'} />
            </div>
          </div>

          {/* Read-only notice */}
          <div className="card profile-card-form profile-readonly-notice animate-fadeInUp delay-3">
            <div className="profile-readonly-icon">
              <BadgeCheck size={32} />
            </div>
            <h4>Profile is Read-Only</h4>
            <p>
              Your profile information is managed by the InternSphere admin team. 
              If you need to update any details, please contact your program coordinator or admin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
