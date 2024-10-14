import type { PentaChecklist, PentaReport } from "@/lib/types"
import { cn } from "@/lib/utils"

type ReportScoreProps = {
  checklist: PentaChecklist
  report: PentaReport
}

export const ReportScore = (props: ReportScoreProps) => {
  const total = props.checklist.reduce(
    (acc, group) => acc + group.checklist.length,
    0
  )

  const score = Math.round(
    (100 / total) * props.report.filter((item) => item.compliant).length
  )

  let color: string
  if (score >= 80) {
    color = "text-green-500"
  } else if (score >= 50) {
    color = "text-orange-400"
  } else {
    color = "text-red-500"
  }

  return (
    <div className="flex justify-center items-center p-[14px] sticky top-0 border-b bg-background">
      <span className="text-sm font-semibold mr-2">Voto:</span>
      <div className={cn("font-semibold", color)}>{score}</div>
    </div>
  )
}
