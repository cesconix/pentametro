import type { PentaChecklist } from "../types"
import { createClient } from "./utils"

const REDIS_KEY = "penta_checklist"

export const getPentaChecklist = async () => {
  const redis = createClient()
  return redis.get<PentaChecklist>(REDIS_KEY)
}

export const setPentaChecklist = async (checklist: PentaChecklist) => {
  const redis = createClient()
  return redis.set(REDIS_KEY, checklist)
}
