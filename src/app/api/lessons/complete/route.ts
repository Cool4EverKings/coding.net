import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { username, slug } = await request.json();

    if (!username || !slug) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    // Check if user already finished this lesson
    const alreadyFinished = await pool.query(
      'SELECT * FROM lesson_completions WHERE username = $1 AND lessonSLUG = $2', 
      [username, slug]
    );
    
    if (alreadyFinished.rows.length > 0) {
      return NextResponse.json({ success: false, message: 'You have already earned XP for this lesson!' });
    }

    // Record completion and award XP in a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('INSERT INTO lesson_completions (username, lessonSLUG) VALUES ($1, $2)', [username, slug]);
      await client.query('UPDATE users SET usersXP = usersXP + 100 WHERE usersNAME = $1', [username]);
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    return NextResponse.json({ success: true, message: 'Lesson completed! +100 XP awarded!' });
  } catch (error) {
    console.error('Completion error:', error);
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
