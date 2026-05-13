import { NextResponse } from 'next/server';



export async function GET() {
  const envStatus = {
    SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    ANTHROPIC_KEY: !!process.env.ANTHROPIC_API_KEY,
    GEMINI_KEY: !!process.env.GEMINI_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
    PROVIDER: process.env.NEXT_RUNTIME === 'edge' ? 'Edge' : 'Node.js',
  };

  return NextResponse.json({
    status: 'Ready to debug',
    env: envStatus,
    message: 'This is a check to see if environment variables are visible to the Cloudflare Worker.'
  });
}
