import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { commentId, username } = await request.json();

    if (!commentId || !username) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    // Check if already liked
    const alreadyLiked = await pool.query('SELECT * FROM comment_likes WHERE commentID = $1 AND username = $2', [commentId, username]);

    if (alreadyLiked.rows.length > 0) {
      return NextResponse.json({ success: false, message: 'Already liked' }, { status: 400 });
    }

    // Transactional-like behavior using a client
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('INSERT INTO comment_likes (commentID, username) VALUES ($1, $2)', [commentId, username]);
      await client.query('UPDATE comments SET commentsLIKES = commentsLIKES + 1 WHERE commentsID = $1', [commentId]);
      await client.query('UPDATE users SET usersXP = usersXP + 10 WHERE usersNAME = $1', [username]);
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Like error:', error);
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
