import React, { useState } from 'react';
import './JobCard.css';

const JobCard = ({ job }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="job-card">
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

      <div className="job-details">
        <p className="salary">💰 {job.salary}</p>
        <p className="posted">📅 {job.posted}</p>
      </div>

      <p className="job-description">
        {isExpanded ? job.description : `${job.description.substring(0, 100)}...`}
        <button 
          className="read-more" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      </p>

      <div className="job-requirements">
        <strong>Requirements:</strong>
        <div className="tags">
          {job.requirements.map((req, index) => (
            <span key={index} className="tag">{req}</span>
          ))}
        </div>
      </div>

      <div className="job-actions">
        <button className="btn-apply">Apply Now</button>
        <button className="btn-save">Save</button>
      </div>
    </div>
  );
};

export default JobCard;