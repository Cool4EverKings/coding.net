import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request: Request) {
  try {
    const { lessonID, title, description, content, username } = await request.json();

    if (username !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    await pool.query(`
      UPDATE lessons 
      SET lessonTITLE = $1, lessonDESCRIPTION = $2, lessonCONTENT = $3 
      WHERE lessonID = $4
    `, [title, description, content, lessonID]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
