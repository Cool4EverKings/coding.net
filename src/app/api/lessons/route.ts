import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM lessons ORDER BY lessonID DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, description, content, username } = await request.json();

    if (username !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    await pool.query(`
      INSERT INTO lessons (lessonTITLE, lessonSLUG, lessonDESCRIPTION, lessonCONTENT, lessonCREATED_BY)
      VALUES ($1, $2, $3, $4, $5)
    `, [title, slug, description, content, username]);

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error('Lesson creation error:', error);
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
