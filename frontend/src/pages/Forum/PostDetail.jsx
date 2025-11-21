import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PostDetail.css';

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const commentInputRef = useRef(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [reactionPicker, setReactionPicker] = useState(null);
  
  // Data dummy yang lebih realistik
  const [post, setPost] = useState({
    id: 1,
    title: 'Tips Interview Kerja Remote',
    content: `Ada yang punya pengalaman interview untuk kerja remote? Bagaimana tipsnya?

Saya baru saja mengalami proses interview untuk posisi remote dan ingin berbagi pengalaman:

## 📋 Tahapan Interview:
1. **Technical Test** - Biasanya lebih ketat karena tidak ada interaksi langsung
2. **Communication Skills** - Sangat diutamakan untuk kerja remote
3. **Time Management** - Menjadi poin penting yang ditanyakan
4. **Self-Motivation** - Harus bisa ditunjukkan selama proses

## 💡 Tips dari Saya:
- Persiapkan koneksi internet yang stabil
- Test semua peralatan (webcam, mic) sebelum interview
- Siapkan workspace yang profesional
- Tunjukkan proaktif dalam komunikasi

Bagaimana dengan pengalaman kalian? Ada tips lain yang bisa dibagikan?`,
    author: 'John Doe',
    date: '2024-01-15',
    likes: 15,
    views: 243,
    tags: ['remote-work', 'interview', 'career-tips'],
    reactions: {
      '👍': 12,
      '❤️': 8,
      '🎉': 5,
      '😮': 3,
      '👏': 7
    }
  });

  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Jane Smith',
      role: 'HR Manager',
      content: 'Setuju banget! Dari sisi HR, kami sangat memperhatikan communication skills untuk posisi remote. Kemampuan untuk mengekspresikan ide secara jelas melalui tulisan dan video call sangat penting.',
      date: '2024-01-15',
      time: '14:30',
      likes: 8,
      isHelpful: true,
      reactions: {
        '👍': 5,
        '❤️': 2
      },
      replies: [
        {
          id: 11,
          author: 'Mike Chen',
          role: 'Team Lead',
          content: 'Betul sekali! Saya sebagai team lead juga melihat ini.',
          date: '2024-01-15',
          time: '15:20',
          likes: 3
        }
      ]
    },
    {
      id: 2,
      author: 'Bob Johnson',
      role: 'Senior Developer',
      content: 'Jangan lupa test koneksi internet dan peralatan sebelum interview! Dari pengalaman saya, siapkan juga backup plan seperti hotspot dari smartphone untuk jaga-jaga.',
      date: '2024-01-16',
      time: '09:15',
      likes: 12,
      isHelpful: true,
      reactions: {
        '👍': 8,
        '🎉': 2
      },
      replies: []
    }
  ]);

  const [activeSort, setActiveSort] = useState('newest');
  const [showReplies, setShowReplies] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [onlineUsers, setOnlineUsers] = useState(['Jane Smith', 'Bob Johnson', 'Sarah Lee']);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Simulasi user typing
  useEffect(() => {
    if (newComment.length > 0 && !isTyping) {
      setIsTyping(true);
      setTypingUsers(['Anda']);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      setTypingUsers([]);
    }, 1500);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [newComment]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: 'Anda',
        role: 'Member',
        content: newComment,
        date: new Date().toLocaleDateString('id-ID'),
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        likes: 0,
        isHelpful: false,
        reactions: {},
        replies: []
      };
      setComments([comment, ...comments]);
      setNewComment('');
      setIsTyping(false);
      setTypingUsers([]);
      
      // Scroll to new comment
      setTimeout(() => {
        const newCommentElement = document.getElementById(`comment-${comment.id}`);
        if (newCommentElement) {
          newCommentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          newCommentElement.classList.add('highlight-new');
          setTimeout(() => newCommentElement.classList.remove('highlight-new'), 3000);
        }
      }, 100);
    }
  };

  const handleAddReply = (commentId, e) => {
    e.preventDefault();
    if (replyContent.trim()) {
      const newReply = {
        id: Date.now(),
        author: 'Anda',
        role: 'Member',
        content: replyContent,
        date: new Date().toLocaleDateString('id-ID'),
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        likes: 0
      };

      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      ));

      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const handleReaction = (type, target, targetId) => {
    if (target === 'post') {
      setPost(prev => ({
        ...prev,
        reactions: {
          ...prev.reactions,
          [type]: (prev.reactions[type] || 0) + 1
        }
      }));
    } else {
      setComments(comments.map(comment => {
        if (comment.id === targetId) {
          return {
            ...comment,
            reactions: {
              ...comment.reactions,
              [type]: (comment.reactions[type] || 0) + 1
            }
          };
        }
        return comment;
      }));
    }
    setReactionPicker(null);
  };

  const availableReactions = ['👍', '❤️', '🎉', '😮', '👏', '😂', '😢', '😡'];

  const handleLikeComment = (commentId) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  const handleMarkHelpful = (commentId) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, isHelpful: !comment.isHelpful }
        : comment
    ));
  };

  const handleLikePost = () => {
    setPost({ ...post, likes: post.likes + 1 });
  };

  const toggleReplies = (commentId) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const sortedComments = [...comments].sort((a, b) => {
    switch (activeSort) {
      case 'newest':
        return b.id - a.id;
      case 'most-liked':
        return b.likes - a.likes;
      case 'oldest':
        return a.id - b.id;
      default:
        return b.id - a.id;
    }
  });

  const sharePost = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.content.substring(0, 100) + '...',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link berhasil disalin!');
    }
  };

  return (
    <div className="post-detail-container">
      <button className="back-btn" onClick={() => navigate('/forum')}>
        ← Kembali ke Forum
      </button>

      {/* Online Users */}
      <div className="online-users">
        <div className="online-header">
          <span className="online-dot"></span>
          <span>{onlineUsers.length} online</span>
        </div>
        <div className="online-list">
          {onlineUsers.map(user => (
            <span key={user} className="online-user">{user}</span>
          ))}
        </div>
      </div>

      <article className="post-detail">
        <header className="post-header">
          <div className="post-tags">
            {post.tags.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
          <h1>{post.title}</h1>
          <div className="post-meta">
            <div className="author-info">
              <span className="author">Oleh: {post.author}</span>
              <span className="date">{post.date}</span>
            </div>
            <div className="post-stats">
              <span className="views">👁️ {post.views} dilihat</span>
              <span className="likes">👍 {post.likes} Suka</span>
            </div>
          </div>
        </header>

        <div className="post-content">
          {post.content.split('\n').map((paragraph, index) => {
            if (paragraph.startsWith('## ')) {
              return <h3 key={index}>{paragraph.replace('## ', '')}</h3>;
            } else if (paragraph.startsWith('- ') || paragraph.startsWith('1. ')) {
              const content = paragraph.replace(/^[-1.]\s*/, '');
              return <li key={index}>{content}</li>;
            } else if (paragraph.trim() === '') {
              return <br key={index} />;
            } else {
              return <p key={index}>{paragraph}</p>;
            }
          })}
        </div>

        {/* Post Reactions */}
        <div className="post-reactions">
          <div className="reactions-display">
            {Object.entries(post.reactions).map(([emoji, count]) => (
              count > 0 && (
                <span key={emoji} className="reaction-badge">
                  {emoji} {count}
                </span>
              )
            ))}
          </div>
          <div className="reaction-actions">
            <button 
              className="reaction-btn"
              onClick={() => setReactionPicker(reactionPicker === 'post' ? null : 'post')}
            >
              😊 Add Reaction
            </button>
            {reactionPicker === 'post' && (
              <div className="reaction-picker">
                {availableReactions.map(reaction => (
                  <button
                    key={reaction}
                    className="reaction-option"
                    onClick={() => handleReaction(reaction, 'post')}
                  >
                    {reaction}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="post-actions">
          <button className="like-btn" onClick={handleLikePost}>
            👍 Suka ({post.likes})
          </button>
          <button className="share-btn" onClick={sharePost}>
            🔗 Bagikan
          </button>
          <button className="save-btn">
            💾 Simpan
          </button>
        </div>
      </article>

      {/* Comments Section */}
      <section className="comments-section">
        <div className="comments-header">
          <h2>💬 Diskusi ({comments.length})</h2>
          <div className="sort-options">
            <span>Urutkan: </span>
            <button 
              className={activeSort === 'newest' ? 'active' : ''}
              onClick={() => setActiveSort('newest')}
            >
              Terbaru
            </button>
            <button 
              className={activeSort === 'most-liked' ? 'active' : ''}
              onClick={() => setActiveSort('most-liked')}
            >
              Terpopuler
            </button>
            <button 
              className={activeSort === 'oldest' ? 'active' : ''}
              onClick={() => setActiveSort('oldest')}
            >
              Terlama
            </button>
          </div>
        </div>

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>{typingUsers.join(', ')} sedang mengetik...</span>
          </div>
        )}
        
        <form onSubmit={handleAddComment} className="comment-form">
          <div className="user-avatar">
            <span>👤</span>
          </div>
          <div className="comment-input-container">
            <textarea
              ref={commentInputRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Bagikan pemikiran atau pengalaman Anda..."
              rows="4"
              required
            />
            <div className="comment-actions">
              <button type="submit" className="submit-comment">
                💬 Kirim Komentar
              </button>
            </div>
          </div>
        </form>

        <div className="comments-list">
          {sortedComments.map(comment => (
            <div key={comment.id} id={`comment-${comment.id}`} className={`comment-card ${comment.isHelpful ? 'helpful' : ''}`}>
              <div className="comment-header">
                <div className="comment-author">
                  <div className="author-avatar">👤</div>
                  <div className="author-info">
                    <span className="author-name">{comment.author}</span>
                    <span className="author-role">{comment.role}</span>
                  </div>
                </div>
                <div className="comment-meta">
                  <span className="comment-date">{comment.date}</span>
                  <span className="comment-time">{comment.time}</span>
                </div>
              </div>
              
              <div className="comment-content">
                <p>{comment.content}</p>
              </div>

              {/* Comment Reactions */}
              <div className="comment-reactions">
                <div className="reactions-display">
                  {Object.entries(comment.reactions || {}).map(([emoji, count]) => (
                    count > 0 && (
                      <span key={emoji} className="reaction-badge">
                        {emoji} {count}
                      </span>
                    )
                  ))}
                </div>
                <div className="reaction-actions">
                  <button 
                    className="reaction-btn"
                    onClick={() => setReactionPicker(reactionPicker === comment.id ? null : comment.id)}
                  >
                    😊
                  </button>
                  {reactionPicker === comment.id && (
                    <div className="reaction-picker">
                      {availableReactions.map(reaction => (
                        <button
                          key={reaction}
                          className="reaction-option"
                          onClick={() => handleReaction(reaction, 'comment', comment.id)}
                        >
                          {reaction}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="comment-actions">
                <button 
                  className={`like-btn ${comment.likes > 0 ? 'liked' : ''}`}
                  onClick={() => handleLikeComment(comment.id)}
                >
                  👍 {comment.likes}
                </button>
                <button 
                  className={`helpful-btn ${comment.isHelpful ? 'active' : ''}`}
                  onClick={() => handleMarkHelpful(comment.id)}
                >
                  {comment.isHelpful ? '✅ Membantu' : '💡 Tandai Membantu'}
                </button>
                <button 
                  className="reply-btn"
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                >
                  💬 Balas ({comment.replies.length})
                </button>
              </div>

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <form onSubmit={(e) => handleAddReply(comment.id, e)} className="reply-form">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Tulis balasan Anda..."
                    rows="2"
                    required
                  />
                  <div className="reply-actions">
                    <button type="button" onClick={() => setReplyingTo(null)}>
                      Batal
                    </button>
                    <button type="submit">
                      Kirim Balasan
                    </button>
                  </div>
                </form>
              )}

              {/* Replies */}
              {comment.replies.length > 0 && (
                <div className="replies-section">
                  <button 
                    className="toggle-replies-btn"
                    onClick={() => toggleReplies(comment.id)}
                  >
                    {showReplies[comment.id] ? '👇 Sembunyikan' : '👉 Tampilkan'} {comment.replies.length} balasan
                  </button>
                  
                  {showReplies[comment.id] && (
                    <div className="replies-list">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="reply-card">
                          <div className="reply-header">
                            <span className="reply-author">{reply.author}</span>
                            <span className="reply-time">{reply.time}</span>
                          </div>
                          <div className="reply-content">
                            <p>{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {comment.isHelpful && (
                <div className="helpful-badge">
                  <span>✅ Komentar ini ditandai membantu</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PostDetail;
