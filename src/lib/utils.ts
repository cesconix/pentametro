import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import * as github from "./github"
import * as openai from "./openai"
import { parseChunk } from "./openai/utils"
import type { PentaChecklist, PentaReportItem } from "./types"
import * as upstash from "./upstash"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const needUpdatePentaChecklist = async () => {
  const githubHash = await github.getLatestCommitHash()
  const upstashHash = await upstash.getLatestCommitHash()
  return githubHash !== upstashHash ? githubHash : null
}

export const updatePentaChecklist = async (commitHash: string) => {
  const markdown = await github.fetchMarkdownContent()
  const checklist = await openai.extractPentaChecklist(markdown)
  await upstash.setPentaChecklist(checklist)
  await upstash.setLatestCommitHash(commitHash)
  return checklist
}

export const getPentaChecklist = async () => {
  let checklist: PentaChecklist | null = null

  const hash = await needUpdatePentaChecklist()
  if (hash) {
    checklist = await updatePentaChecklist(hash)
  } else {
    checklist = await upstash.getPentaChecklist()
  }

  return checklist
}

export const streamReportData = async (
  response: Response,
  onChunk: (chunk: PentaReportItem) => void
) => {
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()

  if (!reader) return

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    const parsedChunk = parseChunk(chunk, "{}")
    onChunk(parsedChunk)
  }
}

export const evaluatePDF = async (
  pages: string[],
  abortController: AbortController,
  onChunk: (chunk: PentaReportItem) => void
) => {
  const base64Images = pages.map((page) => page.split(",")[1])

  const response = await fetch("/api/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ base64Images }),
    signal: abortController.signal
  })

  if (!response.ok) {
    throw new Error(response.statusText)
  }

  return await streamReportData(response, onChunk)
}
