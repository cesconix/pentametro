import { Redis } from "@upstash/redis"

let redis: Redis | null = null

export const createClient = () => {
  const { UPSTASH_REDIS_URL, UPSTASH_REDIS_TOKEN } = import.meta.env

  if (!UPSTASH_REDIS_URL) {
    throw new Error("missing UPSTASH_REDIS_URL")
  }

  if (!UPSTASH_REDIS_TOKEN) {
    throw new Error("missing UPSTASH_REDIS_TOKEN")
  }

  if (!redis) {
    redis = new Redis({
      url: import.meta.env.UPSTASH_REDIS_URL,
      token: import.meta.env.UPSTASH_REDIS_TOKEN
    })
  }

  return redis
}
