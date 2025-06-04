import type { APIRoute } from 'astro';
// Ensure environment variables are loaded
import '../../env.js';

export const GET: APIRoute = async () => {
  console.log('=== ENVIRONMENT VARIABLE TEST ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
  console.log('RESEND_API_KEY length:', process.env.RESEND_API_KEY?.length || 0);
  console.log('RESEND_API_KEY starts with re_:', process.env.RESEND_API_KEY?.startsWith('re_') || false);
  console.log('All env keys containing RESEND:', Object.keys(process.env).filter(key => key.includes('RESEND')));
  console.log('================================');

  return new Response(
    JSON.stringify({ 
      hasResendKey: !!process.env.RESEND_API_KEY,
      keyLength: process.env.RESEND_API_KEY?.length || 0,
      startsWithRe: process.env.RESEND_API_KEY?.startsWith('re_') || false,
      nodeEnv: process.env.NODE_ENV
    }),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}; 