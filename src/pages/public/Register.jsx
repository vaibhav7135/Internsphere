import { Link } from 'react-router';
import { GraduationCap, ArrowRight, ShieldAlert } from 'lucide-react';
import './Register.css';

const Register = () => {
  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card card card--flat animate-scaleIn text-center" style={{ padding: 'var(--space-10) var(--space-8)' }}>
          {/* Logo */}
          <div className="register-header">
            <Link to="/" className="register-logo">
              <div className="register-logo-icon" style={{ margin: '0 auto' }}>
                <GraduationCap size={28} />
              </div>
              <span style={{ display: 'block', marginTop: 'var(--space-2)' }}>InternSphere</span>
            </Link>
          </div>

          <div style={{ margin: 'var(--space-6) 0' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '50%',
              backgroundColor: 'var(--warning-bg)', color: 'var(--warning)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto var(--space-4)'
            }}>
              <ShieldAlert size={32} />
            </div>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: '800', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
              Registration Restricted
            </h2>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              InternSphere student accounts are managed and created exclusively by the administration.
              You cannot register an account directly on this website.
            </p>
          </div>

          <div style={{
            backgroundColor: 'var(--gray-50)', border: '1px solid var(--gray-200)',
            borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)',
            fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)',
            textAlign: 'left', lineHeight: '1.5', marginBottom: 'var(--space-6)'
          }}>
            <p><strong>Next Steps:</strong></p>
            <ol style={{ listStyleType: 'decimal', paddingLeft: 'var(--space-4)', marginTop: '4px' }}>
              <li>Contact your college program coordinator or administrator.</li>
              <li>Wait for your welcome email containing login credentials.</li>
              <li>Sign in using the preconfigured login credentials.</li>
            </ol>
          </div>

          <Link to="/login" className="btn btn--primary btn--full" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}>
            Go to Sign In <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
