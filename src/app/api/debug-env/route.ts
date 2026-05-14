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

  // List available Gemini models for this API key
  let embeddingModels: string[] = []
  let listModelsError: string | null = null
  const apiKey = process.env.GEMINI_API_KEY
  if (apiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=100`
      )
      if (res.ok) {
        const data = await res.json()
        embeddingModels = (data.models ?? [])
          .filter((m: any) => m.supportedGenerationMethods?.includes('embedContent'))
          .map((m: any) => m.name)
      } else {
        listModelsError = await res.text()
      }
    } catch (e: any) {
      listModelsError = e.message
    }
  }

  return NextResponse.json({
    status: 'Ready to debug',
    env: envStatus,
    embeddingModels,
    listModelsError,
  });
}
