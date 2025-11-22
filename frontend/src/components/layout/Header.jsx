import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Efek header saat scroll (lebih profesional)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/jobs', label: 'Jobs' },
    { path: '/forum', label: 'Forum' },
  ];

  if (isAuthenticated) {
    navLinks.push({ path: '/profile', label: 'Profile' });
    if (user?.role === 'admin') {
      navLinks.push({ path: '/admin', label: 'Admin' });
    }
  }

  const userInitial = (user?.name || 'U').charAt(0).toUpperCase();

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-gradient-bar" />

      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          <span className="logo-mark">Z</span>
          <span className="logo-text">YROO<span className="logo-dot"></span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${
                location.pathname === link.path ? 'active' : ''
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Section - Desktop */}
        <div className="auth-section">
          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-pill">
                <div className="user-avatar">{userInitial}</div>
                <div className="user-info-text">
                  <span className="user-label">Masuk sebagai</span>
                  <span className="user-name">{user?.name || 'User'}</span>
                </div>
              </div>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">
                Login
              </Link>
              <Link to="/register" className="btn-register">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="nav-mobile">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${
                location.pathname === link.path ? 'active' : ''
              }`}
              onClick={closeMobileMenu}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="mobile-auth">
              <div className="mobile-user-pill">
                <div className="mobile-user-avatar">{userInitial}</div>
                <div className="mobile-user-text">
                  <span className="mobile-user-label">Masuk sebagai</span>
                  <span className="mobile-user-name">{user?.name || 'User'}</span>
                </div>
              </div>
              <button className="btn-logout-mobile" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="mobile-auth-buttons">
              <Link
                to="/login"
                className="btn-login-mobile"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-register-mobile"
                onClick={closeMobileMenu}
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;
