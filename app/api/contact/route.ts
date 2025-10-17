import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ 
        error: 'All fields are required.' 
      }, { status: 400 });
    }

    // Log the contact form submission for debugging
    console.log('Contact form submission:', {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString()
    });

    // Check if email configuration is available
    const hasEmailConfig = process.env.SMTP_HOST && 
                          process.env.SMTP_USER && 
                          process.env.SMTP_PASS && 
                          process.env.CONTACT_EMAIL;

    if (hasEmailConfig) {
      try {
        // Create nodemailer transporter
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST ,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          // Additional options for better compatibility
          tls: {
            rejectUnauthorized: false
          }
        });

        // Verify transporter configuration
        await transporter.verify();

        // Send email
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: process.env.CONTACT_EMAIL,
          subject: `Contact Form: ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
                New Contact Form Submission
              </h2>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
              </div>
              
              <div style="margin: 20px 0;">
                <h3 style="color: #374151;">Message:</h3>
                <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #2563eb; border-radius: 4px;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
                <p>This email was sent from your website contact form on ${new Date().toLocaleString()}.</p>
                <p>Reply directly to this email to respond to ${name} at ${email}.</p>
              </div>
            </div>
          `,
          // Also include plain text version
          text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Sent on: ${new Date().toLocaleString()}
          `.trim()
        });

      

        return NextResponse.json({ 
          success: true, 
          message: 'Thank you for your message! We have received your inquiry and will get back to you soon.' 
        });

      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        
        // Still return success to user but log the error
        return NextResponse.json({ 
          success: true, 
          message: 'Thank you for your message! We have received your inquiry and will get back to you soon.',
          note: 'Email delivery may be delayed.'
        });
      }
    } else {
      // No email configuration - just log and return success
      console.log('Email configuration not found. Contact form data logged only.');
      
      return NextResponse.json({ 
        success: true, 
        message: 'Thank you for your message! We have received your inquiry and will get back to you soon.' 
      });
    }

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({ 
      error: 'Failed to send message. Please try again.' 
    }, { status: 500 });
  }
}