'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const username = localStorage.getItem('username');

    if (!username) {
      setError('You must be logged in to post');
      return;
    }

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, username }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/community');
      } else {
        setError(data.message || 'Failed to create post');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <main className="container">
      <h1>Create a Post</h1>
      {error && <p style={{ color: 'white', background: 'red', padding: '10px', borderRadius: '5px' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?" 
          required
          style={{ 
            width: '100%', 
            maxWidth: '600px', 
            height: '200px',
            textAlign: 'left',
            padding: '15px'
          }} 
        />
        <input type="submit" value="Post" className="red-button" />
      </form>
      <Link href="/community" className="red-button">Back to Community</Link>
    </main>
  );
}
