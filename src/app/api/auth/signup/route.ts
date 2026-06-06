import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
    }

    // Check if user exists
    const userExists: any = db.prepare('SELECT * FROM users WHERE usersNAME = ?').get(username);
    if (userExists) {
      return NextResponse.json({ success: false, message: 'Username already taken' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    db.prepare('INSERT INTO users (usersNAME, usersEMAIL, usersPWD) VALUES (?, ?, ?)').run(username, email, hashedPassword);

    return NextResponse.json({ success: true, username, xp: 0 });
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
