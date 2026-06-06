'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Lesson {
  lessonTITLE: string;
  lessonDESCRIPTION: string;
  lessonCONTENT: string;
}

export default function DynamicLesson() {
  const params = useParams();
  const slug = params.slug;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/lessons/single?slug=${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.lessonTITLE) setLesson(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleComplete = async () => {
    const username = localStorage.getItem('username');
    if (!username) {
      alert('Log in to earn XP!');
      return;
    }

    try {
      const res = await fetch('/api/lessons/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, slug })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Error completing lesson:', err);
    }
  };

  const parseContent = (text: string) => {
    // Regex based parsing for our custom tags
    const lines = text.split('\n');
    let inTask = false;
    let inTip = false;
    let inCode = false;

    return text.split(/(\[TASK\]|\[\/TASK\]|\[TIP\]|\[\/TIP\]|\[CODE\]|\[\/CODE\]|\[IMG\].*?\[\/IMG\]|### .*?\n)/g).map((part, i) => {
      if (part === '[TASK]') { inTask = true; return null; }
      if (part === '[/TASK]') { inTask = false; return null; }
      if (part === '[TIP]') { inTip = true; return null; }
      if (part === '[/TIP]') { inTip = false; return null; }
      if (part === '[CODE]') { inCode = true; return null; }
      if (part === '[/CODE]') { inCode = false; return null; }

      if (part.startsWith('### ')) {
        return <h3 key={i} style={{ borderBottom: '2px solid #eee', paddingBottom: '10px', marginTop: '30px' }}>{part.replace('### ', '')}</h3>;
      }

      if (part.startsWith('[IMG]') && part.endsWith('[/IMG]')) {
        const url = part.replace('[IMG]', '').replace('[/IMG]', '');
        return <div key={i} style={{ textAlign: 'center', margin: '30px 0' }}><img src={url} alt="Lesson Image" style={{ maxWidth: '100%', borderRadius: '10px', border: '1px solid #ddd' }} /></div>;
      }

      if (!part.trim()) return null;

      if (inTask) {
        return <div key={i} style={{ background: '#fff9c4', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #fbc02d', margin: '20px 0', color: '#000' }}><strong>Task:</strong> {part}</div>;
      }
      if (inTip) {
        return <div key={i} style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #2196f3', margin: '20px 0', color: '#000' }}><strong>Pro Tip:</strong> {part}</div>;
      }
      if (inCode) {
        return <div key={i} style={{ background: '#2d2d2d', padding: '20px', borderRadius: '10px', color: '#fff', fontFamily: 'monospace', margin: '20px 0', whiteSpace: 'pre-wrap' }}>{part}</div>;
      }

      return <p key={i} style={{ lineHeight: '1.8', margin: '15px 0', whiteSpace: 'pre-wrap' }}>{part}</p>;
    });
  };

  if (loading) return <main className="container"><p>Loading lesson...</p></main>;
  if (!lesson) return <main className="container"><h1>Lesson not found</h1><Link href="/" className="red-button">Back to Home</Link></main>;

  return (
    <main className="container" style={{ textAlign: 'left', maxWidth: '900px' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '10px' }}>{lesson.lessonTITLE}</h1>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem', marginBottom: '40px' }}>
          {lesson.lessonDESCRIPTION}
        </p>

        <section style={{ borderLeft: '5px solid red', paddingLeft: '20px', marginBottom: '30px' }}>
          {parseContent(lesson.lessonCONTENT)}
        </section>

        <div style={{ textAlign: 'center', marginTop: '50px', borderTop: '2px solid #eee', paddingTop: '30px' }}>
          {localStorage.getItem('username') === 'admin' && (
            <Link href={`/lessons/${slug}/edit`} className="red-button" style={{ background: '#333', marginBottom: '10px' }}>Edit Lesson</Link>
          )}
          <button onClick={handleComplete} className="red-button" style={{ display: 'inline-block', marginBottom: '10px', background: 'green' }}>
            Complete Lesson (+100 XP)
          </button>
          <br />
          <Link href="/" className="red-button" style={{ display: 'inline-block' }}>Go Home</Link>
        </div>

        <footer style={{ textAlign: 'center', color: '#999', marginTop: '40px' }}>
          <small>&copy; 2026 Spencer Dean</small>
        </footer>
      </div>
    </main>
  );
}
