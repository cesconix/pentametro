import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"

type PrivacyPolicyModalProps = {
  open: boolean
  onCancel: () => void
  onAccept: () => void
}

const Heading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-[15px] font-medium mb-1 mt-5">{children}</h2>
)
const Paragraph = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm mb-2 leading-normal text-muted-foreground">
    {children}
  </p>
)

export const PrivacyPolicyModal = (props: PrivacyPolicyModalProps) => (
  <AlertDialog open={props.open}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="text-left">
          Privacy Policy
        </AlertDialogTitle>
        <div className="max-h-96 overflow-y-auto text-left">
          <Heading>Come gestiamo i tuoi dati personali?</Heading>

          <Paragraph>
            Pentametro si impegna a proteggere la privacy dei suoi utenti e a
            garantire che i dati personali siano trattati in modo sicuro e
            responsabile. Di seguito troverai una panoramica di come vengono
            gestiti i dati durante l'utilizzo del servizio.
          </Paragraph>

          <Heading>Nessuna memorizzazione dei dati personali</Heading>

          <Paragraph>
            Pentametro non memorizza né salva alcun dato personale o documento
            caricato dagli utenti. I CV vengono elaborati esclusivamente per il
            tempo necessario a completare la valutazione e vengono eliminati
            subito dopo l'analisi.
          </Paragraph>

          <Heading>Invio dei dati a OpenAI tramite API</Heading>

          <Paragraph>
            Per eseguire l'analisi del CV, Pentametro invia le immagini delle
            pagine del tuo CV a OpenAI tramite le loro API. OpenAI{" "}
            <span className="font-semibold">
              non utilizza i dati inviati tramite le API per addestrare o
              migliorare i propri modelli
            </span>
            , e i dati non vengono memorizzati permanentemente. L'uso dei dati è
            limitato esclusivamente all'elaborazione richiesta dal servizio.
            Puoi leggere le{" "}
            <a
              target="_blank"
              href="https://openai.com/policies/api-data-usage-policies"
              className="text-primary hover:underline hover:underline-offset-4"
              rel="noreferrer"
            >
              API Data Usage Policies di OpenAI
            </a>{" "}
            per ulteriori dettagli sulla gestione dei dati tramite le loro API.
          </Paragraph>

          <Heading>Informazioni personali nei CV</Heading>

          <Paragraph>
            Ti consigliamo di includere informazioni di contatto (come nome,
            email, e numero di telefono) solo se desideri una valutazione
            completa del CV, in quanto la sezione "Contatti" viene valutata a
            prescindere. Queste informazioni vengono inviate solo a OpenAI per
            l'analisi e non sono memorizzate da Pentametro.
          </Paragraph>

          <Heading>Sicurezza dei dati</Heading>

          <Paragraph>
            I dati inviati a Pentametro vengono gestiti in modo sicuro e non
            sono condivisi con terze parti, eccetto OpenAI, che esegue l'analisi
            del contenuto. I dati vengono eliminati immediatamente dopo la
            valutazione e non vengono conservati per utilizzi futuri.
          </Paragraph>

          <Heading>Uso del servizio</Heading>

          <Paragraph>
            Utilizzando Pentametro, accetti i termini di questa privacy policy.
            Ti invitiamo a rimuovere eventuali dati personali che non desideri
            condividere prima di caricare il CV, soprattutto se non strettamente
            necessari per la valutazione.
          </Paragraph>

          <Heading>Modifiche alla privacy policy</Heading>

          <Paragraph>
            Pentametro si riserva il diritto di aggiornare questa Privacy Policy
            in qualsiasi momento. Eventuali modifiche verranno comunicate
            attraverso il sito web.
          </Paragraph>
        </div>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={props.onCancel}>Annulla</AlertDialogCancel>
        <AlertDialogAction onClick={props.onAccept}>Accetto</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)
