import { createClient } from "./utils"

export async function generatePentaReport(
  base64Images: string[],
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
        content: base64Images.map((base64) => ({
          type: "image_url",
          image_url: { url: `data:image/png;base64,${base64}` }
        }))
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
Rimani calmo e analizza attentamente. Sei un assistente esperto nell'analisi di CV e nella generazione di report di conformità basati su checklist predefinite. Riceverai un'immagine di un CV e dovrai confrontarla con i requisiti definiti nella seguente checklist:

${checklist}

Non è presente alcun annuncio di lavoro specifico. Il tuo obiettivo è esaminare il CV, verificare la conformità rispetto ai requisiti indicati, e produrre un report strutturato e generale, applicabile a qualsiasi CV.

Il report deve essere generato in formato JSON, seguendo questa struttura e formato (in una sola riga, senza spazi tra le proprietà):
[
  {
    "id": "Nome del requisito",
    "compliant": true/false,
    "comment": "Breve spiegazione del risultato. Se il requisito non è soddisfatto, fornisci una spiegazione del problema e un suggerimento positivo."
  },
  ...
]

Assicurati che:
1. L'ID corrisponda esattamente al nome del requisito nella checklist per un accesso diretto ai risultati.
2. Se il requisito non è soddisfatto o non può essere verificato, imposta "compliant" su false e fornisci un commento che spieghi il problema e offra un consiglio costruttivo.
3. Il commento deve essere argomentato e costruttivo, aiutando il candidato a migliorare il CV.
4. Il commento deve essere breve, chiaro e conciso, evitando riferimenti ad annunci di lavoro o altri contesti non forniti. 
5. Il commento non deve includere valutazioni vaghe o generiche.

Concentrati esclusivamente sui requisiti della checklist e sul contenuto del CV.
`.trim()
