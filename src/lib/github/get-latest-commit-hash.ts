import { headers, repo } from "./utils"

export const getLatestCommitHash = async () => {
  const { owner, name, branch } = repo
  const url = `https://api.github.com/repos/${owner}/${name}/commits/${branch}`

  const res = await fetch(url, { headers })

  if (!res.ok) {
    throw new Error(`failed to fetch commit hash: ${res.statusText}`)
  }

  const data = await res.json()
  return data.sha as string
}
