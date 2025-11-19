import React, { useState, useEffect } from 'react';
import './JobCard.css';

const JobCard = ({ job }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleApply = async () => {
    setIsApplying(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsApplying(false);
    // Here you would typically handle the actual application logic
    console.log(`Applied to ${job.title} at ${job.company}`);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // Here you would typically save to localStorage or send to backend
    console.log(`${isSaved ? 'Unsaved' : 'Saved'} ${job.title}`);
  };

  const getTimeAgo = (posted) => {
    // This would be more sophisticated in a real app
    return posted;
  };

  const cardClass = `
    job-card 
    ${job.featured ? 'featured' : ''} 
    ${job.urgent ? 'urgent' : ''}
    ${isVisible ? 'visible' : ''}
  `.trim();

  return (
    <div className={cardClass}>
      {/* Badges */}
      <div className="job-badges">
        {job.featured && <span className="badge featured">⭐ Featured</span>}
        {job.urgent && <span className="badge urgent">🚀 Urgent</span>}
        {job.posted.includes('hour') && <span className="badge new">🆕 New</span>}
      </div>

      {/* Header */}
      <div className="job-header">
        <div className="company-logo">
          <span>{job.logo}</span>
        </div>
        <div className="job-info">
          <h3 className="job-title">{job.title}</h3>
          <p className="company-name">{job.company}</p>
          <div className="job-meta">
            <span className="location">📍 {job.location}</span>
            <span className="type">🕒 {job.type}</span>
            <span className="experience">🎯 {job.experience}</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="job-details">
        <p className="salary">💰 {job.salary}</p>
        <p className="posted">📅 {getTimeAgo(job.posted)}</p>
      </div>

      {/* Description */}
      <p className="job-description">
        {isExpanded ? job.description : `${job.description.substring(0, 120)}...`}
        <button 
          className="read-more" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '👆 Read Less' : '👇 Read More'}
        </button>
      </p>

      {/* Requirements */}
      <div className="job-requirements">
        <strong>🚀 Key Requirements:</strong>
        <div className="tags">
          {job.requirements.map((req, index) => (
            <span 
              key={index} 
              className="tag"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {req}
            </span>
          ))}
        </div>
      </div>

      {/* Additional Tags */}
      {job.tags && job.tags.length > 0 && (
        <div className="job-tags">
          {job.tags.map((tag, index) => (
            <span key={index} className="job-tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="job-actions">
        <button 
          className="btn-apply" 
          onClick={handleApply}
          disabled={isApplying}
        >
          {isApplying ? (
            <>
              <span className="loading-dots">⚡</span>
              Applying...
            </>
          ) : (
            <>
              🚀 Apply Now
            </>
          )}
        </button>
        <button 
          className="btn-save" 
          onClick={handleSave}
        >
          {isSaved ? '❤️ Saved' : '💾 Save'}
        </button>
      </div>

      {/* Application Success Message */}
      {isApplying && (
        <div className="application-status">
          <div className="status-message">
            ⭐ Preparing your application...
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;