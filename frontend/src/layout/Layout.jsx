import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Layout.css';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUsername = localStorage.getItem('username');
    setIsAuthenticated(!!token);
    setUsername(storedUsername || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="logo">
            <span className="logo-icon">⌨️</span>
            SkillType
          </Link>

          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>

          <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <li>
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/leaderboard" className={location.pathname === '/leaderboard' ? 'active' : ''}>
                Leaderboard
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/test" className={location.pathname === '/test' ? 'active' : ''}>
                    Start Test
                  </Link>
                </li>
                <li>
                  <Link to="/results" className={location.pathname === '/results' ? 'active' : ''}>
                    Results
                  </Link>
                </li>
                <li className="nav-user">
                  <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
                    {username}
                  </Link>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="register-btn">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; 2024 SkillType. Test your typing speed with our unique time penalty feature!</p>
      </footer>
    </div>
  );
}

export default Layout;
