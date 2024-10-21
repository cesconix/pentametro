import { type OpenAIProvider, createOpenAI } from "@ai-sdk/openai"

let openai: OpenAIProvider | null = null

export const createClient = () => {
  const { OPENAI_API_KEY } = import.meta.env
  if (!OPENAI_API_KEY) {
    throw new Error("missing OPENAI_API_KEY")
  }

  if (!openai) {
    openai = createOpenAI({ apiKey: OPENAI_API_KEY })
  }

  return openai
}

export function parseChunk(chunk: string, brackets: "[]" | "{}") {
  const startIdx = chunk.lastIndexOf(brackets[0])
  const endIdx = chunk.lastIndexOf(brackets[1]) + 1

  const jsonString = chunk.slice(startIdx, endIdx)

  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.error(`json parsing failed. json string: "${jsonString}"`)
    throw new Error("json parsing failed")
  }
}
