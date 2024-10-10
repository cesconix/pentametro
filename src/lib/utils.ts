import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import * as github from "./github"
import * as openai from "./openai"
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
  let checklist: unknown[] | null = null

  const hash = await needUpdatePentaChecklist()
  if (hash) {
    checklist = await updatePentaChecklist(hash)
  } else {
    checklist = await upstash.getPentaChecklist()
  }

  return checklist
}
