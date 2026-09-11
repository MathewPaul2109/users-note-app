import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const getInitials = (name = '') =>
    name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        <Link to="/notes" className="navbar-logo" id="navbar-logo">
          <div className="navbar-logo-icon" aria-hidden="true">📝</div>
          <span className="navbar-logo-text">NoteVault</span>
        </Link>

        {user && (
          <div className="navbar-right">
            <div className="navbar-user">
              <div className="navbar-avatar" aria-hidden="true">
                {getInitials(user.name)}
              </div>
              <span className="navbar-username">{user.name}</span>
            </div>
            <button
              id="logout-btn"
              className="btn btn-secondary btn-sm"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
