import * as openai from "@/lib/openai"
import { getPentaChecklist } from "@/lib/utils"
import type { APIRoute } from "astro"
import { z } from "zod"

export const POST: APIRoute = async ({ request }) => {
  let base64: string

  /** validate request */
  try {
    const data = z
      .object({ base64: z.string().base64() })
      .parse(await request.json())
    base64 = data.base64
  } catch (error) {
    console.error("invalid request", error)
    return new Response(JSON.stringify({ error }), { status: 400 })
  }

  /** convert pdf base64 to image */
  // if (!imageBase64) {
  //   return new Response(JSON.stringify({ message: "invalid filetype" }), {
  //     status: 400
  //   })
  // }

  /** generate penta report */
  const checklist = await getPentaChecklist()

  if (!checklist) {
    return new Response(JSON.stringify({ message: "checklist not found" }), {
      status: 500
    })
  }

  const stream = await openai.generatePentaReport(base64, checklist)

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive"
    }
  })
}
