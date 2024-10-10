import { createClient } from "./utils"

const REDIS_KEY = "penta_checklist"

export const getPentaChecklist = async () => {
  const redis = createClient()
  return redis.get<unknown[]>(REDIS_KEY)
}

export const setPentaChecklist = async (checklist: unknown[]) => {
  const redis = createClient()
  return redis.set(REDIS_KEY, checklist)
}
