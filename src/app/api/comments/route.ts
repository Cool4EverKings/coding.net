import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ success: false, message: 'Missing postId' }, { status: 400 });
    }

    const rows = db.prepare(`
      SELECT comments.*, users.usersAVATAR 
      FROM comments 
      LEFT JOIN users ON comments.commentsUSER = users.usersNAME 
      WHERE commentsPOST = ? 
      ORDER BY commentsID ASC
    `).all(postId);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Fetch comments error:', error);
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { postId, content, username } = await request.json();

    if (!postId || !content || !username) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    db.prepare('INSERT INTO comments (commentsPOST, commentsUSER, commentsCONTENT) VALUES (?, ?, ?)')
      .run(postId, username, content);
    db.prepare('UPDATE users SET usersXP = usersXP + 20 WHERE usersNAME = ?').run(username);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Create comment error:', error);
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
