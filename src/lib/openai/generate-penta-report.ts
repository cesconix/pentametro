import { createClient } from "./utils"

export async function generatePentaReport(
  base64: string,
  checklist: unknown[]
) {
  const openai = createClient()

  const stream = await openai.chat.completions.create({
    stream: true,
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemPrompt(JSON.stringify(checklist, null, 2))
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: { url: `data:image/webp;base64,${base64}` }
          }
        ]
      }
    ]
  })

  const reportStream = new ReadableStream({
    async start(controller) {
      let buffer = ""

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content
        if (!content) continue

        buffer += content

        if (buffer.includes("}")) {
          const openBracesCount = (buffer.match(/{/g) || []).length
          const closeBracesCount = (buffer.match(/}/g) || []).length

          if (openBracesCount === closeBracesCount) {
            const startIdx = buffer.indexOf("{")
            const endIdx = buffer.lastIndexOf("}") + 1

            const jsonString = buffer.slice(startIdx, endIdx)

            controller.enqueue(`data: ${jsonString}\n\n`)

            buffer = buffer.slice(endIdx)
          }
        }
      }

      controller.close()
    }
  })

  return reportStream
}

const systemPrompt = (checklist: string) =>
  `
Sei un assistente specializzato nell'analisi di CV e nella generazione di report di conformità basati su checklist predefinite. Riceverai un'immagine di un CV. La checklist con le categorie e i requisiti da verificare è la seguente:

${checklist}

Il tuo compito è analizzare il CV, confrontarlo con i requisiti della checklist fornita, e generare un report di conformità.

Il report finale deve essere in formato JSON con la seguente struttura, in una sola riga e senza spazi tra le proprietà:
[
  {
    "id": "nome del requisito 1",
    "compliant": true/false,
    "comment": "breve spiegazione del risultato"
  },
  ...
]

Il valore di "id" deve coincidere con il nome del requisito nella checklist, in modo che il risultato sia accessibile direttamente dal titolo del requisito. Assicurati che i commenti siano brevi e chiari, evidenziando le eventuali mancanze o i punti di forza del CV rispetto alla checklist.
`.trim()
