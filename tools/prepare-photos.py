"""
NS SMART — prepare-photos.py
Turns phone/camera photos into web-ready files for the website.

What it does to each photo:
  - turns it the right way up (phones store rotation separately)
  - shrinks it to at most 1600 pixels on its longest side
  - saves it as .webp (much smaller than .jpg, same look)
  - removes hidden data such as GPS location and camera details

TWO WAYS TO USE IT (needs Python and Pillow: `python -m pip install pillow`)

1. Swap in place (easiest). Drop a JPG or PNG into any folder under
   assets/images/, named like the photo it replaces (e.g. delete 04.webp and
   drop in 04.jpg). Then double-click update-photos.bat in the website folder,
   or run:

       python tools/prepare-photos.py

   Every JPG/PNG under assets/images/ becomes a .webp with the same name,
   and the original JPG/PNG is deleted.

2. Folder to folder. Convert a whole folder of photos somewhere else into a
   folder of the site, keeping their names:

       python tools/prepare-photos.py "C:/path/to/new photos" assets/images/projects/my-new-project

This tool is only for preparing photos. Don't upload the tools folder to Xneelo.
"""
import sys
from pathlib import Path
from PIL import Image, ImageOps

MAX_SIZE = 1600   # longest side, in pixels
QUALITY = 80      # 0-100; 80 looks the same as the original at a fraction of the size
PHOTO_TYPES = ('.jpg', '.jpeg', '.png', '.webp')
SITE_IMAGES = Path(__file__).resolve().parent.parent / 'assets' / 'images'


def convert(photo, out):
    """Save one photo as a web-ready .webp at `out`."""
    image = ImageOps.exif_transpose(Image.open(photo)).convert('RGB')
    image.thumbnail((MAX_SIZE, MAX_SIZE), Image.LANCZOS)
    image.save(out, quality=QUALITY, method=6)   # saved without the original's hidden data
    print(f'  {photo.name}  ->  {out.name}  ({image.width}x{image.height}, {out.stat().st_size // 1024} KB)')


def swap_in_place():
    """Mode 1: convert every JPG/PNG under assets/images/ and delete the original."""
    photos = [p for p in sorted(SITE_IMAGES.rglob('*')) if p.suffix.lower() in ('.jpg', '.jpeg', '.png')]
    if not photos:
        print('No new JPG or PNG photos found under assets/images/. Nothing to do.')
        return
    for photo in photos:
        out = photo.with_suffix('.webp')
        print(photo.parent.relative_to(SITE_IMAGES).as_posix() + '/')
        convert(photo, out)
        photo.unlink()
    print(f'\nDone: {len(photos)} photo(s) ready. Refresh the page in your browser to see them.')


def folder_to_folder(source, target):
    """Mode 2: convert every photo in `source` into `target`, keeping names."""
    target.mkdir(parents=True, exist_ok=True)
    photos = [p for p in sorted(source.iterdir()) if p.suffix.lower() in PHOTO_TYPES]
    if not photos:
        print(f'No JPG, PNG or WEBP photos found in {source}')
        sys.exit(1)
    for photo in photos:
        convert(photo, target / (photo.stem + '.webp'))


if __name__ == '__main__':
    if len(sys.argv) == 1:
        swap_in_place()
    elif len(sys.argv) == 3:
        folder_to_folder(Path(sys.argv[1]), Path(sys.argv[2]))
    else:
        print(__doc__)
        sys.exit(1)
