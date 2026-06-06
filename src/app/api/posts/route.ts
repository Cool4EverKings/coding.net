import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const rows = db.prepare(`
      SELECT posts.*, users.usersAVATAR 
      FROM posts 
      LEFT JOIN users ON posts.postsUSER = users.usersNAME 
      ORDER BY postsID DESC
    `).all();
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Fetch posts error:', error);
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { content, username } = await request.json();

    if (!content || !username) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    db.prepare('INSERT INTO posts (postsCONTENT, postsUSER) VALUES (?, ?)').run(content, username);
    db.prepare('UPDATE users SET usersXP = usersXP + 50 WHERE usersNAME = ?').run(username);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Create post error:', error);
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
