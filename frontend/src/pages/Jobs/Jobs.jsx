import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchJobsStart,
  fetchJobsSuccess,
  fetchJobsFailure,
} from '../../store/slices/jobsSlice';
import JobCard from '../../components/jobs/JobCard';
import JobFilter from '../../components/jobs/JobFilter';
import JobSearch from '../../components/jobs/JobSearch';
import './Jobs.css';

const Jobs = () => {
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.jobs);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    experience: '',
  });

  // Mock data
  const mockJobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'Tech Startup Indonesia',
      location: 'Jakarta',
      type: 'Full-time',
      experience: 'Entry Level',
      salary: 'Rp 8-12 Juta',
      posted: '2 hours ago',
      description:
        'We are looking for a passionate Frontend Developer to join our team. You will be responsible for building modern web applications using React and related technologies.',
      requirements: ['React', 'JavaScript', 'HTML/CSS'],
      logo: '🚀',
    },
    {
      id: 2,
      title: 'Backend Developer',
      company: 'FinTech Solutions',
      location: 'Bandung',
      type: 'Full-time',
      experience: 'Mid Level',
      salary: 'Rp 12-18 Juta',
      posted: '1 day ago',
      description:
        'Join our backend team to build scalable financial systems. Experience with microservices architecture and cloud platforms is a plus.',
      requirements: ['Node.js', 'Python', 'PostgreSQL'],
      logo: '💳',
    },
  ];

  useEffect(() => {
    dispatch(fetchJobsStart());
    setTimeout(() => {
      dispatch(fetchJobsSuccess(mockJobs));
    }, 1000);
  }, [dispatch]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredJobs = jobs.filter((job) => {
    return (
      job.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.location === '' || job.location === filters.location) &&
      (filters.type === '' || job.type === filters.type) &&
      (filters.experience === '' || job.experience === filters.experience)
    );
  });

  if (loading) {
    return (
      <div className="jobs-container">
        <div className="loading">Loading job opportunities...</div>
      </div>
    );
  }

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <h1>Find Your Dream Job</h1>
        <p>Discover opportunities that match your skills and aspirations</p>
      </div>

      <div className="jobs-content">
        <div className="filters-sidebar">
          <JobSearch
            onSearch={(search) => handleFilterChange({ ...filters, search })}
          />
          <JobFilter filters={filters} onFilterChange={handleFilterChange} />
        </div>

        <div className="jobs-list">
          <div className="jobs-stats">
            <p>Found {filteredJobs.length} jobs</p>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="no-jobs">
              <h3>No jobs found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="jobs-grid">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
