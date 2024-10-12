import * as pdfjsLib from "pdfjs-dist/build/pdf.min.mjs"
import "pdfjs-dist/build/pdf.worker.min.mjs"
import { FileUpIcon } from "lucide-react"
import type React from "react"
import { type ChangeEvent, useState } from "react"
import { Button } from "./ui/button"

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
            const viewport = page.getViewport({ scale: 2 })

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
    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          base64Images: images.map((image) => image.split(",")[1])
        })
      })

      if (!response.ok) {
        alert(response.statusText)
      }
    } catch (error) {
      console.error("Errore nel caricamento delle immagini:", error)
      alert("Errore nel caricamento delle immagini.")
    }
  }
  return (
    <div>
      <div className="flex flex-col items-center w-80 text-center">
        <FileUpIcon strokeWidth={1.3} className="w-9 h-9 text-primary mb-4" />
        <h3 className="font-bold mb-1">Carica il CV</h3>
        <p className="text-muted-foreground text-sm">
          Seleziona un file PDF del tuo curriculum per iniziare. Il file non
          sarà salvato.
        </p>
        <Button size={"sm"} className="mt-5">
          Scegli file
        </Button>
      </div>
      {/* <input type="file" accept="application/pdf" onChange={handleFileChange} /> */}
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
