import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ success: false, message: 'Missing username' }, { status: 400 });
    }

    const user: any = db.prepare('SELECT usersNAME, usersXP, usersBIO, usersAVATAR FROM users WHERE usersNAME = ?').get(username);
    
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Formula: Level = floor(sqrt(XP / 100)) + 1
    const xp = user.usersXP || 0;
    const level = Math.floor(Math.sqrt(xp / 100)) + 1;
    const nextLevelXP = Math.pow(level, 2) * 100;
    const currentLevelBaseXP = Math.pow(level - 1, 2) * 100;
    const progress = ((xp - currentLevelBaseXP) / (nextLevelXP - currentLevelBaseXP)) * 100;

    return NextResponse.json({ 
      success: true, 
      username: user.usersNAME,
      xp: xp, 
      bio: user.usersBIO || "No bio yet.",
      avatar: user.usersAVATAR || "avatar1.png",
      level: level,
      progress: Math.min(100, Math.max(0, progress))
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { username, bio, avatar } = await request.json();

    if (!username) {
      return NextResponse.json({ success: false, message: 'Missing username' }, { status: 400 });
    }

    db.prepare('UPDATE users SET usersBIO = ?, usersAVATAR = ? WHERE usersNAME = ?')
      .run(bio, avatar, username);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
