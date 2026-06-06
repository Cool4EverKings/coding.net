'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('username', data.username);
        router.push('/');
        router.refresh();
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <main className="container">
      <h1>Sign Up</h1>
      {error && <p style={{ color: 'white', background: 'red', padding: '10px', borderRadius: '5px' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text" 
          placeholder="User Name" 
          required
        />
        <input 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email" 
          placeholder="Email Address" 
          required
        />
        <input 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password" 
          placeholder="Password" 
          required
        />
        <input 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password" 
          placeholder="Confirm Password" 
          required
        />
        <input type="submit" value="sign up" className="red-button" />
      </form>
      <Link href="/" className="red-button">Back to Home</Link>
    </main>
  );
}
