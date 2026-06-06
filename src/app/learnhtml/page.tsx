'use client';

import React from 'react';
import Link from 'next/link';

export default function LearnHTML() {
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
        body: JSON.stringify({ username, slug: 'learn-html' })
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

  return (
    <main className="container" style={{ textAlign: 'left', maxWidth: '900px' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '10px' }}>Learn HTML</h1>
        <p style={{ textAlign: 'center', color: '#666', fontSize: '1.2rem', marginBottom: '40px' }}>
          Master the building blocks of the web.
        </p>

        <section style={{ marginBottom: '40px', borderLeft: '5px solid red', paddingLeft: '20px' }}>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
            HTML stands for <strong>HyperText Markup Language</strong>. 
            Throughout this course, you will learn the fundamentals of this language and how it structures everything you see online.
          </p>
        </section>

        <section className="lesson-step" style={{ marginBottom: '60px' }}>
          <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>1. The First Heading</h2>
          <p>Let's start with the basics. The simple <code>&lt;h1&gt;</code> tag displays a main heading on the page.</p>
          
          <div style={{ margin: '30px 0', textAlign: 'center' }}>
            <p style={{ fontWeight: 'bold', color: '#666' }}>What it looks like:</p>
            <img src="/images/heading.png" alt="Heading Example" style={{ maxWidth: '100%', border: '1px solid #ddd' }} />
          </div>

          <div style={{ margin: '30px 0' }}>
            <p style={{ fontWeight: 'bold', color: '#666' }}>The Code:</p>
            <div style={{ background: '#2d2d2d', padding: '20px', borderRadius: '10px', color: '#fff', position: 'relative' }}>
                <img src="/images/thecode.png" alt="Code Example" style={{ width: '100%', borderRadius: '5px', margin: '0' }} />
            </div>
          </div>

          <p style={{ background: '#fff9c4', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #fbc02d' }}>
            <strong>Task:</strong> Type this code into your text editor, ensure the encoding is set to <strong>UTF-8</strong>, and save it as an <code>.html</code> file.
          </p>
        </section>

        <section className="lesson-step" style={{ marginBottom: '60px' }}>
          <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>2. Adding Paragraphs</h2>
          <p>Next, we use the <code>&lt;p&gt;</code> tag to display regular text or paragraphs.</p>
          
          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', fontFamily: 'monospace', margin: '20px 0', border: '1px solid #e9ecef' }}>
            &lt;p&gt;This is a paragraph.&lt;/p&gt;
          </div>

          <div style={{ textAlign: 'center', margin: '30px 0' }}>
             <img src="/images/thecodetwo.png" alt="Paragraph Code Example" style={{ maxWidth: '100%' }} />
          </div>

          <p>
            The <code>&lt;h1&gt;</code> tag is for your main title, while <code>&lt;p&gt;</code> tags handle the bulk of your content. 
            Properly using these tags helps search engines and browsers understand your website's structure.
          </p>
        </section>

        <section className="lesson-step" style={{ marginBottom: '60px' }}>
          <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: '10px' }}>3. Creating Links</h2>
          <p>Websites wouldn't be "web" without links! We use the <code>&lt;a&gt;</code> (anchor) tag for this.</p>

          <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', fontFamily: 'monospace', margin: '20px 0', border: '1px solid #e9ecef' }}>
            &lt;a href="https://www.khanacademy.org"&gt;Khan Academy&reg;&lt;/a&gt;
          </div>

          <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #2196f3', marginBottom: '20px' }}>
            <strong>Pro Tip:</strong> <code>href</code> stands for <em>Hypertext Reference</em>. It tells the browser exactly which URL to go to.
          </div>

          <div style={{ textAlign: 'center', margin: '30px 0' }}>
            <img src="/images/webpage.png" alt="Webpage Example" style={{ maxWidth: '100%' }} />
          </div>
        </section>

        <section style={{ textAlign: 'center', padding: '40px 0', borderTop: '2px solid #eee' }}>
          <p style={{ fontStyle: 'italic', marginBottom: '20px' }}>Before you go, here's a little motivation:</p>
          <img id="memeone" src="/images/memeOne.png" alt="Meme" style={{ maxWidth: '400px', borderRadius: '15px' }} />
          
          <div style={{ marginTop: '50px' }}>
            <button onClick={handleComplete} className="red-button" style={{ display: 'inline-block', marginBottom: '10px', background: 'green' }}>
                Complete Lesson (+100 XP)
            </button>
            <br />
            <Link href="/" className="red-button" style={{ display: 'inline-block' }}>Finish Lesson & Go Home</Link>
          </div>
        </section>

        <footer style={{ textAlign: 'center', color: '#999', marginTop: '40px' }}>
          <small>&copy; 2026 Spencer Dean</small>
        </footer>
      </div>
    </main>
  );
}
