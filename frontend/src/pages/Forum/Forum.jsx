import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Forum.css';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'Diskusi Umum',
  });
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest | popular | comments
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Data dummy untuk demo portal
  useEffect(() => {
    const mockPosts = [
      {
        id: 1,
        title: 'Tips Interview Kerja Remote',
        content:
          'Ada yang punya pengalaman interview untuk kerja remote? Bagaimana tips, persiapan, dan hal yang harus dihindari?',
        author: 'John Doe',
        date: '2024-01-15',
        comments: 18,
        likes: 25,
        views: 220,
        category: 'Interview',
        tags: ['remote', 'interview', 'tips'],
      },
      {
        id: 2,
        title: 'Review Perusahaan Tech Startup',
        content:
          'Mau sharing pengalaman kerja di startup tech, culture, workload, dan benefitnya bagaimana menurut kalian?',
        author: 'Jane Smith',
        date: '2024-01-14',
        comments: 12,
        likes: 30,
        views: 310,
        category: 'Review Perusahaan',
        tags: ['startup', 'tech', 'culture'],
      },
      {
        id: 3,
        title: 'Career Switch dari Marketing ke Tech',
        content:
          'Ada yang pernah melakukan career switch dari marketing ke tech? Bagaimana journey, tantangan, dan langkah awalnya?',
        author: 'Bob Johnson',
        date: '2024-01-13',
        comments: 9,
        likes: 17,
        views: 180,
        category: 'Career Switch',
        tags: ['career-switch', 'learning', 'motivation'],
      },
      {
        id: 4,
        title: 'Saran Sertifikasi untuk Frontend Developer',
        content:
          'Lagi cari sertifikasi yang relevan untuk frontend dev. Ada rekomendasi yang worth-it menurut teman-teman?',
        author: 'Alya Putri',
        date: '2024-01-12',
        comments: 7,
        likes: 14,
        views: 140,
        category: 'Sertifikasi',
        tags: ['frontend', 'sertifikasi'],
      },
      {
        id: 5,
        title: 'Gaji Fresh Graduate di Bidang Data Analyst',
        content:
          'Boleh share range gaji untuk posisi data analyst fresh graduate di Jakarta / remote?',
        author: 'Dimas Rahman',
        date: '2024-01-11',
        comments: 15,
        likes: 21,
        views: 260,
        category: 'Gaji & Benefit',
        tags: ['data-analyst', 'salary'],
      },
    ];

    setPosts(mockPosts);
  }, []);

  // kategori unik
  const categories = useMemo(() => {
    const setCat = new Set(posts.map((p) => p.category));
    return ['Semua', ...Array.from(setCat)];
  }, [posts]);

  // statistik kecil di atas
  const stats = useMemo(
    () => ({
      totalPosts: posts.length,
      totalComments: posts.reduce((sum, p) => sum + (p.comments || 0), 0),
      totalLikes: posts.reduce((sum, p) => sum + (p.likes || 0), 0),
    }),
    [posts]
  );

  // proses filter + sort
  const processedPosts = useMemo(() => {
    let list = [...posts];

    // filter kategori
    if (activeCategory !== 'Semua') {
      list = list.filter((p) => p.category === activeCategory);
    }

    // filter search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.content.toLowerCase().includes(term) ||
          p.author.toLowerCase().includes(term)
      );
    }

    // sort
    if (sortBy === 'popular') {
      list.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    } else if (sortBy === 'comments') {
      list.sort((a, b) => (b.comments || 0) - (a.comments || 0));
    } else {
      // newest by date
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return list;
  }, [posts, activeCategory, searchTerm, sortBy]);

  const featuredPost = processedPosts[0] || null;
  const otherPosts = featuredPost ? processedPosts.slice(1) : processedPosts;

  const trendingPosts = useMemo(() => {
    return [...posts]
      .sort((a, b) => (b.views || 0) + (b.likes || 0) - ((a.views || 0) + (a.likes || 0)))
      .slice(0, 4);
  }, [posts]);

  const allTags = useMemo(() => {
    const tags = new Set();
    posts.forEach((p) => (p.tags || []).forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [posts]);

  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;

    setIsSubmitting(true);

    const post = {
      id: posts.length + 1,
      title: newPost.title,
      content: newPost.content,
      author: 'Current User', // ganti dengan user login nantinya
      date: new Date().toISOString().split('T')[0],
      comments: 0,
      likes: 0,
      views: 0,
      category: newPost.category || 'Diskusi Umum',
      tags: [],
    };

    setTimeout(() => {
      setPosts((prev) => [post, ...prev]);
      setNewPost({ title: '', content: '', category: 'Diskusi Umum' });
      setShowNewPostForm(false);
      setIsSubmitting(false);
    }, 400);
  };

  const handleLike = (postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, likes: (post.likes || 0) + 1 } : post
      )
    );
  };

  const handleReadMore = (postId) => {
    navigate(`/forum/post/${postId}`);
  };

  return (
    <div className="forum-container">
      {/* ====== HEADER PORTAL ====== */}
      <div className="forum-header">
        <h1>Career Forum Portal</h1>
        <p>
          Portal diskusi karir, review perusahaan, sharing pengalaman kerja, dan tips
          pengembangan diri dalam satu tempat.
        </p>
        <button
          className="btn-new-post"
          onClick={() => setShowNewPostForm((prev) => !prev)}
        >
          {showNewPostForm ? 'Tutup Form' : '+ Buat Post Baru'}
        </button>
      </div>

      {/* ====== TOP STATS & FILTER BAR ====== */}
      <div className="forum-top-section">
        <div className="forum-stats">
          <div className="stat-card">
            <span className="stat-label">Total Post</span>
            <span className="stat-value">{stats.totalPosts}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Komentar</span>
            <span className="stat-value">{stats.totalComments}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Likes</span>
            <span className="stat-value">{stats.totalLikes}</span>
          </div>
        </div>

        <div className="forum-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Cari berdasarkan judul, konten, atau penulis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-controls">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Terbaru</option>
              <option value="popular">Terpopuler (Likes)</option>
              <option value="comments">Banyak Komentar</option>
            </select>
          </div>
        </div>
      </div>

      {/* ====== MAIN PORTAL LAYOUT ====== */}
      <div className="forum-layout">
        <div className="forum-main">
          {/* FEATURED POST */}
          {featuredPost && (
            <div className="featured-wrapper">
              <h2 className="section-title">🔥 Post Utama</h2>
              <div className="post-card featured">
                <div className="post-header">
                  <h3>{featuredPost.title}</h3>
                  <span className="post-date">{featuredPost.date}</span>
                </div>
                <div className="post-category-badge">{featuredPost.category}</div>
                <div className="post-content">
                  <p>{featuredPost.content}</p>
                </div>
                <div className="post-meta">
                  <span className="post-author">Oleh: {featuredPost.author}</span>
                  <div className="post-stats">
                    <button
                      className="like-btn"
                      onClick={() => handleLike(featuredPost.id)}
                    >
                      👍 {featuredPost.likes}
                    </button>
                    <span className="comments">
                      💬 {featuredPost.comments} komentar
                    </span>
                    <span className="views">👁 {featuredPost.views} views</span>
                  </div>
                </div>
                <div className="post-actions">
                  <button
                    className="btn-read"
                    onClick={() => handleReadMore(featuredPost.id)}
                  >
                    Baca Selengkapnya
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* FORM POST BARU */}
          {showNewPostForm && (
            <div className="new-post-form">
              <h2>Buat Post Baru</h2>
              <form onSubmit={handleSubmitPost}>
                <input
                  type="text"
                  placeholder="Judul post..."
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />

                <select
                  value={newPost.category}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="category-select"
                >
                  <option>Diskusi Umum</option>
                  <option>Interview</option>
                  <option>Review Perusahaan</option>
                  <option>Career Switch</option>
                  <option>Sertifikasi</option>
                  <option>Gaji & Benefit</option>
                </select>

                <textarea
                  placeholder="Konten post..."
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost((prev) => ({ ...prev, content: e.target.value }))
                  }
                  rows="5"
                  required
                />
                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowNewPostForm(false)}
                    disabled={isSubmitting}
                  >
                    Batal
                  </button>
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Memposting...' : 'Post'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* LIST POST LAINNYA */}
          <h2 className="section-title with-spacing">✨ Semua Diskusi</h2>
          {otherPosts.length === 0 ? (
            <div className="posts-empty">
              Belum ada post untuk filter/kata kunci ini.  
              Coba ubah filter atau buat post baru.
            </div>
          ) : (
            <div className="posts-list">
              {otherPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="post-card"
                  style={{ animationDelay: `${0.05 * index}s` }}
                >
                  <div className="post-header">
                    <h3>{post.title}</h3>
                    <span className="post-date">{post.date}</span>
                  </div>
                  <div className="post-category-badge small">
                    {post.category}
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
                      <span className="comments">
                        💬 {post.comments} komentar
                      </span>
                      <span className="views">👁 {post.views} views</span>
                    </div>
                  </div>
                  <div className="post-actions">
                    <button
                      className="btn-read"
                      onClick={() => handleReadMore(post.id)}
                    >
                      Baca Selengkapnya
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ====== SIDEBAR PORTAL ====== */}
        <div className="forum-sidebar">
          <div className="sidebar-card">
            <h3>🔥 Trending Minggu Ini</h3>
            <ul className="trending-list">
              {trendingPosts.map((post) => (
                <li key={post.id} onClick={() => handleReadMore(post.id)}>
                  <div className="trending-title">{post.title}</div>
                  <div className="trending-meta">
                    <span>👍 {post.likes}</span>
                    <span>💬 {post.comments}</span>
                    <span>👁 {post.views}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-card">
            <h3>Kategori</h3>
            <div className="category-chips">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`chip ${
                    activeCategory === cat ? 'chip-active' : ''
                  }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {allTags.length > 0 && (
            <div className="sidebar-card">
              <h3>Tag Populer</h3>
              <div className="tag-cloud">
                {allTags.map((tag) => (
                  <span key={tag} className="tag-item">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="sidebar-card info-card">
            <h3>Tips Berkontribusi</h3>
            <ul>
              <li>Gunakan judul yang jelas dan spesifik.</li>
              <li>Ceritakan konteks singkat agar mudah dipahami.</li>
              <li>Tag kategori yang sesuai dengan topik.</li>
              <li>Balas komentar untuk menjaga diskusi aktif.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
