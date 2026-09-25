# QR Code Studio

A free, custom QR code generator and reader — built with plain **HTML, CSS, and JavaScript** so it runs entirely in the browser and deploys straight to **GitHub Pages**. A standalone **Python CLI** is included too, for generating or reading QR codes from your terminal.

**Live demo:** once deployed, yours will be at `https://drsolutiontech.github.io/QR-Code-Generator-/`

Built by **Dr. Solution Tech** — [Dr Solution Tech](https://github.com/drsolutiontech)

---

## Features

**Generate**
- Encode a **link/URL** or **plain text**
- Add a **center icon** — built-in Instagram, WhatsApp, TikTok, and LinkedIn presets, or **upload your own logo/image**
- Or leave it plain — no icon at all
- Customize pattern style (square, dots, rounded, classy...), corner style, foreground color, and background color
- Live preview as you type
- Download as **PNG** or **SVG**

**Scan & Read**
- Upload/drag-and-drop an image to decode any QR code in it
- Or scan live using your **device camera**
- Auto-detects links and gives you an "Open link" button, plus one-tap copy

Everything runs client-side. No server, no database, no file ever leaves the visitor's browser.

---

## Project structure

```
qr-code-studio/
├── index.html              ← the whole web app (entry point for GitHub Pages)
├── assets/
│   ├── css/style.css
│   └── js/app.js
├── python/
│   ├── qr_cli.py            ← standalone offline CLI (optional, not used by the website)
│   └── requirements.txt
└── README.md
```

> **Why isn't Python used on the live site?** GitHub Pages only serves static files — browsers can't execute Python. The website (`index.html` + `app.js`) does everything in JavaScript instead, using two well-established open-source libraries loaded from a CDN: [`qr-code-styling`](https://github.com/kozakdenys/qr-code-styling) for generation and [`html5-qrcode`](https://github.com/mebjas/html5-qrcode) for scanning. The Python script is a separate, optional tool for generating/reading QR codes from your own computer.

---

## Deploy to GitHub Pages

1. Create a new repository on GitHub (e.g. `qr-code-studio`) and push this folder to it:
   ```bash
   cd qr-code-studio
   git init
   git add .
   git commit -m "QR Code Studio — initial commit"
   git branch -M main
   git remote add origin https://github.com/SoLuTiOnExE/qr-code-studio.git
   git push -u origin main
   ```
2. On GitHub, go to **Settings → Pages**.
3. Under **Source**, choose **Deploy from a branch**, pick the `main` branch and `/ (root)` folder, then **Save**.
4. Wait a minute, then your site will be live at:
   `https://SoLuTiOnExE.github.io/qr-code-studio/`

No build step, no `npm install` needed for the website — it's ready as-is.

---

## Running locally

Just open `index.html` in a browser — but for camera scanning to work, browsers require either `https://` or `localhost` (not the plain `file://` path). The easiest way:

```bash
cd qr-code-studio
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

---

## Using the Python CLI (optional, offline)

```bash
cd python
pip install -r requirements.txt

# Generate a plain QR code for a link
python qr_cli.py generate -d "https://github.com/SoLuTiOnExE" -o my_qr.png

# Generate a QR code for plain text
python qr_cli.py generate -d "Hello from Dr. Solution Tech" -o text_qr.png --type text

# Generate with a brand-preset center icon
python qr_cli.py generate -d "https://instagram.com/yourpage" -o ig_qr.png --logo instagram
# presets: instagram, whatsapp, tiktok, linkedin

# Generate with your own logo image
python qr_cli.py generate -d "https://wa.me/2348120729938" -o wa_qr.png --logo path/to/logo.png

# Custom colors
python qr_cli.py generate -d "https://yoursite.com" -o branded.png --fg "#FF6B2C" --bg "#080B12"

# Read/decode a QR code from an image
python qr_cli.py read -i my_qr.png
```

Run `python qr_cli.py generate -h` or `python qr_cli.py read -h` to see every option.

> Note: the CLI's brand presets render as plain colored circles (fully offline, zero extra downloads). For the exact official logos, use the web app, or download an icon yourself and pass it with `--logo path/to/icon.png`.

---

## Customizing the look

The whole design lives in `assets/css/style.css` as CSS variables at the top of the file (`:root { ... }`) — colors, fonts, radius, etc. Change those and the entire site updates.

---

## Tech used

- **qr-code-styling** — QR generation with logos, custom dot/corner shapes, and colors
- **html5-qrcode** — camera-based and image-based QR scanning
- **Simple Icons CDN** — official brand icon artwork for the Instagram/WhatsApp/TikTok/LinkedIn presets
- **Google Fonts** — Syne (headings) + DM Sans (body) + DM Mono (data/code text)

---

## Need a custom build?

**Dr. Solution Tech** — web development & business software.

- GitHub: [github.com/SoLuTiOnExE](https://github.com/SoLuTiOnExE)
- Email: fasanyaayomide2019@gmail.com
- WhatsApp / Call: +234 812 072 9938

Free starter builds and budget-friendly projects welcome — reach out.
