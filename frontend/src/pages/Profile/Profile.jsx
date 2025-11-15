import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+62 812-3456-7890',
    location: 'Jakarta, Indonesia',
    bio: 'Frontend Developer dengan pengalaman 3 tahun dalam pengembangan web modern.',
    skills: ['JavaScript', 'React', 'Node.js', 'CSS'],
    experience: [
      {
        id: 1,
        position: 'Frontend Developer',
        company: 'Tech Company',
        period: '2022 - Sekarang',
        description:
          'Mengembangkan aplikasi web menggunakan React dan TypeScript',
      },
      {
        id: 2,
        position: 'Web Developer',
        company: 'Startup XYZ',
        period: '2020 - 2022',
        description: 'Membangun dan maintain website company dan produk',
      },
    ],
  });

  const [newSkill, setNewSkill] = useState('');

  const handleSave = () => {
    // Simpan data ke backend atau state management
    console.log('Saving profile:', userData);
    setIsEditing(false);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !userData.skills.includes(newSkill.trim())) {
      setUserData({
        ...userData,
        skills: [...userData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setUserData({
      ...userData,
      skills: userData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile Saya</h1>
        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="btn-save" onClick={handleSave}>
                Simpan
              </button>
              <button
                className="btn-cancel"
                onClick={() => setIsEditing(false)}
              >
                Batal
              </button>
            </>
          ) : (
            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Informasi Pribadi</h2>
          <div className="profile-info">
            <div className="info-group">
              <label>Nama Lengkap</label>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                />
              ) : (
                <p>{userData.name}</p>
              )}
            </div>

            <div className="info-group">
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                />
              ) : (
                <p>{userData.email}</p>
              )}
            </div>

            <div className="info-group">
              <label>Telepon</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData({ ...userData, phone: e.target.value })
                  }
                />
              ) : (
                <p>{userData.phone}</p>
              )}
            </div>

            <div className="info-group">
              <label>Lokasi</label>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.location}
                  onChange={(e) =>
                    setUserData({ ...userData, location: e.target.value })
                  }
                />
              ) : (
                <p>{userData.location}</p>
              )}
            </div>

            <div className="info-group">
              <label>Bio</label>
              {isEditing ? (
                <textarea
                  value={userData.bio}
                  onChange={(e) =>
                    setUserData({ ...userData, bio: e.target.value })
                  }
                  rows="3"
                />
              ) : (
                <p>{userData.bio}</p>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Skills</h2>
          <div className="skills-section">
            <div className="skills-list">
              {userData.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="remove-skill"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
            {isEditing && (
              <div className="add-skill">
                <input
                  type="text"
                  placeholder="Tambah skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                />
                <button onClick={handleAddSkill}>Tambah</button>
              </div>
            )}
          </div>
        </div>

        <div className="profile-section">
          <h2>Pengalaman Kerja</h2>
          <div className="experience-list">
            {userData.experience.map((exp) => (
              <div key={exp.id} className="experience-item">
                <h4>{exp.position}</h4>
                <p className="company">
                  {exp.company} • {exp.period}
                </p>
                <p className="description">{exp.description}</p>
              </div>
            ))}
          </div>
          {isEditing && (
            <button className="btn-add-experience">+ Tambah Pengalaman</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
