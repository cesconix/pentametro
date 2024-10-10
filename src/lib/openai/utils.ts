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

  const startIndex = answer.indexOf(brackets[0])
  const endIndex = answer.lastIndexOf(brackets[1])

  if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
    console.error(`invalid json format. answer: "${answer}"`)
    throw new Error("invalid json format")
  }

  const jsonString = answer.slice(startIndex, endIndex + 1).trim()

  try {
    return JSON.parse(jsonString) as unknown[]
  } catch (error) {
    console.error(`json parsing failed. json string: "${jsonString}"`)
    throw new Error("json parsing failed")
  }
}
