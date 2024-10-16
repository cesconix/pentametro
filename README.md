# Pentametro

Pentametro è uno strumento open source che valuta la conformità dei CV rispetto alla guida di Guido Penta. Utilizza OpenAI per analizzare il CV e fornisce un report dettagliato con una checklist di requisiti e un punteggio finale.

## 📘 Come funziona

Pentametro utilizza diversi servizi per gestire il processo di analisi e valutazione:

1. **Caricamento del CV**: L'utente carica il CV in formato PDF. Il documento viene convertito in immagini in formato base64 (PNG) e inviato a OpenAI come prompt per estrarre le informazioni necessarie.

2. **Upstash Redis**: Utilizziamo Upstash Redis per due scopi principali:
   - **Ultimo commit**: Pentametro tiene traccia dell'ultimo commit del repository GitHub della guida di Guido Penta. Ogni volta che viene aggiornato, la checklist dei requisiti viene aggiornata automaticamente.
   - **Checklist**: La checklist dei requisiti estratti viene salvata in Upstash Redis per consentire un rapido accesso e aggiornamento, ottimizzando i costi quando gli utenti utilizzano l'app. Invece di creare il contesto dalla guida di Penta ogni volta (che contiene molte parole e quindi molti token), utilizziamo la checklist che ha già i requisiti estrapolati dalla guida ed è un JSON più leggero.

3. **Analisi e report**: Una volta completata l'analisi del CV, viene generato un report che confronta il CV con la checklist dei requisiti. Il report contiene un punteggio di conformità finale.

## ⚠️ Problemi noti

- **Formati Europass**: Alcuni CV in formato Europass potrebbero non essere riconosciuti correttamente.
- **Riconoscimento foto profilo**: Le foto profilo o avatar potrebbero non essere riconosciute correttamente, specialmente quando sono di piccole dimensioni.

## 🤝 Come contribuire

1. Fai il fork del progetto.
2. Crea un branch (`git checkout -b feat/il-tuo-contributo`).
3. Effettua il commit delle modifiche (`git commit -m 'feat: conventional commit'`).
4. Esegui il push (`git push origin feat/il-tuo-contributo`).
5. Apri una pull request.

## 👮 Licenza

Il progetto è rilasciato sotto licenza MIT.
