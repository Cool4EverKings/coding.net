'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Post {
  postsID: number;
  postsUSER: string;
  postsCONTENT: string;
}

interface Comment {
  commentsID: number;
  commentsUSER: string;
  commentsCONTENT: string;
  commentsLIKES: number;
  usersAVATAR?: string;
}

export default function PostComments() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      const data = await res.json();
      if (Array.isArray(data)) setComments(data);
    } catch (err) {
      console.error('Fetch comments error:', err);
    }
  };

  useEffect(() => {
    if (!postId) return;

    const fetchData = async () => {
      try {
        const [postRes] = await Promise.all([
          fetch(`/api/posts/single?id=${postId}`),
          fetchComments()
        ]);

        const postData = await postRes.json();
        if (postData.success !== false) setPost(postData);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const username = localStorage.getItem('username');

    if (!username) {
      alert('You must be logged in to comment');
      return;
    }

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content: newComment, username })
      });

      if (res.ok) {
        setNewComment('');
        fetchComments();
      }
    } catch (err) {
      console.error('Comment error:', err);
    }
  };

  const handleLike = async (commentId: number) => {
    const username = localStorage.getItem('username');

    if (!username) {
      alert('You must be logged in to like');
      return;
    }

    try {
      const res = await fetch('/api/comments/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, username })
      });

      if (res.ok) {
        fetchComments();
      } else {
        const data = await res.json();
        if (data.message === 'Already liked') {
            alert('You have already liked this comment!');
        }
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  if (loading) return <main className="container"><p>Loading...</p></main>;

  return (
    <main className="container">
      {post ? (
        <div className="postHeading" style={{ marginBottom: '40px' }}>
          <h1>
            <Link href={`/profile/${post.postsUSER}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {post.postsUSER}
            </Link> said:
          </h1>
          <h2>{post.postsCONTENT}</h2>
        </div>
      ) : (
        <p>Post not found.</p>
      )}

      <h1>Comments:</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.commentsID} className="post" style={{ width: '100%', maxWidth: '600px', cursor: 'default', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
              <Link href={`/profile/${comment.commentsUSER}`}>
                <img 
                    src={`/avatars/${comment.usersAVATAR || 'avatar1.svg'}`} 
                    alt="User" 
                    style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid red' }} 
                />
              </Link>
              
              <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 5px 0' }}>
                    <Link href={`/profile/${comment.commentsUSER}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {comment.commentsUSER}
                    </Link> said:
                  </h3>
                  <p style={{ margin: 0 }}>{comment.commentsCONTENT}</p>
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <small>{comment.commentsLIKES || 0} likes </small>
                    <button 
                      className="red-button" 
                      style={{ width: 'auto', margin: '0', padding: '5px 15px', minWidth: '80px' }}
                      onClick={() => handleLike(comment.commentsID)}
                    >
                      Like
                    </button>
                  </div>
              </div>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>Add Comment</h2>
        <form onSubmit={handleSubmitComment}>
          <textarea 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..." 
            required
            style={{ width: '100%', maxWidth: '600px', height: '100px', padding: '15px' }}
          />
          <input type="submit" value="Comment" className="red-button" />
        </form>
      </div>

      <Link href="/community" className="red-button">Back to Community</Link>
    </main>
  );
}
