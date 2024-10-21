export type PentaRequirement = {
  requirement: string
  description: string
}

export type PentaChecklist = {
  category: string
  checklist: PentaRequirement[]
}[]

export type PentaReport = PentaReportItem[] | []

export type PentaReportItem = {
  id: string
  compliant: boolean
  comment: string
}
