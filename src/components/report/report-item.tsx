import type { PentaReportItem, PentaRequirement } from "@/lib/types"
import { cn } from "@/lib/utils"
import { FrownIcon, LaughIcon } from "lucide-react"

type ReportItemProps = {
  item: PentaReportItem
  requirement: PentaRequirement
}
export const ReportItem = (props: ReportItemProps) => {
  const textColor = props.item.compliant ? "text-green-500" : "text-red-500"

  return (
    <li className="flex gap-3 animate-in fade-in">
      <div className="px-4 py-3 pr-0">
        {props.item.compliant ? (
          <LaughIcon className={cn("w-6 h-6", textColor)} />
        ) : (
          <FrownIcon className={cn("w-6 h-6", textColor)} />
        )}
      </div>
      <div className="flex-1 px-4 py-3 pl-0">
        <div className="font-medium text-sm">
          {props.requirement.requirement}
        </div>
        <div className="text-muted-foreground text-sm">
          {props.requirement.description}
        </div>
        <div className={cn("text-sm mt-2", textColor)}>
          {props.item.comment}
        </div>
      </div>
    </li>
  )
}
