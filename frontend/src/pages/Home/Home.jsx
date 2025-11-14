import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Launch Your Career Journey</h1>
          <p>
            Connect with opportunities, learn from the community, and showcase
            your potential to top employers.
          </p>
          <div className="cta-buttons">
            <Link to="/jobs" className="btn-primary">
              Explore Jobs
            </Link>
            <Link to="/register" className="btn-secondary">
              Join Community
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="features-container">
          <h2>Why Choose Zyroo?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">💼</span>
              <h3>Curated Job Listings</h3>
              <p>
                Discover opportunities specifically for fresh graduates and
                early-career professionals.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">👥</span>
              <h3>Supportive Community</h3>
              <p>
                Learn from peers, get career advice, and share experiences in
                our dedicated forums.
              </p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📊</span>
              <h3>Portfolio Showcase</h3>
              <p>
                Highlight your projects and achievements to stand out to
                potential employers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
