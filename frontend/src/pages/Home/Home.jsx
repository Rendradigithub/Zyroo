import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setAnimated(true);
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className={animated ? 'animated' : ''}>
            Launch Your Career Journey
          </h1>
          <p>
            Connect with opportunities, learn from the community, and showcase
            your potential to top employers worldwide.
          </p>
          <div className="cta-buttons">
            <Link to="/jobs" className="btn-primary">
              🚀 Explore Jobs
            </Link>
            <Link to="/register" className="btn-secondary">
              👥 Join Community
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Job Opportunities</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">10K+</span>
            <span className="stat-label">Active Members</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">95%</span>
            <span className="stat-label">Success Rate</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Partner Companies</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h2>Why Choose Zyroo?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">💼</span>
              <h3>Curated Job Listings</h3>
              <p>
                Discover hand-picked opportunities specifically for fresh graduates 
                and early-career professionals from top companies.
              </p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">👥</span>
              <h3>Supportive Community</h3>
              <p>
                Learn from industry experts, get career advice, and share experiences 
                in our dedicated forums and mentorship programs.
              </p>
            </div>
            
            <div className="feature-card">
              <span className="feature-icon">📊</span>
              <h3>Portfolio Showcase</h3>
              <p>
                Highlight your projects, achievements, and skills with our modern 
                portfolio builder that stands out to employers.
              </p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">🎯</span>
              <h3>Career Guidance</h3>
              <p>
                Get personalized career path recommendations and skill development 
                plans tailored to your goals and aspirations.
              </p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">⚡</span>
              <h3>Fast Application</h3>
              <p>
                Apply to multiple jobs with one click using your Zyroo profile. 
                Save time and increase your chances of getting hired.
              </p>
            </div>

            <div className="feature-card">
              <span className="feature-icon">🔒</span>
              <h3>Privacy First</h3>
              <p>
                Full control over your data and visibility. Choose what employers 
                can see and manage your privacy settings easily.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;