#!/usr/bin/env python3
"""
QR Code Studio — local CLI companion
Developer: Dr. Solution Tech (https://github.com/SoLuTiOnExE)

This script is a standalone, offline tool. It is NOT used by the GitHub
Pages site (browsers can't run Python) — the live web app at index.html
does everything in JavaScript. Use this script when you want to generate
or read QR codes from your terminal instead.

Usage:
    python qr_cli.py generate -d "https://github.com/SoLuTiOnExE" -o my_qr.png
    python qr_cli.py generate -d "Hello World" -o text_qr.png --type text
    python qr_cli.py generate -d "https://instagram.com/yourpage" -o ig_qr.png --logo instagram
    python qr_cli.py generate -d "https://wa.me/2348120729938" -o wa_qr.png --logo assets/my_logo.png
    python qr_cli.py read -i my_qr.png

Run "python qr_cli.py generate -h" or "python qr_cli.py read -h" for all options.
"""

import argparse
import sys
import os

try:
    import qrcode
    from qrcode.constants import ERROR_CORRECT_H
    from PIL import Image
except ImportError:
    sys.exit(
        "Missing packages. Install them first:\n"
        "    pip install qrcode[pil] pillow opencv-python-headless"
    )

# Built-in brand presets (downloaded on demand from Simple Icons via the web
# app; for the CLI we just ship simple colored circle placeholders so the
# script works fully offline with zero extra downloads).
BRAND_COLORS = {
    "instagram": "#E4405F",
    "whatsapp": "#25D366",
    "tiktok": "#000000",
    "linkedin": "#0A66C2",
}


def make_logo_circle(color_hex, size=200):
    """Create a simple solid-color circle logo (offline fallback) when a
    brand name is requested instead of a custom image path."""
    from PIL import ImageDraw

    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.ellipse((0, 0, size, size), fill=color_hex)
    return img


def generate(args):
    data = args.data
    if args.type == "link" and not data.lower().startswith(("http://", "https://")):
        data = "https://" + data

    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_H,  # high correction needed when a logo covers part of the code
        box_size=args.box_size,
        border=args.border,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(
        fill_color=args.fg, back_color=args.bg
    ).convert("RGBA")

    logo_img = None
    if args.logo:
        if args.logo in BRAND_COLORS:
            logo_img = make_logo_circle(BRAND_COLORS[args.logo])
        elif os.path.isfile(args.logo):
            logo_img = Image.open(args.logo).convert("RGBA")
        else:
            sys.exit(
                f"Logo '{args.logo}' is not a known preset "
                f"({', '.join(BRAND_COLORS)}) or a valid file path."
            )

    if logo_img:
        qr_w, qr_h = img.size
        logo_max = int(qr_w * 0.22)  # keep logo small enough that the QR stays scannable
        logo_img.thumbnail((logo_max, logo_max), Image.LANCZOS)

        # white padded backdrop so the logo stays legible over QR modules
        pad = int(logo_max * 0.18)
        backdrop_size = logo_img.size[0] + pad * 2
        backdrop = Image.new("RGBA", (backdrop_size, backdrop_size), (255, 255, 255, 255))
        backdrop.paste(
            logo_img,
            ((backdrop_size - logo_img.size[0]) // 2, (backdrop_size - logo_img.size[1]) // 2),
            logo_img,
        )

        pos = ((qr_w - backdrop_size) // 2, (qr_h - backdrop_size) // 2)
        img.paste(backdrop, pos, backdrop)

    img.save(args.output)
    print(f"Saved {args.output} ({img.size[0]}x{img.size[1]}px)")


def read(args):
    import cv2

    if not os.path.isfile(args.image):
        sys.exit(f"File not found: {args.image}")

    img = cv2.imread(args.image)
    if img is None:
        sys.exit(f"Could not open image: {args.image}")

    detector = cv2.QRCodeDetector()
    data, points, _ = detector.detectAndDecode(img)

    if not data:
        sys.exit("No QR code detected in that image.")

    print("Decoded content:")
    print(data)
    if data.lower().startswith(("http://", "https://")):
        print("\n(This looks like a link.)")


def main():
    parser = argparse.ArgumentParser(
        description="Dr. Solution Tech — QR Code Studio CLI (offline generate/read tool)"
    )
    sub = parser.add_subparsers(dest="command", required=True)

    gen = sub.add_parser("generate", help="Create a QR code (plain or with a center logo)")
    gen.add_argument("-d", "--data", required=True, help="Link or text to encode")
    gen.add_argument("-o", "--output", default="qrcode.png", help="Output PNG file path")
    gen.add_argument("--type", choices=["link", "text"], default="link",
                      help="Treat data as a link (auto-adds https://) or plain text")
    gen.add_argument("--logo", help=f"Preset name ({', '.join(BRAND_COLORS)}) or a path to your own image")
    gen.add_argument("--fg", default="#080B12", help="Foreground (module) color, hex. Default: #080B12")
    gen.add_argument("--bg", default="#FFFFFF", help="Background color, hex. Default: #FFFFFF")
    gen.add_argument("--box-size", type=int, default=10, help="Pixel size of each QR module")
    gen.add_argument("--border", type=int, default=4, help="Quiet-zone border width in modules")
    gen.set_defaults(func=generate)

    rd = sub.add_parser("read", help="Decode a QR code from an image file")
    rd.add_argument("-i", "--image", required=True, help="Path to the image containing a QR code")
    rd.set_defaults(func=read)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
