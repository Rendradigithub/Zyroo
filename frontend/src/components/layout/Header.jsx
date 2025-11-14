import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🚀</span>
          <h1>Zyroo</h1>
        </Link>

        <nav className="navigation">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          <Link
            to="/jobs"
            className={`nav-link ${
              location.pathname === '/jobs' ? 'active' : ''
            }`}
          >
            Jobs
          </Link>
          <Link
            to="/forum"
            className={`nav-link ${
              location.pathname === '/forum' ? 'active' : ''
            }`}
          >
            Forum
          </Link>
          <Link
            to="/profile"
            className={`nav-link ${
              location.pathname === '/profile' ? 'active' : ''
            }`}
          >
            Profile
          </Link>
        </nav>

        <div className="auth-buttons">
          <Link to="/login" className="btn-login">
            Login
          </Link>
          <Link to="/register" className="btn-register">
            Register
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
