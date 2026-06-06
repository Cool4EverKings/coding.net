import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const result = await pool.query('SELECT * FROM users WHERE usersNAME = $1', [username]);
    
    if (result.rows.length === 0) {
      return Response.json({ success: false, message: 'Invalid username' }, { status: 401 });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.userspwd);

    if (!isPasswordValid) {
      return Response.json({ success: false, message: 'Invalid password' }, { status: 401 });
    }

    return Response.json({ success: true, username: user.usersname, xp: user.usersxp });
  } catch (error: any) {
    console.error('Login error:', error);
    return Response.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
