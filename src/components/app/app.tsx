import { useCallback, useEffect, useRef, useState } from "react"

import { Header } from "@/components/header"
import { PdfLoader } from "@/components/pdf-loader"
import { PdfNavigator } from "@/components/pdf-navigator"
import { Welcome } from "@/components/welcome"

import { useAutoScroll } from "@/hooks/use-auto-scroll"
import type { PentaChecklist, PentaReport } from "@/lib/types"
import { evaluatePDF } from "@/lib/utils"
import { LoaderIcon } from "lucide-react"
import { ReportList } from "../report/report-list"
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

  const handleAbortPreviousRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  const handleSubmit = useCallback(async () => {
    handleAbortPreviousRequest()

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
      <div ref={autoScroll.setScrollViewRef} className="md:overflow-y-auto">
        {sessionActive ? (
          <div
            ref={autoScroll.setContentViewRef}
            className="flex flex-col md:border-l flex-1 relative"
          >
            <ReportScore checklist={props.checklist} report={report} />
            <ReportList checklist={props.checklist} report={report} />
          </div>
        ) : (
          <Welcome />
        )}
        {loading && (
          <div className="flex items-center justify-center text-sm text-muted-foreground p-6">
            <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
            Valutazione in corso...
          </div>
        )}
      </div>
    </div>
  )
}
