import type { PentaChecklist, PentaReport } from "@/lib/types"
import { ReportItem } from "./report-item"

type ReportProps = {
  checklist: PentaChecklist
  report: PentaReport
}

export const ReportList = (props: ReportProps) => {
  const reportMap = Object.fromEntries(
    props.report.map((item) => [item.id, item])
  )

  const checklist = props.checklist.filter((group) =>
    group.checklist.some((requirement) => requirement.requirement in reportMap)
  )

  return (
    <div className="divide-y">
      {checklist.map((group) => (
        <div key={group.category} className="flex flex-col p-3">
          <h2 className="uppercase px-4 py-1 text-sm font-semibold text-primary my-1">
            {group.category}
          </h2>
          <ul>
            {group.checklist
              .filter((requirement) => requirement.requirement in reportMap)
              .map((requirement) => (
                <ReportItem
                  key={reportMap[requirement.requirement].id}
                  item={reportMap[requirement.requirement]}
                  requirement={requirement}
                />
              ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
