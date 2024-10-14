import OpenAI from "openai"

let openai: OpenAI | null = null

export const createClient = () => {
  const { OPENAI_API_KEY } = import.meta.env
  if (!OPENAI_API_KEY) {
    throw new Error("missing OPENAI_API_KEY")
  }

  if (!openai) {
    openai = new OpenAI({
      apiKey: import.meta.env.OPENAI_API_KEY
    })
  }

  return openai
}

export function parseChatCompletion(
  completion: OpenAI.ChatCompletion,
  brackets: "[]" | "{}"
) {
  const answer = completion.choices[0].message.content

  if (!answer) {
    console.error(`failed to evaluate. answer: "${completion}"`)
    throw new Error("failed to evaluate")
  }

  return parseChunk(answer, brackets)
}

export function parseChunk(chunk: string, brackets: "[]" | "{}") {
  const startIdx = chunk.indexOf(brackets[0])
  const endIdx = chunk.lastIndexOf(brackets[1]) + 1

  const jsonString = chunk.slice(startIdx, endIdx)

  try {
    return JSON.parse(jsonString)
  } catch (error) {
    console.error(`json parsing failed. json string: "${jsonString}"`)
    throw new Error("json parsing failed")
  }
}
