import { useCallback, useEffect, useRef } from "react"

export function useAutoScroll() {
  const scrollViewRef = useRef<HTMLDivElement | null>(null)
  const contentViewRef = useRef<HTMLDivElement | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  const setScrollViewRef = useCallback((node: HTMLDivElement | null) => {
    scrollViewRef.current = node
  }, [])

  const setContentViewRef = useCallback((node: HTMLDivElement | null) => {
    contentViewRef.current = node

    if (node) {
      const handleResize = () => {
        if (scrollViewRef.current && contentViewRef.current) {
          scrollViewRef.current.scrollTo({
            top: contentViewRef.current.clientHeight,
            behavior: "smooth"
          })
        }
      }

      resizeObserverRef.current = new ResizeObserver(handleResize)
      resizeObserverRef.current.observe(node)
    } else {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [])

  return { setScrollViewRef, setContentViewRef }
}
