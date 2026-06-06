import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const user: any = db.prepare('SELECT * FROM users WHERE usersNAME = ?').get(username);
    
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid username' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.usersPWD);

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
    }

    return NextResponse.json({ success: true, username: user.usersNAME, xp: user.usersXP });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
