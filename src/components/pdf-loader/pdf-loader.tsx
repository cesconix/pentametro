import { FileUpIcon } from "lucide-react"
import { type ChangeEvent, useState } from "react"
import { PrivacyPolicyModal } from "../privacy"
import { Button } from "../ui/button"
import { convertPdfBufferToBase64Strings } from "./utils"

type PdfLoaderProps = {
  onLoad: (images: string[]) => void
}

export const PdfLoader = (props: PdfLoaderProps) => {
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file?.type !== "application/pdf") {
      alert("Invalid file type. Please upload a PDF file.")
      return
    }

    const fileReader = new FileReader()

    fileReader.onload = async function () {
      try {
        const images = await convertPdfBufferToBase64Strings(
          this.result as ArrayBuffer
        )
        props.onLoad(images)
      } catch (error) {
        console.error("error converting pdf:", error)
        alert("error converting pdf")
      }
    }

    fileReader.readAsArrayBuffer(file)
  }

  const handleAcceptPrivacyPolicy = () => {
    setPrivacyPolicyOpen(false)
    document.getElementById("cvFile")?.click()
  }

  const handleCancelPrivacyPolicy = () => {
    setPrivacyPolicyOpen(false)
  }

  return (
    <div className="flex flex-col h-full p-3">
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center w-80 text-center">
          <FileUpIcon strokeWidth={1.3} className="w-9 h-9 text-primary mb-4" />
          <h3 className="font-bold mb-1">Carica il CV</h3>
          <p className="text-muted-foreground text-sm">
            Seleziona un file PDF del tuo curriculum per iniziare. Il file non
            sarà salvato.
          </p>
          <div className="flex gap-2">
            <input
              id="cvFile"
              className="hidden"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            <Button
              size={"sm"}
              className="mt-5"
              onClick={() => setPrivacyPolicyOpen(true)}
            >
              Scegli file
            </Button>
          </div>
          <PrivacyPolicyModal
            open={privacyPolicyOpen}
            onAccept={handleAcceptPrivacyPolicy}
            onCancel={handleCancelPrivacyPolicy}
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center p-3 space-y-1">
        <span className="text-sm text-muted-foreground">
          100% free and open source
        </span>
      </div>
    </div>
  )
}
