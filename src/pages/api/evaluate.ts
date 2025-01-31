import * as openai from "@/lib/openai"
import { getPentaChecklist } from "@/lib/utils"
import type { APIRoute } from "astro"
import { z } from "zod"

export const POST: APIRoute = async ({ request }) => {
  let base64Images: string[]

  /** validate request */
  try {
    const data = z
      .object({ base64Images: z.array(z.string().base64()) })
      .parse(await request.json())
    base64Images = data.base64Images
  } catch (error) {
    console.error("invalid request", error)
    return new Response(JSON.stringify({ error }), { status: 400 })
  }

  /** generate penta checklist */
  const checklist = await getPentaChecklist()

  if (!checklist) {
    return new Response(JSON.stringify({ message: "checklist not found" }), {
      status: 500
    })
  }

  const stream = await openai.generatePentaReport(base64Images, checklist)

  return stream.toTextStreamResponse()
}
