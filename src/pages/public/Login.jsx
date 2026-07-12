import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { GraduationCap, LogIn, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'student') {
        navigate('/student/dashboard');
      } else if (user.role === 'mentor') {
        navigate('/mentor/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        // Redirect to appropriate dashboard based on role
        if (result.user.role === 'student') {
          navigate('/student/dashboard');
        } else if (result.user.role === 'mentor') {
          navigate('/mentor/dashboard');
        } else if (result.user.role === 'admin') {
          navigate('/admin/dashboard');
        }
      } else {
        setError(result.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card card card--flat animate-scaleIn">
          {/* Logo */}
          <div className="login-header">
            <Link to="/" className="login-logo">
              <div className="login-logo-icon">
                <GraduationCap size={28} />
              </div>
              <span>InternSphere</span>
            </Link>
            <h2>Welcome Back</h2>
            <p>Please enter your details to sign in</p>
          </div>

          {/* Role Tabs */}
          <div className="login-tabs">
            <button
              className={`login-tab ${role === 'student' ? 'login-tab--active' : ''}`}
              onClick={() => handleRoleChange('student')}
              type="button"
            >
              Student
            </button>
            <button
              className={`login-tab ${role === 'mentor' ? 'login-tab--active' : ''}`}
              onClick={() => handleRoleChange('mentor')}
              type="button"
            >
              Mentor
            </button>
            <button
              className={`login-tab ${role === 'admin' ? 'login-tab--active' : ''}`}
              onClick={() => handleRoleChange('admin')}
              type="button"
            >
              Admin
            </button>
          </div>

          {error && (
            <div className="login-error animate-fadeInDown">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <div className="login-input-wrapper">
                <Mail size={18} className="login-input-icon" />
                <input
                  type="email"
                  id="email"
                  className="form-input login-input-with-icon"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="login-input-wrapper">
                <Lock size={18} className="login-input-icon" />
                <input
                  type="password"
                  id="password"
                  className="form-input login-input-with-icon"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="login-actions">
              <label className="login-remember">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="login-forgot">Forgot Password?</a>
            </div>

            <button type="submit" className="btn btn--primary btn--full login-submit" disabled={loading}>
              {loading ? (
                <div className="spinner spinner--sm" style={{ width: '20px', height: '20px', borderWidth: '2px' }} />
              ) : (
                <>
                  Sign In <LogIn size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
