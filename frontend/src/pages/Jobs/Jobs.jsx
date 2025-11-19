import React, { useState, useEffect, useRef } from 'react';
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
  const [refreshing, setRefreshing] = useState(false);
  const jobsGridRef = useRef(null);

  // Enhanced mock data with more variety
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
      description: 'We are looking for a passionate Frontend Developer to join our team. You will be responsible for building modern web applications using React and related technologies.',
      requirements: ['React', 'JavaScript', 'HTML/CSS', 'TypeScript'],
      logo: '🚀',
      featured: true,
      urgent: true
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
      description: 'Join our backend team to build scalable financial systems. Experience with microservices architecture and cloud platforms is a plus.',
      requirements: ['Node.js', 'Python', 'PostgreSQL', 'Docker'],
      logo: '💳',
      featured: false,
      urgent: false
    },
    {
      id: 3,
      title: 'UI/UX Designer',
      company: 'Creative Studio',
      location: 'Jakarta',
      type: 'Full-time',
      experience: 'Mid Level',
      salary: 'Rp 10-15 Juta',
      posted: '3 days ago',
      description: 'Create beautiful and intuitive user experiences for our digital products. Work closely with developers to bring designs to life.',
      requirements: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
      logo: '🎨',
      featured: true,
      urgent: false
    },
    {
      id: 4,
      title: 'Data Scientist',
      company: 'AI Research Lab',
      location: 'Remote',
      type: 'Contract',
      experience: 'Senior Level',
      salary: 'Rp 20-25 Juta',
      posted: '1 week ago',
      description: 'Join our AI research team to develop cutting-edge machine learning models and data-driven solutions for various industries.',
      requirements: ['Python', 'TensorFlow', 'SQL', 'Statistics'],
      logo: '🤖',
      featured: false,
      urgent: true
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      company: 'Cloud Infrastructure Co',
      location: 'Jakarta',
      type: 'Full-time',
      experience: 'Mid Level',
      salary: 'Rp 15-20 Juta',
      posted: '2 days ago',
      description: 'Manage and optimize our cloud infrastructure. Implement CI/CD pipelines and ensure system reliability and scalability.',
      requirements: ['AWS', 'Kubernetes', 'Terraform', 'Linux'],
      logo: '☁️',
      featured: true,
      urgent: false
    },
    {
      id: 6,
      title: 'Product Manager',
      company: 'E-commerce Giant',
      location: 'Jakarta',
      type: 'Full-time',
      experience: 'Senior Level',
      salary: 'Rp 25-35 Juta',
      posted: '4 days ago',
      description: 'Lead product development from conception to launch. Work with cross-functional teams to deliver exceptional user experiences.',
      requirements: ['Product Strategy', 'Agile', 'Data Analysis', 'Leadership'],
      logo: '📈',
      featured: true,
      urgent: false
    }
  ];

  useEffect(() => {
    loadJobs();
  }, [dispatch]);

  const loadJobs = () => {
    dispatch(fetchJobsStart());
    setTimeout(() => {
      dispatch(fetchJobsSuccess(mockJobs));
      setRefreshing(false);
    }, 1500);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadJobs();
    
    // Add refresh animation to grid
    if (jobsGridRef.current) {
      jobsGridRef.current.style.animation = 'none';
      setTimeout(() => {
        jobsGridRef.current.style.animation = 'stagger 0.6s ease-out';
      }, 10);
    }
  };

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
        <div className="loading">
          <div className="loading-text">
            Discovering amazing opportunities
            <span className="loading-dots"></span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jobs-container">
        <div className="error">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button className="refresh-btn" onClick={handleRefresh}>
            🔄 Try Again
          </button>
        </div>
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
            <p>
              Found <span>{filteredJobs.length}</span> job{filteredJobs.length !== 1 ? 's' : ''} matching your criteria
            </p>
            <button 
              className="refresh-btn" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? '🔄' : '🔍'} 
              {refreshing ? ' Refreshing...' : ' Refresh Jobs'}
            </button>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="no-jobs">
              <h3>🎯 No jobs found</h3>
              <p>Try adjusting your filters or search terms to find more opportunities</p>
            </div>
          ) : (
            <div className="jobs-grid" ref={jobsGridRef}>
              {filteredJobs.map((job, index) => (
                <JobCard 
                  key={job.id} 
                  job={job} 
                  className="job-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;