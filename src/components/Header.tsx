'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface UserStats {
  xp: number;
  level: number;
  progress: number;
  nextLevelXP: number;
  avatar?: string;
}

const Header = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    setUsername(storedUser);

    if (storedUser) {
      fetch(`/api/user/profile?username=${storedUser}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setStats(data);
          }
        })
        .catch(err => console.error('Error fetching stats:', err));
    } else {
      setStats(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername(null);
    setStats(null);
    router.push('/');
    window.location.reload();
  };

  return (
    <header style={{ backgroundColor: 'orange', padding: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
           <Link href="/" style={{ color: 'red', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>Coding.net</Link>
           {stats && (
             <div style={{ textAlign: 'left', minWidth: '150px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'red' }}>LEVEL {stats.level}</div>
                <div style={{ width: '100%', height: '8px', background: 'white', borderRadius: '4px', overflow: 'hidden', border: '1px solid red' }}>
                  <div style={{ width: `${stats.progress}%`, height: '100%', background: 'red', transition: 'width 0.5s ease' }}></div>
                </div>
                <div style={{ fontSize: '0.6rem', color: '#333' }}>{stats.xp} XP</div>
             </div>
           )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {username && (
            <Link href={`/profile/${username}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <img 
                src={`/avatars/${stats?.avatar || 'avatar1.svg'}`} 
                alt="Avatar" 
                style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid red', objectFit: 'cover' }} 
              />
              <h2 className="logged-in-user" style={{ margin: 0, fontSize: '1.2rem' }}>
                {username}
              </h2>
            </Link>
          )}
          
          {username ? (
            <button 
              onClick={handleLogout} 
              className="red-button"
              style={{ width: 'auto', margin: '0', minWidth: '100px', padding: '8px 15px' }}
            >
              Logout
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link href="/signup" className="red-button" style={{ width: 'auto', margin: '0', minWidth: '100px', padding: '8px 15px' }}>Sign Up</Link>
              <Link href="/login" className="red-button" style={{ width: 'auto', margin: '0', minWidth: '100px', padding: '8px 15px' }}>Log In</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
