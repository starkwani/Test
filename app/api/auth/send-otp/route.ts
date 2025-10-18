import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import nodemailer from 'nodemailer';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'Elvenescapestourandtravels@gmail.com';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Unauthorized email' }, { status: 403 });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    try {
      const client = await clientPromise;
      const db = client.db('tour-website');

      await db.collection('otp_verifications').deleteMany({ email });

      await db.collection('otp_verifications').insertOne({
        email,
        otp,
        expiresAt,
        createdAt: new Date(),
        verified: false
      });
    } catch (mongoError) {
      console.warn('MongoDB not available, OTP not persisted:', mongoError);
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Admin Login OTP - Wanderlust Tours',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Admin Login Verification</h2>
            <p>Your OTP for admin login is:</p>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #666;">This OTP is valid for 10 minutes.</p>
            <p style="color: #999; font-size: 12px;">If you didn't request this OTP, please ignore this email.</p>
          </div>
        `,
      });

      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully',
        expiresAt: expiresAt.toISOString()
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return NextResponse.json({
        error: 'Failed to send OTP email. Please check email configuration.'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
