import * as pdfjsLib from "pdfjs-dist/build/pdf.min.mjs"
import "pdfjs-dist/build/pdf.worker.min.mjs"
import type React from "react"
import { type ChangeEvent, useState } from "react"

const PdfUploader: React.FC = () => {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      const fileReader = new FileReader()

      fileReader.onload = async function () {
        setLoading(true)
        try {
          const pdfData = new Uint8Array(this.result as ArrayBuffer)
          const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise
          const pages: string[] = []

          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum)
            const viewport = page.getViewport({ scale: 1.5 })

            const canvas = document.createElement("canvas")
            const context = canvas.getContext("2d")
            if (!context) {
              console.error("Errore nel contesto canvas")
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

          setImages(pages)
        } catch (error) {
          console.error("Errore nella conversione del PDF:", error)
          alert("Errore nella conversione del PDF.")
        } finally {
          setLoading(false)
        }
      }

      fileReader.readAsArrayBuffer(file)
    } else {
      alert("Per favore seleziona un file PDF valido.")
    }
  }

  const handleSubmit = async () => {
    if (images.length === 0) {
      alert("Prima carica un PDF e converti le pagine in immagini.")
      return
    }

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ base64: images[0].split(",")[1] })
      })

      if (response.ok) {
        alert("Immagini caricate con successo!")
      } else {
        alert("Errore nel caricamento delle immagini.")
      }
    } catch (error) {
      console.error("Errore nel caricamento delle immagini:", error)
      alert("Errore nel caricamento delle immagini.")
    }
  }

  return (
    <div>
      <h1>PDF to Image Converter</h1>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {loading && <p>Caricamento in corso...</p>}
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Upload Images
      </button>
      <div>
        {images.map((image, index) => (
          <div key={index}>
            <h3>Page {index + 1}</h3>
            <img src={image} alt={`Page ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

export { PdfUploader }
