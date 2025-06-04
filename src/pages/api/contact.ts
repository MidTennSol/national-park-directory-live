import type { APIRoute } from 'astro';
// Ensure environment variables are loaded
import '../../../src/env.js';

// Ensure this API route is not prerendered
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  console.log('🔍 Contact API endpoint hit');
  console.log('📋 Request details:', {
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    url: request.url
  });
  
  try {
    // Check if request has a body
    const contentType = request.headers.get('content-type');
    console.log('📦 Content-Type:', contentType);
    
    // Log raw body first
    const rawText = await request.text();
    console.log('📝 Raw request body:', rawText);
    console.log('📏 Raw body length:', rawText.length);
    
    // Parse the request body
    let body;
    try {
      if (!rawText) {
        throw new Error('Empty request body');
      }
      body = JSON.parse(rawText);
      console.log('📥 Request body parsed successfully:', body);
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError);
      console.error('❌ Raw text was:', JSON.stringify(rawText));
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Invalid request format. Expected JSON data.' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log('❌ Validation failed - missing fields:', { name: !!name, email: !!email, subject: !!subject, message: !!message });
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'All fields are required' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Please enter a valid email address' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Basic spam protection
    if (message.length > 5000) {
      console.log('❌ Message too long:', message.length);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Message is too long' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Log the message (always do this for debugging)
    console.log('=== NEW CONTACT FORM SUBMISSION ===');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('Timestamp:', new Date().toISOString());
    console.log('=====================================');

    // Send email via Resend
    const RESEND_API_KEY = 're_AJFu9C1q_K4CPyMk1Y7BNU31Aj46DoMne';

    try {
      console.log('📧 Initializing Resend with API key...');
      const { Resend } = await import('resend');
      const resend = new Resend(RESEND_API_KEY);
      
      console.log('📧 Attempting to send email via Resend...');
      
      const { data, error } = await resend.emails.send({
        from: 'National Park Directory <onboarding@resend.dev>', // Using Resend's test domain
        to: ['josh@middletennsolutions.com'],
        subject: `Contact Form: ${subject}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><em>Sent from National Park Directory contact form</em></p>
        `,
        text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}
Message: ${message}

---
Sent from National Park Directory contact form
        `
      });

      if (error) {
        console.error('❌ Resend error:', error);
        throw new Error(`Email service error: ${error.message}`);
      }

      console.log('✅ Email sent successfully via Resend:', data);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Thank you for your message! We\'ve received it and will get back to you soon.' 
        }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );

    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'We received your message but couldn\'t send the email notification. Error: ' + emailError.message 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error) {
    console.error('❌ Contact form error:', error);
    console.error('❌ Error stack:', error.stack);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: 'Something went wrong. Please try again or contact us directly.' 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}; 