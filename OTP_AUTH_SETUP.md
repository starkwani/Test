# Admin OTP Authentication Setup Guide

## Overview

Your admin panel now uses secure OTP (One-Time Password) authentication instead of the previous vulnerable password system. This guide explains how to configure and use the new system.

## Security Fix

**What was broken:**
The old login route (`/api/auth/login/route.ts`) had a critical security vulnerability where the code used `||` (OR operator) instead of `===` (equals), allowing ANY email and password to authenticate.

**What was fixed:**
- Removed the insecure password-based authentication
- Implemented OTP verification via email
- OTP codes are stored in MongoDB with expiration times
- Each OTP is valid for 10 minutes only
- OTPs are single-use and marked as verified after successful login

## Required Environment Variables

Add these to your Vercel environment variables:

### 1. Admin Email (Required)
```
ADMIN_EMAIL=Elvenescapestourandtravels@gmail.com
```
This is the ONLY email that can access the admin panel. You can change this to any email you want.

### 2. Email Configuration (Required for sending OTPs)
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
```

**How to get Gmail App Password:**
1. Go to your Google Account settings
2. Enable 2-Factor Authentication if not already enabled
3. Go to: https://myaccount.google.com/apppasswords
4. Generate a new App Password for "Mail"
5. Use that 16-character password as `EMAIL_PASS`

### 3. MongoDB URI (Required for OTP storage)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tour-website
```

Your MongoDB database should already be configured. The system will create an `otp_verifications` collection automatically.

## MongoDB Collection Structure

The system creates an `otp_verifications` collection with this structure:

```javascript
{
  email: "admin@example.com",
  otp: "123456",
  expiresAt: ISODate("2025-10-18T12:30:00Z"),
  createdAt: ISODate("2025-10-18T12:20:00Z"),
  verified: false,
  verifiedAt: ISODate("2025-10-18T12:25:00Z") // Added after verification
}
```

## How It Works

### User Flow:

1. **Access Admin Panel**
   - Navigate to `/admin`
   - See the login screen

2. **Enter Email**
   - Enter your admin email (must match `ADMIN_EMAIL`)
   - Click "Send OTP"

3. **Receive OTP**
   - Check your email inbox
   - You'll receive a 6-digit OTP code
   - OTP is valid for 10 minutes

4. **Verify OTP**
   - Enter the 6-digit code
   - Click "Verify OTP"
   - On success, you're logged into the admin panel

5. **Resend or Change Email**
   - Can request a new OTP if needed
   - Can change email if entered wrong address

### API Endpoints:

**POST `/api/auth/send-otp`**
- Validates email matches `ADMIN_EMAIL`
- Generates 6-digit OTP
- Stores in MongoDB with 10-minute expiration
- Sends OTP via email
- Returns success/error response

**POST `/api/auth/verify-otp`**
- Validates email matches `ADMIN_EMAIL`
- Checks OTP exists, not expired, and not used
- Marks OTP as verified
- Returns success/error response

## Security Features

1. **Email Validation**: Only the configured admin email can receive OTPs
2. **Time-Limited**: OTPs expire after 10 minutes
3. **Single-Use**: Each OTP can only be used once
4. **Database Cleanup**: Old OTPs are deleted before generating new ones
5. **No Client-Side Bypass**: Authentication state is verified server-side
6. **Secure Storage**: OTPs stored in MongoDB, not in localStorage or cookies

## Local Development

For local development, ensure your `.env.local` file has:

```
ADMIN_EMAIL=Elvenescapestourandtravels@gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tour-website
```

## Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add all required variables:
   - `ADMIN_EMAIL`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `MONGODB_URI` (should already exist)
4. Redeploy your application

## Testing

1. Go to `/admin`
2. Enter the email from `ADMIN_EMAIL`
3. Check your email for the OTP
4. Enter the OTP to login

## Troubleshooting

**OTP not received:**
- Check spam/junk folder
- Verify `EMAIL_USER` and `EMAIL_PASS` are correct
- Verify Gmail App Password is active
- Check Vercel logs for email sending errors

**"Unauthorized email" error:**
- Verify the email you entered matches `ADMIN_EMAIL` exactly
- Check for typos or extra spaces

**"Invalid or expired OTP" error:**
- OTP may have expired (10 minutes)
- OTP may have been used already
- Request a new OTP

**MongoDB connection errors:**
- Verify `MONGODB_URI` is correct
- Check MongoDB cluster is running
- Verify network access is allowed in MongoDB Atlas

## Migration Notes

The old insecure login route has been removed. If you had any bookmarks or scripts using `/api/auth/login`, they will no longer work and need to be updated to use the new OTP flow.

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables are set correctly
3. Test MongoDB connection
4. Verify email credentials with Gmail
