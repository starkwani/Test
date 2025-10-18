import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { SignJWT } from 'jose';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'Elvenescapestourandtravels@gmail.com';
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production-min-32-chars-required'
);

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized email' }, { status: 403 });
    }

    if (!otp || otp.length !== 6) {
      return NextResponse.json({ error: 'Invalid OTP format' }, { status: 400 });
    }

    try {
      const client = await clientPromise;
      const db = client.db('tour-website');

      const otpRecord = await db.collection('otp_verifications').findOne({
        email,
        otp,
        verified: false,
        expiresAt: { $gt: new Date() }
      });

      if (!otpRecord) {
        return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 401 });
      }

      await db.collection('otp_verifications').updateOne(
        { _id: otpRecord._id },
        { $set: { verified: true, verifiedAt: new Date() } }
      );

      const token = await new SignJWT({ email, role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(JWT_SECRET);

      await db.collection('admin_sessions').insertOne({
        email,
        token,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        active: true
      });

      const response = NextResponse.json({
        success: true,
        message: 'OTP verified successfully',
        token
      });

      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 86400,
        path: '/'
      });

      return response;
    } catch (mongoError) {
      console.error('MongoDB error:', mongoError);
      return NextResponse.json({
        error: 'Database error. Please contact administrator.'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}
