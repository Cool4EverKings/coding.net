import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ success: false, message: 'Missing username' }, { status: 400 });
    }

    const result = await pool.query('SELECT usersXP FROM users WHERE usersNAME = $1', [username]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const user = result.rows[0];

    // Formula: Level = floor(sqrt(XP / 100)) + 1
    const xp = user.usersxp || 0;
    const level = Math.floor(Math.sqrt(xp / 100)) + 1;
    const nextLevelXP = Math.pow(level, 2) * 100;
    const currentLevelBaseXP = Math.pow(level - 1, 2) * 100;
    
    const progress = ((xp - currentLevelBaseXP) / (nextLevelXP - currentLevelBaseXP)) * 100;

    return NextResponse.json({ 
      success: true, 
      xp: xp, 
      level: level,
      nextLevelXP: nextLevelXP,
      progress: Math.min(100, Math.max(0, progress))
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
