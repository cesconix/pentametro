import { headers, repo } from "./utils"

export const fetchMarkdownContent = async () => {
  const { owner, name, branch, file } = repo
  const url = `https://api.github.com/repos/${owner}/${name}/contents/${file}?ref=${branch}`

  const res = await fetch(url, {
    headers: { ...headers, Accept: "application/vnd.github.raw+md" }
  })

  if (!res.ok) {
    throw new Error(`failed to fetch "${repo.file}": ${res.statusText}`)
  }

  return res.text()
}
