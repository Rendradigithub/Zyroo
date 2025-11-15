import React, { useState, useEffect } from 'react';
import './Admin.css';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

  // Data dummy untuk demo
  useEffect(() => {
    // Simulasi data users
    const mockUsers = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        status: 'active',
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'admin',
        status: 'active',
      },
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'user',
        status: 'inactive',
      },
    ];

    // Simulasi data jobs
    const mockJobs = [
      {
        id: 1,
        title: 'Frontend Developer',
        company: 'Tech Corp',
        status: 'active',
        applications: 15,
      },
      {
        id: 2,
        title: 'Backend Engineer',
        company: 'Startup XYZ',
        status: 'pending',
        applications: 8,
      },
      {
        id: 3,
        title: 'UI/UX Designer',
        company: 'Design Co',
        status: 'active',
        applications: 12,
      },
    ];

    setUsers(mockUsers);
    setJobs(mockJobs);
  }, []);

  const handleUserAction = (userId, action) => {
    console.log(`${action} user ${userId}`);
    // Implementasi aksi admin di sini
  };

  const handleJobAction = (jobId, action) => {
    console.log(`${action} job ${jobId}`);
    // Implementasi aksi job di sini
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{users.length}</p>
          </div>
          <div className="stat-card">
            <h3>Total Jobs</h3>
            <p>{jobs.length}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Jobs</h3>
            <p>{jobs.filter((job) => job.status === 'pending').length}</p>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users Management
        </button>
        <button
          className={`tab-button ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          Jobs Management
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'users' && (
          <div className="users-table">
            <h2>Users Management</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleUserAction(user.id, 'edit')}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleUserAction(user.id, 'delete')}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="jobs-table">
            <h2>Jobs Management</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Applications</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.id}</td>
                    <td>{job.title}</td>
                    <td>{job.company}</td>
                    <td>
                      <span className={`status-badge ${job.status}`}>
                        {job.status}
                      </span>
                    </td>
                    <td>{job.applications}</td>
                    <td className="actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleJobAction(job.id, 'edit')}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-approve"
                        onClick={() => handleJobAction(job.id, 'approve')}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleJobAction(job.id, 'delete')}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
