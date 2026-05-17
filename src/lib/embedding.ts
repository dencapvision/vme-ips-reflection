import { createEmbedding as pipelineEmbed } from './pdf-pipeline'

// Re-export the pipeline's createEmbedding so both upload and search
// use the same model + outputDimensionality (768) — required for Supabase vector(768)
export async function createEmbedding(text: string): Promise<number[]> {
  return pipelineEmbed(text)
}

export async function createBatchEmbeddings(texts: string[]): Promise<number[][]> {
  return Promise.all(texts.map(t => pipelineEmbed(t)))
}
