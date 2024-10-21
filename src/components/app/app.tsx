import { experimental_useObject as useObject } from "ai/react"
import { useCallback, useEffect, useState } from "react"
import { z } from "zod"

import { Header } from "@/components/header"
import { PdfLoader } from "@/components/pdf-loader"
import { PdfNavigator } from "@/components/pdf-navigator"
import { Welcome } from "@/components/welcome"

import { useAutoScroll } from "@/hooks/use-auto-scroll"
import type { PentaChecklist, PentaReport } from "@/lib/types"
import { ReportDisclaimer } from "../report/report-disclaimer"
import { ReportList } from "../report/report-list"
import { ReportLoader } from "../report/report-loader"
import { ReportScore } from "../report/report-score"

type MainProps = {
  checklist: PentaChecklist
}

export const App = (props: MainProps) => {
  const [pages, setPages] = useState<string[]>([])
  const [evaluated, setEvaluated] = useState(false)

  const { object, submit, stop, isLoading } = useObject({
    api: "/api/evaluate",
    initialValue: [],
    schema: z.array(
      z.object({
        id: z.string(),
        compliant: z.boolean(),
        comment: z.string()
      })
    ),
    onFinish(event) {
      setEvaluated(true)
    }
  })

  const autoScroll = useAutoScroll()

  const handleReset = useCallback(() => {
    setPages([])
    setEvaluated(false)
    stop()
  }, [stop])

  const handleSubmit = useCallback(async () => {
    stop()
    submit({ base64Images: pages.map((page) => page.split(",")[1]) })
  }, [pages, stop, submit])

  useEffect(() => {
    if (pages.length > 0 && !isLoading && !evaluated) {
      handleSubmit()
    }
  }, [pages, handleSubmit, isLoading, evaluated])

  const sessionActive = pages.length > 0

  return (
    <div className="bg-background grid grid-cols-1 md:grid-cols-2 h-screen">
      {/* Left */}
      <div className="bg-background flex flex-col divide-y md:h-screen">
        <Header sessionActive={sessionActive} onNewClick={handleReset} />
        {sessionActive ? (
          <PdfNavigator pages={pages} />
        ) : (
          <PdfLoader onLoad={setPages} />
        )}
      </div>

      {/* Right */}
      <div
        ref={autoScroll.setScrollViewRef}
        className="md:overflow-y-auto md:border-l"
      >
        {sessionActive ? (
          <div
            ref={autoScroll.setContentViewRef}
            className="flex flex-col flex-1 relative"
          >
            <ReportScore
              checklist={props.checklist}
              report={object as PentaReport}
            />
            <ReportList
              checklist={props.checklist}
              report={object as PentaReport}
            />
            <div className="flex flex-col items-center p-6 text-muted-foreground space-y-5">
              {isLoading && <ReportLoader />}
              <ReportDisclaimer />
            </div>
          </div>
        ) : (
          <Welcome />
        )}
      </div>
    </div>
  )
}
