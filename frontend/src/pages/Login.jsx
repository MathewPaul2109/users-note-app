import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/authService';

const Login = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const data = await login(email, password);
      loginUser(data);
      navigate('/notes');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">

        
        <div className="auth-header">
          <div className="auth-icon">
            🔐
          </div>

          <h1 className="auth-title">
            Welcome back
          </h1>

          <p className="auth-subtitle">
            Sign in to your NoteVault account
          </p>
        </div>

        
        {error && (
          <div className="alert alert-error">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>

            {error}
          </div>
        )}

        
        <form
          className="auth-form"
          onSubmit={handleSubmit}
          noValidate
        >

          
          <div className="form-group">
            <label
              className="form-label"
              htmlFor="login-email"
            >
              Email address
            </label>

            <input
              id="login-email"
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label
              className="form-label"
              htmlFor="login-password"
            >
              Password
            </label>

            <div className="password-wrapper">

              <input
                id="login-password"
                className="form-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                id="toggle-password-visibility"
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>

            </div>
          </div>

          {/* Submit button */}
          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading && <span className="spinner" />}

            {loading
              ? 'Signing in...'
              : 'Sign In'}
          </button>

        </form>

        {/* Register link */}
        <p className="auth-footer">
          Don't have an account?{' '}

          <Link
            to="/register"
            id="go-to-register"
          >
            Create one
          </Link>
        </p>

      </div>
    </main>
  );
};

export default Login;