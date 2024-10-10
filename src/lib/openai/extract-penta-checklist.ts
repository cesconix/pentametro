import { createClient, parseChatCompletion } from "./utils"

export async function extractPentaChecklist(markdown: string) {
  const openai = createClient()

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemPrompt
      },
      {
        role: "user",
        content: markdown
      }
    ]
  })

  return parseChatCompletion(completion, "[]")
}

const systemPrompt = `
Sei un assistente specializzato nell'analisi di documenti markdown.
Riceverai un documento markdown che funge da guida sulla costruzione di un CV adatto ai developer.
La tua missione è analizzare il contenuto della guida e individuare le categorie principali relative alla costruzione del CV (es. informazioni personali, esperienze professionali, formazione, competenze, etc.). 
Per ciascuna categoria, crea una checklist in formato JSON. 
Il JSON deve avere la seguente struttura:
[
  {
    "category": "nome della categoria (senza articoli iniziali come 'Il', 'La', 'L’', etc.)",
    "checklist": [
        {
          "requirement": "requisito in italiano",
          "description": "descrizione del requisito come da guida, in italiano"
        },
        ...
    ]
  },
  ...
]
Le proprietà del JSON devono essere in inglese, mentre i valori (ad esempio il nome della categoria, i requisiti e le descrizioni) devono essere in italiano. 
Assicurati che le categorie siano riportate senza articoli iniziali, mantenendo solo il nome principale. Le categorie e i requisiti devono essere concisi e ogni descrizione deve seguire la guida. La checklist deve essere specifica, così da poterla utilizzare successivamente per analizzare CV e verificarne la conformità alla guida.
`.trim()
