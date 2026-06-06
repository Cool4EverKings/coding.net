'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Lesson {
  lessonID: number;
  lessonTITLE: string;
  lessonDESCRIPTION: string;
  lessonCONTENT: string;
}

export default function EditLesson() {
  const params = useParams();
  const slug = params.slug;
  const router = useRouter();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [username, setUsername] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setUsername(localStorage.getItem('username'));
    fetch(`/api/lessons/single?slug=${slug}`)
      .then(res => res.json())
      .then(data => {
        setLesson(data);
        setTitle(data.lessonTITLE);
        setDescription(data.lessonDESCRIPTION);
        setContent(data.lessonCONTENT);
      });
  }, [slug]);

  const insertText = (before: string, after: string = '') => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    setContent(text.substring(0, start) + before + text.substring(start, end) + after + text.substring(end));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username !== 'admin') return;

    const res = await fetch('/api/lessons/edit', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonID: lesson?.lessonID, title, description, content, username }),
    });

    if (res.ok) {
      alert('Lesson updated!');
      router.push(`/lessons/${slug}`);
    }
  };

  if (username !== 'admin') return <main className="container"><h1>Access Denied</h1></main>;

  return (
    <main className="container">
      <h1>Edit Lesson: {lesson?.lessonTITLE}</h1>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '30px', borderRadius: '15px', maxWidth: '800px', margin: '0 auto' }}>
        <input value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', marginBottom: '10px' }} />
        <textarea ref={textareaRef} value={content} onChange={e => setContent(e.target.value)} required style={{ width: '100%', height: '400px' }} />
        <button type="submit" className="red-button">Update Lesson</button>
      </form>
    </main>
  );
}
