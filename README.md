# App-stampo

Stampo per creare nuove app di prenotazione per negozi (sito + app Android + app iPhone),
nato dall'app Radici.

- **Impostazioni dell'app**: tutte in [`config.js`](config.js).
- **Dati del negozio** (servizi, orari, staff, testi): dal gestionale, tramite Firebase.
- **Icone**: metti il logo in `logo.png` (1024×1024) e lancia `python3 app-android/crea-icone.py`.
- **Compilazioni**: GitHub Actions → "App Android", "App iPhone", "Google Play".
- Istruzioni complete in [`CLAUDE.md`](CLAUDE.md).
