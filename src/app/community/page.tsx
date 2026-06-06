'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Post {
  postsID: number;
  postsUSER: string;
  postsCONTENT: string;
  usersAVATAR?: string;
}

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Note: In a real app, I'd JOIN the users table to get avatars.
    // I'll update the API route next to do this.
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch posts:', err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="container">
      <h1>Community</h1>
      <h2>Posts</h2>
      
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div 
                key={post.postsID} 
                className="post" 
                style={{ width: '100%', maxWidth: '600px', display: 'flex', gap: '20px', alignItems: 'center' }}
              >
                <Link href={`/profile/${post.postsUSER}`}>
                    <img 
                        src={`/avatars/${post.usersAVATAR || 'avatar1.svg'}`} 
                        alt="User" 
                        style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid red', cursor: 'pointer' }} 
                    />
                </Link>
                
                <div style={{ flex: 1, textAlign: 'left' }} onClick={() => router.push(`/community/posts/${post.postsID}`)}>
                    <h3 style={{ margin: '0 0 5px 0', cursor: 'pointer' }}>{post.postsUSER} said:</h3>
                    <p style={{ margin: 0 }}>{post.postsCONTENT}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No posts yet.</p>
          )}
        </div>
      )}

      <h1 style={{ marginTop: '40px' }}>Make a post</h1>
      <Link href="/community/create" className="red-button">Create Post</Link>
      <Link href="/" className="red-button">Back to Home</Link>
    </main>
  );
}
