import React, { useState, useEffect } from 'react';
import './JobFilter.css';

const JobFilter = ({ filters, onFilterChange }) => {
  const [activeFilters, setActiveFilters] = useState({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const locations = ['Jakarta, Indonesia', 'Bandung, Indonesia', 'Surabaya, Indonesia', 'Bali, Indonesia', 'Remote', 'Hybrid'];
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    // Check which filters are active for visual feedback
    const active = {};
    if (filters.location) active.location = true;
    if (filters.type) active.type = true;
    if (filters.experience) active.experience = true;
    setActiveFilters(active);
  }, [filters, isInitialLoad]);

  const handleFilter = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      search: '',
      location: '',
      type: '',
      experience: ''
    });
    setActiveFilters({});
  };

  const getFilterIcon = (filterType) => {
    switch (filterType) {
      case 'location': return '📍';
      case 'type': return '💼';
      case 'experience': return '🎯';
      default: return '⚡';
    }
  };

  return (
    <div className="job-filter">
      <h3>
        <span style={{filter: 'grayscale(1)'}}>🎛️</span>
        Filter Jobs
      </h3>
      
      <div className={`filter-group ${activeFilters.location ? 'active' : ''}`}>
        <label>
          {getFilterIcon('location')}
          Location
        </label>
        <select 
          value={filters.location} 
          onChange={(e) => handleFilter('location', e.target.value)}
        >
          <option value="">🌍 All Locations</option>
          {locations.map(location => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      <div className={`filter-group ${activeFilters.type ? 'active' : ''}`}>
        <label>
          {getFilterIcon('type')}
          Job Type
        </label>
        <select 
          value={filters.type} 
          onChange={(e) => handleFilter('type', e.target.value)}
        >
          <option value="">📊 All Types</option>
          {jobTypes.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className={`filter-group ${activeFilters.experience ? 'active' : ''}`}>
        <label>
          {getFilterIcon('experience')}
          Experience Level
        </label>
        <select 
          value={filters.experience} 
          onChange={(e) => handleFilter('experience', e.target.value)}
        >
          <option value="">🚀 All Levels</option>
          {experienceLevels.map(level => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      <button 
        className="btn-clear-filters"
        onClick={handleClearFilters}
      >
        🗑️ Clear All Filters
      </button>

      {/* Active filters counter */}
      {(activeFilters.location || activeFilters.type || activeFilters.experience) && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          background: '#fef2f2',
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#dc2626',
          fontWeight: '600',
          border: '1px solid #fecaca',
          animation: 'slideInUp 0.5s ease-out'
        }}>
          🔥 {Object.keys(activeFilters).length} filter(s) active
        </div>
      )}
    </div>
  );
};

export default JobFilter;