import * as pdfjsLib from "pdfjs-dist/build/pdf.min.mjs"
import "pdfjs-dist/build/pdf.worker.min.mjs"

export const convertPdfBufferToBase64Strings = async (
  arrayBuffer: ArrayBuffer
): Promise<string[]> => {
  const pages: string[] = []

  const pdfData = new Uint8Array(arrayBuffer)
  const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const viewport = page.getViewport({ scale: 2 })

    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")

    if (!context) {
      console.error("error creating canvas context")
      continue
    }

    canvas.width = viewport.width
    canvas.height = viewport.height

    const renderContext = {
      canvasContext: context,
      viewport: viewport
    }

    await page.render(renderContext).promise

    const base64Image = canvas.toDataURL("image/png")
    pages.push(base64Image)
  }

  return pages
}
