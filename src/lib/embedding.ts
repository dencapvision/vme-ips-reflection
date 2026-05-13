import { getGoogleAI } from './clients'

export async function createEmbedding(text: string): Promise<number[]> {
  const embeddingModel = getGoogleAI()
  const clean = text.replace(/\n+/g, ' ').trim().slice(0, 8000)
  const result = await embeddingModel.embedContent(clean)
  return result.embedding.values
}

export async function createBatchEmbeddings(texts: string[]): Promise<number[][]> {
  const embeddingModel = getGoogleAI()
  const requests = texts.map(t => ({
    content: { role: 'user', parts: [{ text: t.replace(/\n+/g, ' ').trim().slice(0, 8000) }] }
  }))
  const result = await embeddingModel.batchEmbedContents({ requests })
  return result.embeddings.map(e => e.values)
}
