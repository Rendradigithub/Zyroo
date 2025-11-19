import React, { useState, useEffect, useRef } from 'react';
import './JobSearch.css';

const JobSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  const popularSearches = [
    { term: 'Frontend Developer', icon: '⚛️' },
    { term: 'Backend Engineer', icon: '🔧' },
    { term: 'UI/UX Designer', icon: '🎨' },
    { term: 'Data Scientist', icon: '🤖' },
    { term: 'Product Manager', icon: '📊' },
    { term: 'DevOps Engineer', icon: '⚙️' },
    { term: 'React Developer', icon: '🚀' },
    { term: 'Remote Jobs', icon: '🏠' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Simulate loading state for better UX
    setIsLoading(true);
    
    setTimeout(() => {
      onSearch(value);
      setIsLoading(false);
    }, 300);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.term);
    onSearch(suggestion.term);
    setShowSuggestions(false);
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onSearch('');
    setShowSuggestions(false);
  };

  const filteredSuggestions = popularSearches.filter(suggestion =>
    suggestion.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="job-search" ref={searchRef}>
      <h3>
        <span style={{filter: 'grayscale(1)'}}>🔍</span>
        Search Jobs
      </h3>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by job title, company, or skills..."
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setShowSuggestions(true)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
        
        {searchTerm && (
          <button 
            className="clear-search"
            onClick={handleClearSearch}
            title="Clear search"
          >
            ×
          </button>
        )}
        
        {isLoading && <div className="search-loading"></div>}

        {showSuggestions && searchTerm && filteredSuggestions.length > 0 && (
          <div className="search-suggestions">
            {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
              <div
                key={suggestion.term}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'slideInUp 0.3s ease-out both'
                }}
              >
                <span className="suggestion-icon">{suggestion.icon}</span>
                {suggestion.term}
              </div>
            ))}
          </div>
        )}

        {showSuggestions && !searchTerm && (
          <div className="search-suggestions">
            <div style={{ 
              padding: '1rem 1.5rem', 
              color: '#666', 
              fontSize: '0.9rem',
              borderBottom: '1px solid #f3f4f6'
            }}>
              🔥 Popular Searches
            </div>
            {popularSearches.slice(0, 6).map((suggestion, index) => (
              <div
                key={suggestion.term}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animation: 'slideInUp 0.3s ease-out both'
                }}
              >
                <span className="suggestion-icon">{suggestion.icon}</span>
                {suggestion.term}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearch;