import { createClient } from "./utils"

const REDIS_KEY = "latest_commit_hash"

export const getLatestCommitHash = async () => {
  const redis = createClient()
  return redis.get<string>(REDIS_KEY)
}

export const setLatestCommitHash = async (hash: string) => {
  const redis = createClient()
  return redis.set(REDIS_KEY, hash)
}
