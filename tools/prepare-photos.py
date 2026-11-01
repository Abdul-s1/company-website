"""
NS SMART — prepare-photos.py
Turns phone/camera photos into web-ready files for the website.

What it does to every JPG/PNG/WEBP in the folder you give it:
  - turns it the right way up (phones store rotation separately)
  - shrinks it to at most 1600 pixels on its longest side
  - saves it as .webp (much smaller than .jpg, same look)
  - removes hidden data such as GPS location and camera details

How to use it (needs Python and Pillow: `python -m pip install pillow`):

    python tools/prepare-photos.py "C:/path/to/my new photos" assets/images/projects/my-new-project

The second folder is created if it doesn't exist. Files keep their names,
so "lobby.jpg" becomes "lobby.webp". Then point an <img src="..."> at it
(see "Swapping photos" in README.md).

This tool is only for preparing photos. Don't upload the tools folder to Xneelo.
"""
import sys
from pathlib import Path
from PIL import Image, ImageOps

MAX_SIZE = 1600   # longest side, in pixels
QUALITY = 80      # 0-100; 80 looks the same as the original at a fraction of the size


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    source, target = Path(sys.argv[1]), Path(sys.argv[2])
    target.mkdir(parents=True, exist_ok=True)
    photos = [p for p in sorted(source.iterdir()) if p.suffix.lower() in ('.jpg', '.jpeg', '.png', '.webp')]
    if not photos:
        print(f'No JPG, PNG or WEBP photos found in {source}')
        sys.exit(1)
    for photo in photos:
        image = ImageOps.exif_transpose(Image.open(photo)).convert('RGB')
        image.thumbnail((MAX_SIZE, MAX_SIZE), Image.LANCZOS)
        out = target / (photo.stem + '.webp')
        image.save(out, quality=QUALITY, method=6)   # saved without the original's hidden data
        print(f'{photo.name}  ->  {out.as_posix()}  ({image.width}x{image.height}, {out.stat().st_size // 1024} KB)')


if __name__ == '__main__':
    main()
