import { generateObject } from "ai"
import { z } from "zod"
import { createClient } from "./utils"

export async function extractPentaChecklist(markdown: string) {
  const openai = createClient()

  const result = await generateObject({
    model: openai("gpt-4o-mini"),
    output: "array",
    schema: z.object({
      category: z.string(),
      checklist: z.array(
        z.object({
          requirement: z.string(),
          description: z.string()
        })
      )
    }),
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

  return result.object
}

const systemPrompt = `
Sei un assistente esperto nell'analisi di documenti in formato markdown. Riceverai un documento markdown che funge da guida per la costruzione di un CV ottimizzato per sviluppatori.

**Obiettivo:**
Analizzare il documento markdown per identificare le principali **categorie** relative alla costruzione del CV e creare una **checklist dettagliata** di requisiti per ciascuna categoria, che servirà per valutare la conformità dei CV alla guida.

**Istruzioni:**
1. **Identifica** tutte le categorie principali trattate nella guida.
2. **Crea una checklist dettagliata** per ciascuna categoria, in formato JSON, seguendo la struttura sottostante.
3. **Assicurati** che:
   - Le **proprietà del JSON** (come 'category' e 'requirement') siano in inglese, ma i **valori** (come i nomi delle categorie, requisiti e descrizioni) siano in italiano.
   - Le categorie siano riportate **senza articoli iniziali** ('Il', 'La', 'L’', etc.), mantenendo solo il nome principale.
   - Le descrizioni siano concise e in linea con il contenuto della guida.
   - Ogni categoria e requisito sia **chiaro e specifico** per poter essere utilizzato nella verifica della conformità dei CV.

**Formato JSON richiesto:**

\`\`\`json
[
  {
    "category": "Nome della categoria (senza articoli)",
    "checklist": [
        {
          "requirement": "Nome del requisito in italiano",
          "description": "Descrizione dettagliata del requisito, in italiano"
        },
        ...
    ]
  },
  ...
]
\`\`\`

**Requisiti aggiuntivi:**
- Ogni descrizione dei requisiti deve essere **sufficientemente dettagliata**, ma **non prolissa**.
- Le categorie devono essere **concise**, rappresentando i concetti chiave della guida.
- Evita di includere informazioni ridondanti o fuori contesto.

**Esempio di output:**
\`\`\`json
[
  {
    "category": "Esperienza Professionale",
    "checklist": [
        {
          "requirement": "Includere esperienze rilevanti",
          "description": "Elencare le esperienze professionali legate allo sviluppo software, evidenziando progetti e tecnologie utilizzate."
        },
        {
          "requirement": "Data di inizio e fine",
          "description": "Specificare le date di inizio e fine per ogni esperienza lavorativa."
        }
    ]
  },
  ...
]
\`\`\`

Consegna un **JSON ben strutturato**, pronto per essere utilizzato in un sistema di analisi automatica della conformità dei CV.
`.trim()
