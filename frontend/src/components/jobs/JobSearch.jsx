import React, { useState } from 'react';
import './JobSearch.css';

const JobSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="job-search">
      <h3>Search Jobs</h3>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by job title, company, or skills..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>
    </div>
  );
};

export default JobSearch;