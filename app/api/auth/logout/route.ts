import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin_token')?.value;

    if (token) {
      try {
        const client = await clientPromise;
        const db = client.db('tour-website');

        await db.collection('admin_sessions').updateOne(
          { token },
          { $set: { active: false, loggedOutAt: new Date() } }
        );
      } catch (mongoError) {
        console.warn('Failed to invalidate session in database:', mongoError);
      }
    }

    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

    response.cookies.set('admin_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
