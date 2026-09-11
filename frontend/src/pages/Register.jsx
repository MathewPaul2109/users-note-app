import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register } from '../services/authService';

const Register = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const data = await register(name, email, password);
      loginUser(data);
      navigate('/notes');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const strengthColor = () => {
    if (password.length === 0) return 'transparent';
    if (password.length < 4) return 'var(--error)';
    if (password.length < 7) return 'var(--warning)';
    return 'var(--success)';
  };

  const strengthWidth = () => {
    if (password.length === 0) return '0%';
    if (password.length < 4) return '33%';
    if (password.length < 7) return '66%';
    return '100%';
  };

  return (
    <main className="auth-page">
      <div className="auth-card" role="main">
        <div className="auth-header">
          <div className="auth-icon" aria-hidden="true">✨</div>
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Join NoteVault and start organizing your thoughts</p>
        </div>

        {error && (
          <div className="alert alert-error" role="alert" aria-live="polite">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">Full name</label>
            <input
              id="register-name"
              className="form-input"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">Email address</label>
            <input
              id="register-email"
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">Password</label>
            <input
              id="register-password"
              className="form-input"
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            
            {password.length > 0 && (
              <div style={{ height: '3px', borderRadius: '99px', background: 'var(--border)', overflow: 'hidden', marginTop: '4px' }}>
                <div
                  style={{
                    height: '100%',
                    width: strengthWidth(),
                    background: strengthColor(),
                    borderRadius: '99px',
                    transition: 'width 0.3s ease, background 0.3s ease',
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-confirm-password">Confirm password</label>
            <input
              id="register-confirm-password"
              className="form-input"
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <button
            id="register-submit-btn"
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : null}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" id="go-to-login">Sign in</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
