import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'Elvenescapestourandtravels@gmail.com';

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

      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully'
      });
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
