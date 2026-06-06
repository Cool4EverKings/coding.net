import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return Response.json({ success: false, message: 'Missing username' }, { status: 400 });
    }

    const result = await pool.query('SELECT usersNAME, usersXP, usersBIO, usersAVATAR FROM users WHERE usersNAME = $1', [username]);
    
    if (result.rows.length === 0) {
      return Response.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const user = result.rows[0];

    // Formula: Level = floor(sqrt(XP / 100)) + 1
    const xp = user.usersxp || 0;
    const level = Math.floor(Math.sqrt(xp / 100)) + 1;
    const nextLevelXP = Math.pow(level, 2) * 100;
    const currentLevelBaseXP = Math.pow(level - 1, 2) * 100;
    const progress = ((xp - currentLevelBaseXP) / (nextLevelXP - currentLevelBaseXP)) * 100;

    return Response.json({ 
      success: true, 
      username: user.usersname,
      xp: xp, 
      bio: user.usersbio || "No bio yet.",
      avatar: user.usersavatar || "avatar1.svg",
      level: level,
      progress: Math.min(100, Math.max(0, progress))
    });
  } catch (error) {
    return Response.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { username, bio, avatar } = await request.json();

    if (!username) {
      return Response.json({ success: false, message: 'Missing username' }, { status: 400 });
    }

    await pool.query('UPDATE users SET usersBIO = $1, usersAVATAR = $2 WHERE usersNAME = $3', [bio, avatar, username]);

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
