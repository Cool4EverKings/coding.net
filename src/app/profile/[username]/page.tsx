'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserProfile {
  username: string;
  xp: number;
  bio: string;
  avatar: string;
  level: number;
  progress: number;
}

const AVATARS = ['avatar1.svg', 'avatar2.svg', 'avatar3.svg', 'avatar4.svg'];

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const profileUsername = params.username as string;
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('avatar1.png');
  const [loading, setLoading] = useState(true);
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState<string | null>(null);

  useEffect(() => {
    setCurrentLoggedInUser(localStorage.getItem('username'));
    
    fetch(`/api/user/profile?username=${profileUsername}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProfile(data);
          setBio(data.bio);
          setSelectedAvatar(data.avatar);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [profileUsername]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/user/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: currentLoggedInUser, bio, avatar: selectedAvatar })
    });

    if (res.ok) {
      setIsEditing(false);
      window.location.reload();
    }
  };

  if (loading) return <main className="container"><p>Loading profile...</p></main>;
  if (!profile) return <main className="container"><h1>User not found</h1><Link href="/" className="red-button">Back Home</Link></main>;

  const isOwnProfile = currentLoggedInUser === profileUsername;

  return (
    <main className="container">
      <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', maxWidth: '600px', margin: '0 auto' }}>
        <img 
          src={`/avatars/${profile.avatar}`} 
          alt="Avatar" 
          style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '5px solid red', margin: '0 auto 20px auto' }} 
        />
        
        <h1 style={{ color: 'black', margin: 0 }}>{profile.username}</h1>
        <div style={{ color: 'red', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '20px' }}>Level {profile.level}</div>

        <div style={{ width: '100%', height: '15px', background: '#eee', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' }}>
          <div style={{ width: `${profile.progress}%`, height: '100%', background: 'red', transition: 'width 0.5s ease' }}></div>
        </div>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '30px' }}>{profile.xp} Total XP</p>

        {isEditing ? (
          <form onSubmit={handleUpdateProfile} style={{ textAlign: 'left' }}>
            <label style={{ color: 'black', fontWeight: 'bold' }}>Choose Avatar:</label>
            <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
              {AVATARS.map(av => (
                <img 
                  key={av}
                  src={`/avatars/${av}`}
                  alt="Choice"
                  onClick={() => setSelectedAvatar(av)}
                  style={{ 
                    width: '60px', height: '60px', borderRadius: '50%', cursor: 'pointer',
                    border: selectedAvatar === av ? '4px solid red' : '2px solid transparent'
                  }}
                />
              ))}
            </div>

            <label style={{ color: 'black', fontWeight: 'bold' }}>Your Bio:</label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{ width: '100%', height: '100px', margin: '10px 0', padding: '10px', borderRadius: '8px' }}
            />
            <button type="submit" className="red-button" style={{ width: '100%' }}>Save Profile</button>
            <button type="button" onClick={() => setIsEditing(false)} className="red-button" style={{ width: '100%', background: '#ccc' }}>Cancel</button>
          </form>
        ) : (
          <>
            <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', color: '#333', marginBottom: '30px', fontStyle: 'italic' }}>
              "{profile.bio}"
            </div>
            {isOwnProfile && (
              <button onClick={() => setIsEditing(true)} className="red-button">Edit Profile</button>
            )}
          </>
        )}
        
        <Link href="/community" className="red-button" style={{ background: 'orange' }}>Back to Community</Link>
      </div>
    </main>
  );
}
