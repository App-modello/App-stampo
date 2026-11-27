# App-stampo – istruzioni per Claude

Questo repository è lo **stampo** da cui nascono le app di prenotazione per negozi
(parrucchieri, estetiste, barbieri…) del servizio Radix Salon di Eurogestion.
È nato da Radici (`Radici-app/Radici`), la prima app in produzione.

## Regole di lavoro (decise dal titolare)
- Rispondi **in italiano**, **passo passo**, con parole semplici: il titolare non è un programmatore.
  Un passo alla volta quando deve fare lui qualcosa (clic esatti, poi aspetta "fatto").
- Lavora sempre su un **ramo di lavoro**; su `main` si pubblica **solo quando dice "pubblica"**.
- **Google Play**: usa la fabbrica "Google Play" in Actions. L'azione `stato` si può usare sempre;
  `carica-test-interno` e `promuovi-produzione` **solo se lo chiede lui**.
- Non mettere mai segreti, password o chiavi nel repository (è pubblico).
- Se non fa niente, prima chiedi: spesso vuole solo informazioni ("rispondimi solo, non fare nulla").

## Com'è fatto
Un solo repository per negozio, con app dei clienti e gestionale del titolare (Radici invece ne ha due:
`Radici-app/Radici` per l'app e `Radici-app/Radici-app` per il gestionale).
- **App dei clienti = sito**: `index.html`, `app.js`, `seed.js`, `icone.js` nella cartella principale.
  L'app Android/iPhone (cartella `app-android/`, Capacitor) racchiude gli stessi file.
- **Gestionale del titolare**: cartella `gestionale/` (`index.html`, `dash.js`). Usa gli stessi
  `../config.js`, `../seed.js`, `../icone.js` dell'app. Non entra nelle app Android/iPhone.
  Per entrare serve un account Firebase (email e password) e il documento `saloni/<salone>/admin/<UID>`
  creato a mano nella console di Firestore (UID da Authentication → Utenti).
- **`firestore.rules`**: regole di sicurezza di Firestore, da incollare in Firebase → Firestore → Regole.
- **Sito pubblicato (GitHub Pages, ramo `main`, cartella root)**: app in `https://<org>.github.io/<repo>/`,
  gestionale in `…/<repo>/gestionale/`, pagine legali `privacy.html`, `termini.html`, `cancella-account.html`.
  In Firebase → Authentication → Impostazioni → Domini autorizzati va aggiunto `<org>.github.io`.
- **`config.js`**: l'UNICO file con le impostazioni dell'app (nome, pacchetto, codice negozio,
  colori, Firebase, repository). Lo leggono il sito e le pagine legali mentre girano.
- **`app-android/personalizza.js`**: copia `config.js` nei progetti Android/iPhone, nel manifest e
  nell'intestazione di `index.html`. Le fabbriche lo lanciano da sole; lancialo anche tu
  (`node app-android/personalizza.js`) dopo aver cambiato `config.js` e fai il commit dei file cambiati.
- **`app-android/crea-icone.py`**: crea tutte le icone da `logo.png` (1024×1024) nella cartella
  principale; senza logo fa un'icona provvisoria con l'iniziale.
- **Dati del negozio** (servizi, orari, staff, testi legali, fidelity, avvisi): NON stanno nel codice.
  Li imposta il titolare del negozio dal **gestionale** e arrivano da Firebase, documento
  `saloni/<APP.salone>`. `seed.js` contiene solo valori di partenza d'esempio e i testi legali standard
  (con segnaposto `{{...}}`). Eurogestion è indicata nei testi legali come responsabile del trattamento:
  è corretto per tutte le app.
- **Notifiche push**: `functions/` è il programma per Firebase Cloud Functions che le invia (promemoria ogni
  5 minuti, comunicazioni, punti Fidelity, clienti inattivi alle 10, orario di silenzio con coda in
  `saloni/<salone>/coda`). Usa `seed.js` (copiato dalla fabbrica) per valori di partenza, testi e saldo punti.
  Calcoli in `functions/logica.js`, prove con `node functions/prova.js`.
  L'interruttore è nel **gestionale → Notifiche push → "Invio notifiche attivo"** (`notifiche.attive` nel
  documento del negozio): l'app lo legge da Firebase, quindi si accendono **senza aggiornare l'app**.
  Accenderlo solo dopo aver installato il programma (piano Blaze). Su iPhone serve anche la chiave APNs in Firebase.
- **Promemoria gratuiti sul telefono** (senza server, senza piano Blaze): finché "Invio notifiche attivo" è spento, l'app Android/iPhone programma
  da sola i promemoria degli appuntamenti del cliente (plugin `@capacitor/local-notifications`, stessi orari/testi/silenzio del gestionale). Si riallineano
  a ogni apertura dell'app: uno spostamento o annullo fatto dal gestionale lo vedono solo allora. Quando si accendono le notifiche del server si
  spengono da soli (niente doppioni). Non ci sono comunicazioni, punti Fidelity né clienti inattivi: servono il server. Il permesso "allarmi esatti"
  è tolto dal manifest (Google Play lo vuole dichiarato): i promemoria hanno qualche minuto di tolleranza. Serve un aggiornamento dell'app.
- **Testi legali e ruoli**: nei testi per i clienti il **Titolare** del trattamento è **Eurogestion**
  (`window.SVILUPPATORE` in `seed.js`, modificabile da `config.js → sviluppatore`; segnaposto `{{svil_nome}}`,
  `{{svil_piva}}`, `{{svil_sede}}`, `{{svil_email}}`). Il **salone** compare col nome (`{{nome}}`) come attività
  presso cui si prenota e **destinatario** dei dati, titolare autonomo per i propri appuntamenti e clienti: per questo
  non serve compilare ragione sociale e P.IVA del salone (bastano nome, telefono, email, indirizzo).
  Le regole tra Eurogestion e il salone stanno nelle condizioni del servizio sul sito (sezione 5), accettate con
  l'Ordine. Il gestionale (Negozio → Testi legali) mostra un riquadro con il link e avvisa se i testi sono stati
  personalizzati e non nominano Eurogestion come titolare. Documenti e privacy della piattaforma sono sul sito
  eurogestionradix.it (repository `Radixsalon-sito`: `condizioni.html`, `privacy.html`). **Sono bozze di partenza:
  farli rivedere da un professionista**, in particolare l'assetto titolare/destinatario. L'Ordine deve prevedere
  l'autorizzazione del salone alla pubblicazione negli store a suo nome e l'approvazione specifica delle clausole.
- **Pagine legali per gli store**: lo sviluppatore negli store è Eurogestion, quindi per Google Play e App Store
  l'indirizzo di privacy, termini e cancellazione account è una pagina sul sito di Eurogestion che indica
  Eurogestion come sviluppatore: `https://eurogestionradix.it/app/<nome>/privacy.html`. Si crea dal repository
  `Radixsalon-sito` con `python3 crea-pagina-app.py <cartella-app> <nome> "<Nome app>"` (copia privacy.html,
  termini.html, cancella-account.html, seed.js, config.js e le adatta; leggono gli stessi dati Firestore dell'app,
  quindi i testi si aggiornano da soli; rigenerare se cambiano seed.js o le pagine dell'app). Poi impostare
  `sitoStore` in `config.js` con quell'indirizzo base (lo usano il gestionale e i tasti "Apri la versione web" dell'app) e pubblicare il sito (`main`). Il link dipende dal dominio
  eurogestionradix.it: rinnovo automatico acceso. Su Google Play il nome sviluppatore è **Master.app** (nome commerciale di
  Eurogestion): le pagine lo dicono nel riquadro e in fondo, per collegare il nome della scheda alla società dei testi
  (Google vuole che la privacy nomini lo sviluppatore della scheda). Se il nome sviluppatore diventa "Eurogestion", togliere
  la riga in `crea-pagina-app.py` e rigenerare le pagine.
- Il pacchetto Java interno è fisso (`app.stampo`, namespace in `build.gradle`): l'identificativo vero
  negli store è `applicationId`, che arriva da `config.js`. Non rinominare le cartelle Java.

## Fabbriche (GitHub Actions)
| Fabbrica | File | Cosa fa |
|---|---|---|
| App Android | `android.yml` | APK (con aggiornamento automatico) + AAB per Google Play. Controllo severo sull'AAB: nel manifest della versione store non deve esserci `REQUEST_INSTALL_PACKAGES` né la parola "fileprovider" (nemmeno nei commenti del manifest) né `AggiornaPlugin`. Alla prima compilazione da `main` crea la chiave di firma (come Radici); senza password firma di prova. Pubblica in Releases solo da `main` con firma vera. |
| App iPhone | `ios.yml` | Compilazione di verifica non firmata; con i 4 segreti Apple e dal ramo `main` firma e carica su TestFlight. |
| Google Play | `google-play.yml` | Manuale: `stato`, `carica-test-interno`, `promuovi-produzione`. Se Google non permette l'invio automatico in revisione (modifiche in sospeso in Play Console, es. dopo un ripristino) salva senza inviare: poi in Play Console → Panoramica della pubblicazione → "Invia per la revisione". |
| Verifica segreti | `verifica-segreti.yml` | Controlla che i segreti ci siano e siano validi, senza cambiare nulla. |
| Notifiche Firebase | `notifiche-firebase.yml` | `prova` (automatica quando cambia `functions/`, non installa nulla) e `installa` (solo a mano, solo da `main`, solo su richiesta del titolare): installa il programma delle notifiche sul progetto Firebase di `config.js`. |
| Verifica Firebase | `verifica-firebase.yml` | Controlla la chiave `FIREBASE_SERVICE_ACCOUNT_JSON` e i suoi permessi, senza cambiare nulla. |

## Segreti GitHub (Settings → Secrets and variables → Actions)
| Segreto | A cosa serve | Note |
|---|---|---|
| `PLAY_SERVICE_ACCOUNT_JSON` | Google Play | Stesso account di servizio per tutte le app; in Play Console va dato il permesso su ogni app. |
| `FIRMA_PASSWORD` (`FIRMA_ALIAS` facoltativo, predefinito `app`) | Firma Android | **Una chiave diversa per ogni app**, come in Radici: il titolare inventa una password lunga (almeno 16 caratteri, la fabbrica rifiuta quelle corte) e la salva; alla prima compilazione da `main` la fabbrica crea `app-android/firma-app.p12` cifrato e lo salva nel repository. Mai cancellare quel file né il segreto. In alternativa la chiave può stare nel segreto `FIRMA_P12_BASE64`. |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Installare il programma delle notifiche | Account di servizio (es. `fabbrica-firebase`) con i ruoli **Editor**, **Service Account User** e **Cloud Functions Admin** sul progetto Firebase. Uno per account Google: si crea una volta e si invita (IAM) negli altri progetti. Radici ne ha uno suo (progetto `radici-app`). |
| `APPSTORE_API_KEY_ID`, `APPSTORE_API_ISSUER_ID`, `APPSTORE_API_KEY_P8`, `APPLE_TEAM_ID` | Apple | Uguali per tutte le app dello stesso account Apple Developer. Non ancora creati. |

I segreti di un'organizzazione GitHub valgono per tutti i suoi repository (con GitHub gratuito solo
per i repository pubblici). `PLAY_SERVICE_ACCOUNT_JSON` è un segreto **dell'organizzazione** (App-modello),
verificato con la fabbrica "Verifica segreti": non va rimesso nei singoli repository (un segreto del repository
con lo stesso nome prevale su quello dell'organizzazione). `FIRMA_PASSWORD` resta invece **del singolo repository**.

## Creare una nuova app (procedura attuale, la fabbrica "Nuova app" è ancora da fare)
1. Il titolare crea il repository nuovo (pubblico) e lo dà a Claude; Claude ci copia lo stampo.
2. Compila `config.js` (nome, sottotitolo, pacchetto, salone, colori, repository, sito, apk, firebase).
3. Firebase (lo fa il titolare, guidato): progetto, app Web/Android/iOS, file `google-services.json`
   (in `app-android/android/app/`) e `GoogleService-Info.plist` (in `app-android/ios/App/App/`),
   accesso email/Google/Apple, regole Firestore (`firestore.rules`), dominio `<org>.github.io` autorizzato,
   account del titolare + documento `saloni/<salone>/admin/<UID>`, impronte SHA della firma.
4. Logo in `logo.png` → `python3 app-android/crea-icone.py`; poi `node app-android/personalizza.js`.
5. Firma: il titolare inserisce il segreto `FIRMA_PASSWORD` (password lunga, salvata da lui); la chiave la crea la fabbrica da sola alla prima compilazione da `main`. Le impronte SHA (riepilogo della compilazione) vanno poi aggiunte in Firebase.
6. Google Play: il titolare crea l'app in Play Console e dà il permesso all'account di servizio;
   poi "carica-test-interno" / "promuovi-produzione" solo su sua richiesta.
7. Sito: Settings → Pages → Deploy from a branch → `main` / root (pagine legali per gli store e gestionale).
8. Apple: quando l'account Apple Developer sarà attivo (guida passo passo, da preparare).
9. Notifiche (quando le vuole il titolare): piano Blaze sul progetto Firebase con avviso di spesa, segreto
   `FIREBASE_SERVICE_ACCOUNT_JSON`, fabbrica "Notifiche Firebase" → `installa` (da `main`), poi nel gestionale
   accendere "Invio notifiche attivo". Per gli iPhone: chiave APNs in Firebase → Cloud Messaging.

## Stato (aggiornare quando cambia)
- Stampo: pubblicato su `main`.
- Segreti a livello di organizzazione: fatto (`PLAY_SERVICE_ACCOUNT_JSON`).
- Da fare: fabbrica "Nuova app", guide per gli store (schede Google Play/App Store) in versione generica,
  account Apple Developer.
- Quando si corregge qualcosa in Radici che vale per tutte le app, riportarlo anche qui (e viceversa):
  i file sono volutamente quasi identici.
