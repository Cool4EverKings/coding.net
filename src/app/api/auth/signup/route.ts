import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return Response.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    // Check if user exists
    const userExists = await pool.query('SELECT * FROM users WHERE usersname = $1', [username]);
    if (userExists.rows.length > 0) {
      return Response.json({ success: false, message: 'Username already taken' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await pool.query(
      'INSERT INTO users (usersname, usersemail, userspwd) VALUES ($1, $2, $3)',
      [username, email, hashedPassword]
    );

    return Response.json({ success: true, username, xp: 0 });
  } catch (error: any) {
    console.error('Signup error:', error);
    return Response.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
