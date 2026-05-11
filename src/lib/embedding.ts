import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const embeddingModel = genAI.getGenerativeModel({
  model: 'text-embedding-004',
})

export async function createEmbedding(text: string): Promise<number[]> {
  const clean = text.replace(/\n+/g, ' ').trim().slice(0, 8000)
  const result = await embeddingModel.embedContent(clean)
  return result.embedding.values
}
