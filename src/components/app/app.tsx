import { useCallback, useEffect, useRef, useState } from "react"

import { Header } from "@/components/header"
import { PdfLoader } from "@/components/pdf-loader"
import { PdfNavigator } from "@/components/pdf-navigator"
import { Welcome } from "@/components/welcome"

import { useAutoScroll } from "@/hooks/use-auto-scroll"
import type { PentaChecklist, PentaReport } from "@/lib/types"
import { evaluatePDF } from "@/lib/utils"
import { ReportDisclaimer } from "../report/report-disclaimer"
import { ReportList } from "../report/report-list"
import { ReportLoader } from "../report/report-loader"
import { ReportScore } from "../report/report-score"

type MainProps = {
  checklist: PentaChecklist
}

export const App = (props: MainProps) => {
  const [pages, setPages] = useState<string[]>([])
  const [report, setReport] = useState<PentaReport>([])
  const [loading, setLoading] = useState(false)

  const autoScroll = useAutoScroll()

  const abortControllerRef = useRef<AbortController | null>(null)

  const handleReset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setPages([])
    setReport([])
  }, [])

  const handleSubmit = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      setLoading(true)
      await evaluatePDF(pages, abortController, (chunk) => {
        setReport((prev) => [...prev, chunk])
      })
    } catch (error) {
      if (abortController.signal.aborted) return
      console.error("Error while evaluating:", error)
      alert("Error while evaluating")
    } finally {
      setLoading(false)
    }
  }, [pages])

  useEffect(() => {
    if (pages.length > 0) {
      handleSubmit()
    }
  }, [pages, handleSubmit])

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
            <ReportScore checklist={props.checklist} report={report} />
            <ReportList checklist={props.checklist} report={report} />
            <div className="flex flex-col items-center p-6 text-muted-foreground space-y-5">
              {loading && <ReportLoader />}
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
