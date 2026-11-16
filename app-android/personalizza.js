// Copia le impostazioni di ../config.js nei file che non possono leggerlo da soli:
// progetto Android, progetto iPhone, Capacitor, manifest del sito e intestazione di index.html.
// Si può lanciare quante volte si vuole (node personalizza.js): riscrive sempre gli stessi punti.
// Le fabbriche di GitHub lo lanciano prima di ogni compilazione.
const fs = require('fs'), path = require('path'), vm = require('vm');
const radice = path.join(__dirname, '..');
const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync(path.join(radice, 'config.js'), 'utf8'), ctx);
const A = ctx.window.APP;

// controlli: un errore qui ferma la compilazione con un messaggio chiaro
const errori = [];
if (!/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*){1,}$/.test(A.pacchetto || '')) errori.push(`pacchetto "${A.pacchetto}" non valido: solo minuscole, numeri e punti (es. it.negozio.prenota)`);
if (!/^[a-z0-9_-]+$/.test(A.salone || '')) errori.push(`salone "${A.salone}" non valido: minuscole senza spazi`);
for (const k of ['coloreAvvio', 'coloreTema']) if (!/^#[0-9A-Fa-f]{6}$/.test(A[k] || '')) errori.push(`${k} "${A[k]}" non è un colore #RRGGBB`);
if (!A.nome) errori.push('manca il nome');
if (errori.length) { console.error('config.js:\n - ' + errori.join('\n - ')); process.exit(1); }

const xml = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const attr = t => xml(t).replace(/'/g, '&#39;');
function cambia(rel, sostituzioni) {
  const f = path.join(radice, rel); let s = fs.readFileSync(f, 'utf8'); const prima = s;
  for (const [re, v] of sostituzioni) { if (!re.test(s)) { console.error(`personalizza: in ${rel} non trovo ${re}`); process.exit(1); } s = s.replace(re, v); }
  if (s !== prima) { fs.writeFileSync(f, s); console.log('aggiornato', rel); }
}

// Capacitor
const capF = path.join(__dirname, 'capacitor.config.json'), cap = JSON.parse(fs.readFileSync(capF, 'utf8'));
cap.appId = A.pacchetto; cap.appName = A.nome; cap.android.backgroundColor = A.coloreAvvio; cap.ios.backgroundColor = A.coloreAvvio;
fs.writeFileSync(capF, JSON.stringify(cap, null, 2) + '\n');

// Android
cambia('app-android/android/app/build.gradle', [[/applicationId "[^"]*"/, () => `applicationId "${A.pacchetto}"`]]);
cambia('app-android/android/app/src/main/res/values/strings.xml', [
  [/(<string name="app_name">)[^<]*(<\/string>)/, (_, a, b) => a + xml(A.nome) + b],
  [/(<string name="title_activity_main">)[^<]*(<\/string>)/, (_, a, b) => a + xml(A.nome) + b],
  [/(<string name="package_name">)[^<]*(<\/string>)/, (_, a, b) => a + A.pacchetto + b],
  [/(<string name="custom_url_scheme">)[^<]*(<\/string>)/, (_, a, b) => a + A.pacchetto + b]]);
cambia('app-android/android/app/src/main/res/values/colors.xml', [[/(<color name="notifica">)[^<]*(<\/color>)/, (_, a, b) => a + A.coloreAvvio + b]]);
cambia('app-android/android/app/src/main/res/values/ic_launcher_background.xml', [[/(<color name="ic_launcher_background">)[^<]*(<\/color>)/, (_, a, b) => a + A.coloreTema + b]]);

// iPhone
cambia('app-android/ios/App/App.xcodeproj/project.pbxproj', [[/PRODUCT_BUNDLE_IDENTIFIER = [^;]*;/g, () => `PRODUCT_BUNDLE_IDENTIFIER = ${A.pacchetto};`]]);
cambia('app-android/ios/App/App/Info.plist', [[/(<key>CFBundleDisplayName<\/key>\s*<string>)[^<]*(<\/string>)/, (_, a, b) => a + xml(A.nome) + b]]);

// Sito: manifest e intestazione di index.html (il resto lo legge da config.js mentre gira)
const manF = path.join(radice, 'manifest.webmanifest'), man = JSON.parse(fs.readFileSync(manF, 'utf8'));
Object.assign(man, { id: A.salone + '-prenota', name: A.nome + ' – Prenota', short_name: A.nome, description: A.descrizione, theme_color: A.coloreTema });
fs.writeFileSync(manF, JSON.stringify(man, null, 2) + '\n');
cambia('index.html', [
  [/<title>[^<]*<\/title>/, () => `<title>${xml(A.nome)} – Prenota</title>`],
  [/(<meta name="description" content=")[^"]*(">)/, (_, a, b) => a + attr(A.descrizione) + b],
  [/(<meta name="apple-mobile-web-app-title" content=")[^"]*(">)/, (_, a, b) => a + attr(A.nome) + b]]);

console.log(`Impostazioni applicate: ${A.nome} (${A.pacchetto}), negozio "${A.salone}"`);
