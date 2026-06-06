'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [username, setUsername] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('username');
    if (user !== 'admin') {
      router.push('/');
    } else {
      setUsername(user);
    }
  }, [router]);

  const insertText = (before: string, after: string = '') => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const beforeText = text.substring(0, start);
    const selectedText = text.substring(start, end);
    const afterText = text.substring(end);

    const newContent = beforeText + before + selectedText + after + afterText;
    setContent(newContent);
    
    // Focus back and set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, content, username }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Lesson created successfully!');
        router.push(`/lessons/${data.slug}`);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Error creating lesson');
    }
  };

  if (username !== 'admin') return null;

  return (
    <main className="container">
      <h1>Admin Dashboard</h1>
      <div style={{ background: 'white', padding: '30px', borderRadius: '15px', textAlign: 'left', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ color: 'black' }}>Lesson Editor</h2>
        
        <div style={{ marginBottom: '20px', display: 'flex', gap: '5px', flexWrap: 'wrap', background: '#f0f0f0', padding: '10px', borderRadius: '8px' }}>
          <button type="button" onClick={() => insertText('### ', '')} style={toolBtnStyle}>H3 Heading</button>
          <button type="button" onClick={() => insertText('[TASK]', '[/TASK]')} style={{...toolBtnStyle, background: '#fff9c4', color: '#000'}}>Task Box</button>
          <button type="button" onClick={() => insertText('[TIP]', '[/TIP]')} style={{...toolBtnStyle, background: '#e3f2fd', color: '#000'}}>Pro Tip</button>
          <button type="button" onClick={() => insertText('[CODE]', '[/CODE]')} style={{...toolBtnStyle, background: '#2d2d2d', color: '#fff'}}>Code Block</button>
          <button type="button" onClick={() => {
            const url = prompt('Enter Image URL (e.g., /images/webpage.png):');
            if (url) insertText(`[IMG]${url}[/IMG]`, '');
          }} style={{...toolBtnStyle, background: '#eee', color: '#000'}}>Add Image</button>
          <button type="button" onClick={() => insertText('**', '**')} style={toolBtnStyle}><b>B</b></button>
          <button type="button" onClick={() => insertText('_', '_')} style={toolBtnStyle}><em>I</em></button>
        </div>

        <form onSubmit={handleSubmit} style={{ alignItems: 'stretch' }}>
          <label style={{ color: 'black', fontWeight: 'bold' }}>Lesson Title</label>
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="e.g., Intro to CSS" 
            required 
            style={{ width: '100%', maxWidth: 'none', textAlign: 'left' }}
          />
          
          <label style={{ color: 'black', fontWeight: 'bold', marginTop: '10px' }}>Description</label>
          <input 
            value={description} 
            onChange={e => setDescription(e.target.value)} 
            placeholder="Briefly describe the course" 
            style={{ width: '100%', maxWidth: 'none', textAlign: 'left' }}
          />

          <label style={{ color: 'black', fontWeight: 'bold', marginTop: '10px' }}>Content</label>
          <textarea 
            ref={textareaRef}
            value={content} 
            onChange={e => setContent(e.target.value)} 
            placeholder="Use the toolbar above to format your lesson..." 
            required 
            style={{ width: '100%', maxWidth: 'none', height: '400px', textAlign: 'left', padding: '15px', fontFamily: 'monospace' }}
          />

          <button type="submit" className="red-button" style={{ width: '100%', marginTop: '20px' }}>Publish Lesson</button>
        </form>
      </div>
      <Link href="/" className="red-button" style={{ marginTop: '20px' }}>Back to Home</Link>
    </main>
  );
}

const toolBtnStyle: React.CSSProperties = {
  padding: '5px 10px',
  fontSize: '0.8rem',
  cursor: 'pointer',
  border: '1px solid #ccc',
  borderRadius: '4px',
  background: 'white',
  width: 'auto',
  margin: '0',
  minWidth: '0'
};
