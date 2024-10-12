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
    "category": "Nome della categoria (senza articoli iniziali come 'Il', 'La', 'L’', etc.)",
    "mandatory": true/false,
    "checklist": [
        {
          "requirement": "Nome del requisito in italiano",
          "description": "Descrizione del requisito come da guida, in italiano",
        },
        ...
    ]
  },
  ...
]

Assicurati che:
1. Le proprietà del JSON devono essere in inglese, mentre i valori (ad esempio il nome della categoria, i requisiti e le descrizioni) devono essere in italiano. 
2. Le categorie siano riportate senza articoli iniziali, mantenendo solo il nome principale. 
3. Le categorie e i requisiti devono essere concisi e ogni descrizione deve seguire la guida. 
4. La checklist deve essere specifica, così da poterla utilizzare successivamente per analizzare CV e verificarne la conformità alla guida.
5. Se una categoria è consigliata, imposta il valore di "mandatory" a false.
6. Se una categoria è fondamentale o importante, imposta il valore di "mandatory" a true.
`.trim()
