import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT posts.*, users.usersAVATAR 
      FROM posts 
      LEFT JOIN users ON posts.postsUSER = users.usersNAME 
      ORDER BY postsID DESC
    `);
    return Response.json(result.rows);
  } catch (error: any) {
    console.error('Fetch posts error:', error);
    return Response.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { content, username } = await request.json();

    if (!content || !username) {
      return Response.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    await pool.query('INSERT INTO posts (postsCONTENT, postsUSER) VALUES ($1, $2)', [content, username]);
    await pool.query('UPDATE users SET usersXP = usersXP + 50 WHERE usersNAME = $1', [username]);

    return Response.json({ success: true });
  } catch (error: any) {
    console.error('Create post error:', error);
    return Response.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
