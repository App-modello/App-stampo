/* =====================================================================
   IMPOSTAZIONI DELL'APP – l'unico file da cambiare per creare una nuova app.
   Lo leggono: il sito e l'app (index.html, app.js, pagine legali) e lo script
   app-android/personalizza.js, che copia nome, pacchetto e colori nei progetti
   Android e iPhone. Le fabbriche di GitHub lanciano personalizza.js da sole.

   Tutto il resto del negozio (servizi, orari, staff, testi legali, fidelity)
   NON sta qui: lo imposta il titolare dal gestionale e arriva da Firebase
   (documento saloni/<salone>). I valori di partenza sono in seed.js.
   ===================================================================== */
window.APP = {
  /* Nome mostrato sotto l'icona del telefono e negli store (breve, max ~12 caratteri) */
  nome: 'Nome App',
  /* Seconda riga del marchio (es. il nome completo del negozio) */
  sottotitolo: 'Nome del negozio',
  /* Frase per i motori di ricerca e per il manifest del sito */
  descrizione: 'Prenota il tuo appuntamento.',

  /* Identificativo dell'app negli store: unico al mondo e NON si cambia più dopo la prima pubblicazione.
     Solo lettere minuscole, numeri e punti, es. it.nomenegozio.prenota */
  pacchetto: 'it.appmodello.prenota',

  /* Codice del negozio in Firebase: saloni/<salone> (minuscole, senza spazi) */
  salone: 'modello',

  /* Colore di sfondo all'avvio dell'app (Android e iPhone) e colore del tema del sito */
  coloreAvvio: '#6E7A3C',
  coloreTema: '#8E9A55',

  /* Marchio della schermata iniziale: 'semplice' (solo la scritta) oppure 'radici' (le radici crescono dalle lettere) */
  marchio: 'semplice',

  /* Chi sviluppa e fornisce l'app. Compare nei testi legali come "sviluppatore" e "responsabile del trattamento".
     Di solito resta quello di Eurogestion: togli il commento solo se l'app è fornita da un'altra società. */
  // sviluppatore: { nome: 'Nome società', piva: '00000000000', sede: 'Via ..., CAP Città (XX)', email: 'info@esempio.it', sito: 'https://esempio.it' },

  /* Repository GitHub dell'app (proprietario/nome): da qui l'APK scarica gli aggiornamenti */
  repository: 'App-modello/App-stampo',
  /* Indirizzo del sito pubblicato (GitHub Pages), con la barra finale: serve per i link a privacy e termini */
  sito: 'https://app-modello.github.io/App-stampo/',
  /* Indirizzo delle pagine legali PER GLI STORE, sul sito di Eurogestion (lo sviluppatore): privacy, termini e cancellazione account.
     Si creano con crea-pagina-app.py nel repository Radixsalon-sito. Lascia vuoto per usare 'sito' qui sopra. */
  sitoStore: '',  // es. 'https://eurogestionradix.it/app/nomeapp/'

  /* Nome del file APK pubblicato nelle Releases (senza spazi) */
  apk: 'App.apk',

  /* Configurazione web di Firebase: Console Firebase → ⚙ Impostazioni progetto → Le tue app → app Web → Configurazione.
     Questi valori non sono segreti (finiscono comunque nel sito): la sicurezza la fanno le regole di Firestore. */
  firebase: {
    apiKey: 'DA-COMPILARE',
    authDomain: 'DA-COMPILARE.firebaseapp.com',
    projectId: 'DA-COMPILARE',
    storageBucket: 'DA-COMPILARE.firebasestorage.app',
    messagingSenderId: '0',
    appId: 'DA-COMPILARE'
  }
};
