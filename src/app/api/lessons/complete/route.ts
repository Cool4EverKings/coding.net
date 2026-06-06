import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { username, slug } = await request.json();

    if (!username || !slug) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    // Check if user already finished this lesson
    const alreadyFinished = db.prepare('SELECT * FROM lesson_completions WHERE username = ? AND lessonSLUG = ?').get(username, slug);
    
    if (alreadyFinished) {
      return NextResponse.json({ success: false, message: 'You have already earned XP for this lesson!' });
    }

    // Record completion and award XP in a transaction
    const transaction = db.transaction(() => {
      db.prepare('INSERT INTO lesson_completions (username, lessonSLUG) VALUES (?, ?)').run(username, slug);
      db.prepare('UPDATE users SET usersXP = usersXP + 100 WHERE usersNAME = ?').run(username);
    });
    
    transaction();

    return NextResponse.json({ success: true, message: 'Lesson completed! +100 XP awarded!' });
  } catch (error) {
    console.error('Completion error:', error);
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
