import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return Response.json({ success: false, message: 'Missing postId' }, { status: 400 });
    }

    const result = await pool.query(`
      SELECT comments.*, users.usersAVATAR 
      FROM comments 
      LEFT JOIN users ON comments.commentsUSER = users.usersNAME 
      WHERE commentsPOST = $1 
      ORDER BY commentsID ASC
    `, [postId]);
    return Response.json(result.rows);
  } catch (error: any) {
    console.error('Fetch comments error:', error);
    return Response.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { postId, content, username } = await request.json();

    if (!postId || !content || !username) {
      return Response.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    await pool.query('INSERT INTO comments (commentsPOST, commentsUSER, commentsCONTENT) VALUES ($1, $2, $3)', [postId, username, content]);
    await pool.query('UPDATE users SET usersXP = usersXP + 20 WHERE usersNAME = $1', [username]);

    return Response.json({ success: true });
  } catch (error: any) {
    console.error('Create comment error:', error);
    return Response.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
