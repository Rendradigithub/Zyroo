const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Zyroo API is running!',
    timestamp: new Date().toISOString()
  });
});

// Jobs route
app.get('/api/jobs', (req, res) => {
  const jobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      company: 'Tech Startup',
      location: 'Jakarta',
      type: 'Full-time',
      posted: '2024-01-15'
    },
    {
      id: 2, 
      title: 'Backend Developer',
      company: 'FinTech Company', 
      location: 'Bandung',
      type: 'Full-time',
      posted: '2024-01-14'
    }
  ];
  res.json(jobs);
});

module.exports = app;