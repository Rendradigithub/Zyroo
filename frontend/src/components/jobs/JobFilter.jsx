import React from 'react';
import './JobFilter.css';

const JobFilter = ({ filters, onFilterChange }) => {
  const locations = ['Jakarta', 'Bandung', 'Surabaya', 'Remote', 'Bali'];
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level'];

  const handleFilter = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="job-filter">
      <h3>Filters</h3>
      
      <div className="filter-group">
        <label>Location</label>
        <select 
          value={filters.location} 
          onChange={(e) => handleFilter('location', e.target.value)}
        >
          <option value="">All Locations</option>
          {locations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Job Type</label>
        <select 
          value={filters.type} 
          onChange={(e) => handleFilter('type', e.target.value)}
        >
          <option value="">All Types</option>
          {jobTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Experience Level</label>
        <select 
          value={filters.experience} 
          onChange={(e) => handleFilter('experience', e.target.value)}
        >
          <option value="">All Levels</option>
          {experienceLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      <button 
        className="btn-clear-filters"
        onClick={() => onFilterChange({
          search: '',
          location: '',
          type: '',
          experience: ''
        })}
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default JobFilter;