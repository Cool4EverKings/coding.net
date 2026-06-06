import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing id' }, { status: 400 });
    }

    const result = await pool.query('SELECT * FROM posts WHERE postsID = $1', [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Fetch post error:', error);
    return NextResponse.json({ success: false, message: 'Database error' }, { status: 500 });
  }
}
