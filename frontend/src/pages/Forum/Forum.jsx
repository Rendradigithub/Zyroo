import React, { useState, useEffect } from 'react';
import './Forum.css';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  // Data dummy untuk demo
  useEffect(() => {
    const mockPosts = [
      {
        id: 1,
        title: 'Tips Interview Kerja Remote',
        content:
          'Ada yang punya pengalaman interview untuk kerja remote? Bagaimana tipsnya?',
        author: 'John Doe',
        date: '2024-01-15',
        comments: 8,
        likes: 15,
      },
      {
        id: 2,
        title: 'Review Perusahaan Tech Startup',
        content:
          'Mau sharing pengalaman kerja di startup tech, culture dan benefitnya bagaimana?',
        author: 'Jane Smith',
        date: '2024-01-14',
        comments: 12,
        likes: 23,
      },
      {
        id: 3,
        title: 'Career Switch dari Marketing ke Tech',
        content:
          'Ada yang pernah melakukan career switch dari marketing ke tech? Bagaimana journey-nya?',
        author: 'Bob Johnson',
        date: '2024-01-13',
        comments: 5,
        likes: 10,
      },
    ];
    setPosts(mockPosts);
  }, []);

  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (newPost.title && newPost.content) {
      const post = {
        id: posts.length + 1,
        title: newPost.title,
        content: newPost.content,
        author: 'Current User', // Ganti dengan user yang login
        date: new Date().toISOString().split('T')[0],
        comments: 0,
        likes: 0,
      };
      setPosts([post, ...posts]);
      setNewPost({ title: '', content: '' });
      setShowNewPostForm(false);
    }
  };

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  return (
    <div className="forum-container">
      <div className="forum-header">
        <h1>Career Forum</h1>
        <p>Diskusi dan berbagi pengalaman seputar karir</p>
        <button
          className="btn-new-post"
          onClick={() => setShowNewPostForm(!showNewPostForm)}
        >
          + Buat Post Baru
        </button>
      </div>

      {showNewPostForm && (
        <div className="new-post-form">
          <h2>Buat Post Baru</h2>
          <form onSubmit={handleSubmitPost}>
            <input
              type="text"
              placeholder="Judul post..."
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              required
            />
            <textarea
              placeholder="Konten post..."
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
              rows="5"
              required
            />
            <div className="form-actions">
              <button type="button" onClick={() => setShowNewPostForm(false)}>
                Batal
              </button>
              <button type="submit">Post</button>
            </div>
          </form>
        </div>
      )}

      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <h3>{post.title}</h3>
              <span className="post-date">{post.date}</span>
            </div>
            <div className="post-content">
              <p>{post.content}</p>
            </div>
            <div className="post-meta">
              <span className="post-author">Oleh: {post.author}</span>
              <div className="post-stats">
                <button
                  className="like-btn"
                  onClick={() => handleLike(post.id)}
                >
                  👍 {post.likes}
                </button>
                <span className="comments">💬 {post.comments} komentar</span>
              </div>
            </div>
            <div className="post-actions">
              <button className="btn-read">Baca Selengkapnya</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forum;
