import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { commentId, username } = await request.json();

    if (!commentId || !username) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    // Check if already liked
    const alreadyLiked = db.prepare('SELECT * FROM comment_likes WHERE commentID = ? AND username = ?').get(commentId, username);

    if (alreadyLiked) {
      // If already liked, we'll "unlike" it (toggle behavior is often preferred)
      // But the user said "each user can only do it once", so I'll just prevent multiple likes.
      // Or I could return an error. Let's do: if liked, do nothing or return a message.
      return NextResponse.json({ success: false, message: 'Already liked' }, { status: 400 });
    }

    // Transaction for atomicity
    const transaction = db.transaction(() => {
      db.prepare('INSERT INTO comment_likes (commentID, username) VALUES (?, ?)').run(commentId, username);
      db.prepare('UPDATE comments SET commentsLIKES = commentsLIKES + 1 WHERE commentsID = ?').run(commentId);
      db.prepare('UPDATE users SET usersXP = usersXP + 10 WHERE usersNAME = ?').run(username);
    });

    transaction();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Like error:', error);
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
