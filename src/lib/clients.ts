import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { GoogleGenerativeAI } from '@google/generative-ai'

let supabaseCache: SupabaseClient | null = null

/**
 * ฟังก์ชันสำหรับดึง Supabase Client แบบ Lazy Loading และ Caching
 * เพื่อให้มั่นใจว่า Environment Variables พร้อมใช้งานบน Cloudflare
 * และประหยัดทรัพยากรโดยการใช้ Instance เดิมซ้ำ
 */
export function getSupabase() {
  if (supabaseCache) return supabaseCache

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Supabase Config Missing: Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Cloudflare Dashboard.');
  }

  supabaseCache = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
  
  return supabaseCache
}


export function getGoogleAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini Key Missing: Please set GEMINI_API_KEY in Cloudflare Dashboard.');
  }
  // Force v1 API to avoid 404 errors on v1beta
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: 'text-embedding-004',
  }, { apiVersion: 'v1' });
}

export function getGeminiModel(modelName: string = 'gemini-2.0-flash', systemInstruction?: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini Key Missing: Please set GEMINI_API_KEY in Cloudflare Dashboard.');
  }
  // systemInstruction requires v1beta — do NOT use v1 here
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemInstruction
  }, { apiVersion: 'v1beta' });
}
