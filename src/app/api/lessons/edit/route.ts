import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(request: Request) {
  try {
    const { lessonID, title, description, content, username } = await request.json();

    if (username !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    db.prepare(`
      UPDATE lessons 
      SET lessonTITLE = ?, lessonDESCRIPTION = ?, lessonCONTENT = ? 
      WHERE lessonID = ?
    `).run(title, description, content, lessonID);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
