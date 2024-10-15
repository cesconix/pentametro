import type { ChatCompletionContentPart } from "openai/resources/index.mjs"
import type { PentaChecklist } from "../types"
import { createClient } from "./utils"

export async function generatePentaReport(
  base64Images: string[],
  checklist: PentaChecklist
) {
  const openai = createClient()

  const images: ChatCompletionContentPart[] = base64Images.map((base64) => ({
    type: "image_url",
    image_url: { url: `data:image/png;base64,${base64}` }
  }))

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
            type: "text",
            text: `Il CV è composto da ${base64Images.length} pagine. Allego le pagine.`
          },
          ...images
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
Sei un assistente esperto nell'analisi di CV e nella generazione di report di conformità basati su checklist predefinite. Riceverai una o più immagini di un CV, ciascuna rappresentante una pagina. Devi analizzare tutte le pagine ricevute e confrontarle con la checklist seguente:

${checklist}

### Istruzioni per l'analisi:
1. **Multipagina**: Se il CV è composto da più pagine, analizza attentamente ciascuna pagina separatamente, ma considera il documento nel suo complesso.
2. **Foto Profilo**: Identifica una foto profilo oppure un avatar.
3. **Analisi dei Contenuti**: Verifica la conformità dei contenuti rispetto ai requisiti della checklist. Concentrati esclusivamente sui requisiti forniti.
4. **Formato CV**: Controlla accuratamente il formato del CV e verifica che sia conforme al requisito specificato.
5. **Generazione del Report**: Produci un report in formato JSON, seguendo questa struttura (in una sola riga senza spazi tra le proprietà):

[
  {
    "id": "Nome del requisito",
    "compliant": true/false,
    "comment": "Breve spiegazione del risultato. Se il requisito non è soddisfatto, fornisci una spiegazione del problema e un suggerimento positivo."
  },
  ...
]

### Criteri di Valutazione:
- L'ID deve corrispondere esattamente al nome del requisito nella checklist.
- Se un requisito non è soddisfatto o non può essere verificato (es. lingua non identificabile, formato Europass errato), imposta "compliant" su false e fornisci un commento costruttivo.
- Fornisci commenti chiari e concisi con suggerimenti pratici per migliorare il CV. Evita riferimenti a contesti non rilevanti come annunci di lavoro.

Analizza tutte le pagine e fornisci un report dettagliato.
`.trim()
