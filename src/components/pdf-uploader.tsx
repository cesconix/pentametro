import { type ChangeEvent, type FormEvent, useState } from "react"
import { Button } from "./ui/button"

type PdfUploaderProps = {
  checklist: unknown[]
}

const PdfUploader = (props: PdfUploaderProps) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [base64, setBase64] = useState<string | null>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setPdfFile(file)
      convertToBase64(file)
    } else {
      alert("Please select a valid PDF file.")
    }
  }

  const convertToBase64 = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const uri = reader.result as string
      setBase64(uri.split(",")[1])
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!pdfFile) {
      alert("Please upload a PDF file first.")
      return
    }

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ base64 })
      })

      if (response.ok) {
        alert("PDF uploaded successfully!")
      } else {
        alert("Failed to upload PDF.")
      }
    } catch (error) {
      console.error("Error uploading PDF:", error)
      alert("Error uploading PDF.")
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="p-2 border rounded-md"
      />
      <Button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Upload PDF
      </Button>
      <pre className="text-xs">{JSON.stringify(props.checklist, null, 2)}</pre>
    </div>
  )
}

export { PdfUploader }
