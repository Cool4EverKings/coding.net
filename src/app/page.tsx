'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Lesson {
  lessonID: number;
  lessonTITLE: string;
  lessonSLUG: string;
  lessonDESCRIPTION: string;
}

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    setUsername(localStorage.getItem('username'));
    fetch('/api/lessons')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLessons(data);
      });
  }, []);

  const handleClick = () => {
    alert("YOU CLICKED SOMETHING");
  };

  return (
    <main className="container">
      <h1>Welcome to Coding.net!</h1>

      <h2>About</h2>

      <p id="p1i" className="pc">
        Coding.net is the best place to learn about coding!<br />
        Our mission is to provide free world class programming to all!
      </p>

      {username === 'admin' && (
        <div style={{ margin: '20px 0', border: '2px dashed red', padding: '20px', borderRadius: '15px' }}>
          <h3>Admin Panel</h3>
          <Link href="/admin" className="red-button">Create New Lesson</Link>
        </div>
      )}

      <Link href="/more" className="red-button">More</Link>

      <h2 style={{ marginTop: '40px' }}>Course Catalog</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
        <Link href="/learnhtml" className="red-button">Learn HTML (Core)</Link>
        
        {lessons.map(lesson => (
          <Link key={lesson.lessonID} href={`/lessons/${lesson.lessonSLUG}`} className="red-button">
            {lesson.lessonTITLE}
          </Link>
        ))}
      </div>
      
      {username ? (
        <Link href="/community" className="red-button" style={{ marginTop: '30px' }}>Community</Link>
      ) : (
        <Link href="/login?id=community" className="red-button" style={{ marginTop: '30px' }}>
          Login To Access Community Forums
        </Link>
      )}

      <small>&copy; 2026 Spencer Dean &copy;</small>

      <div onClick={handleClick} style={{ cursor: 'pointer', height: '20px' }}></div>
    </main>
  );
}
