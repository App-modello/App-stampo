# Crea tutte le icone dell'app (sito, Android, iPhone) e le schermate di avvio.
# Fonte: ../logo.png (quadrato, almeno 1024x1024, possibilmente con sfondo pieno).
# Se logo.png non c'è, disegna l'iniziale del nome su sfondo del colore del tema (icona provvisoria).
# Uso: pip install pillow && python3 app-android/crea-icone.py   (dalla cartella principale o da app-android)
import os, re, sys
from PIL import Image, ImageDraw, ImageFont

QUI = os.path.dirname(os.path.abspath(__file__)); RADICE = os.path.dirname(QUI)
cfg = open(os.path.join(RADICE, 'config.js'), encoding='utf-8').read()
def val(k):
    m = re.search(r"\b" + k + r":\s*'([^']*)'", cfg); return m.group(1) if m else ''
nome, tema, avvio = val('nome') or 'App', val('coloreTema') or '#8E9A55', val('coloreAvvio') or '#6E7A3C'
rgb = lambda h: tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))

def font(px):
    for f in ['/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', '/Library/Fonts/Arial Bold.ttf', 'C:/Windows/Fonts/arialbd.ttf']:
        if os.path.exists(f): return ImageFont.truetype(f, px)
    return ImageFont.load_default()

def lettera(lato, sfondo, scala=0.55):
    im = Image.new('RGBA', (lato, lato), sfondo)
    d = ImageDraw.Draw(im); t = (nome.strip()[:1] or 'A').upper(); f = font(int(lato * scala))
    b = d.textbbox((0, 0), t, font=f); d.text(((lato - (b[2] - b[0])) / 2 - b[0], (lato - (b[3] - b[1])) / 2 - b[1]), t, font=f, fill=(255, 255, 255, 255))
    return im

logo_f = os.path.join(RADICE, 'logo.png')
if os.path.exists(logo_f):
    base = Image.open(logo_f).convert('RGBA'); print('Uso logo.png', base.size)
else:
    base = lettera(1024, rgb(tema) + (255,)); print('logo.png assente: icona provvisoria con l\'iniziale di', nome)

def salva(im, rel, modo='RGBA'):
    p = os.path.join(RADICE, rel); os.makedirs(os.path.dirname(p), exist_ok=True)
    (im.convert(modo) if modo else im).save(p, optimize=True); print('  ', rel, im.size)

def quadrata(lato): return base.resize((lato, lato), Image.LANCZOS)
def tonda(lato):
    m = Image.new('L', (lato, lato), 0); ImageDraw.Draw(m).ellipse((0, 0, lato - 1, lato - 1), fill=255)
    im = quadrata(lato); im.putalpha(m); return im
def primo_piano(lato):  # icona adattiva Android: il disegno deve stare nel 61% centrale
    im = Image.new('RGBA', (lato, lato), (0, 0, 0, 0)); s = int(lato * 0.61); o = (lato - s) // 2
    im.paste(quadrata(s), (o, o)); return im
def avvio_img(w, h):
    im = Image.new('RGB', (w, h), rgb(avvio)); s = int(min(w, h) * 0.28)
    im.paste(tonda(s), ((w - s) // 2, (h - s) // 2), tonda(s)); return im

salva(quadrata(192), 'icon-192.png', 'RGB'); salva(quadrata(512), 'icon-512.png', 'RGB')
res = 'app-android/android/app/src/main/res/'
for d, px in {'mdpi': 48, 'hdpi': 72, 'xhdpi': 96, 'xxhdpi': 144, 'xxxhdpi': 192}.items():
    salva(quadrata(px), res + f'mipmap-{d}/ic_launcher.png'); salva(tonda(px), res + f'mipmap-{d}/ic_launcher_round.png')
    salva(primo_piano(int(px * 2.25)), res + f'mipmap-{d}/ic_launcher_foreground.png')
for d, (w, h) in {'': (480, 320), 'land-mdpi': (480, 320), 'land-hdpi': (800, 480), 'land-xhdpi': (1280, 720), 'land-xxhdpi': (1600, 960), 'land-xxxhdpi': (1920, 1280),
                  'port-mdpi': (320, 480), 'port-hdpi': (480, 800), 'port-xhdpi': (720, 1280), 'port-xxhdpi': (960, 1600), 'port-xxxhdpi': (1280, 1920)}.items():
    salva(avvio_img(w, h), res + ('drawable' + ('-' + d if d else '')) + '/splash.png', 'RGB')
ios = 'app-android/ios/App/App/Assets.xcassets/'
salva(quadrata(1024), ios + 'AppIcon.appiconset/AppIcon-512@2x.png', 'RGB')  # Apple: niente trasparenza
for n in ['splash-2732x2732.png', 'splash-2732x2732-1.png', 'splash-2732x2732-2.png']:
    salva(avvio_img(2732, 2732), ios + 'Splash.imageset/' + n, 'RGB')
print('Icone create.')
