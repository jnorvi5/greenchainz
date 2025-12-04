import { NextRequest, NextResponse } from 'next/server';

interface ContactRequest {
  email: string;
  message: string;
  subject?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactRequest = await request.json();
    const { email, message, subject = 'Green Sourcing Inquiry' } = body;

    // Validate input
    if (!email || !message) {
      return NextResponse.json(
        { error: 'Email and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Access server-side environment variable
    const accessToken = process.env.ZOHO_ACCESS_TOKEN;
    
    if (!accessToken) {
      console.error('Zoho access token not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    // Get Zoho account info
    const accountResponse = await fetch('https://mail.zoho.com/api/accounts', {
      method: 'GET',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!accountResponse.ok) {
      console.error('Failed to get Zoho account info');
      return NextResponse.json(
        { error: 'Failed to connect to email service' },
        { status: 500 }
      );
    }

    const accounts = await accountResponse.json();
    const accountId = accounts.data?.[0]?.accountId;

    if (!accountId) {
      console.error('No Zoho Mail account found');
      return NextResponse.json(
        { error: 'Email service account not found' },
        { status: 500 }
      );
    }

    // Send email
    const emailResponse = await fetch(`https://mail.zoho.com/api/accounts/${accountId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        toRecipients: [{ address: 'support@greensourcing.com' }],
        subject: subject,
        content: `From: ${email}\n\n${message}`,
        mailFormat: 'html'
      })
    });

    if (!emailResponse.ok) {
      console.error('Failed to send email via Zoho');
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
