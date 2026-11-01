# NS Smart website

The website for **NS Smart**, a Cape Town renovation and construction contractor.
*Smart spaces. Delivered at speed.*

- **Preview (GitHub Pages):** https://abdul-s1.github.io/company-website/
- **Live site:** https://nssmart.co.za (hosted on Xneelo)

The site is plain HTML, CSS and JavaScript. There is **no build step**: what you see
in this folder is exactly what gets uploaded.

---

## Where to find everything

```
company-website/
├── index.html                 Home page
├── services.html              Services
├── projects.html              Our Work (project rows, full gallery, catalogue)
├── about.html                 About
├── quotation.html             Request a Quote
│
├── NS_Smart_Renovation_Catalogue.pdf   The catalogue (keep this exact name and place)
├── logo.png  favicon.png      Logo and browser icon (kept at the top level because
│                              search engines and social previews link to these addresses)
├── robots.txt  sitemap.xml    For search engines
│
├── update-photos.bat          Double-click after dropping in new photos (see below)
├── tools/
│   └── prepare-photos.py      Turns camera photos into web-ready .webp files
│                              (update-photos.bat runs it; don't upload either)
│
└── assets/
    ├── css/
    │   ├── base.css           Brand colours, fonts, type sizes, spacing (start here)
    │   ├── layout.css         Glass header with logo, phone menu, page titles, footer
    │   ├── components.css     Buttons, links, before/after slider, marquee,
    │   │                      contact block, floating contact button, image viewer,
    │   │                      scroll entrances
    │   └── pages/             One file per page, only loaded by that page
    │       ├── home.css  services.css  projects.css  about.css  quotation.css
    │
    ├── js/
    │   ├── main.js            Footer year, floating contact button, gallery
    │   │                      filters and image viewer
    │   ├── nav.js             Phone menu
    │   ├── reveal.js          Scroll entrances + the zoom section on the home page
    │   ├── showreel.js        Home hero: photo window with the timer bar
    │   └── slider.js          The before/after comparison slider
    │
    ├── fonts/                 Inter and Poppins (self-hosted, with their licences)
    └── images/
        ├── brand/             Logo pieces (header logo, opening animation)
        ├── showreel/          Home page showreel photos, 01, 02, 03… in play order
        ├── featured/          our-work-first.webp: the first photo on Our Work
        └── projects/          One folder per project, numbered photos inside
            ├── room-803-deck/         the flagship rooftop deck
            ├── 9th-floor-lobby/  buffet-cladding/  timber-slat-wall/
            ├── ceilings/  ceilings-foyer/  gym/
            ├── lift-lobby/  suite-bathroom/   before/after pairs
            └── bathroom-gallery/      completed-01 … completed-06
```

### Common changes

| I want to… | Go to |
| --- | --- |
| Change a colour or font size everywhere | `assets/css/base.css`, section 2 "Design tokens" |
| Change a phone number or email | Search all `.html` files for the old number and replace it |
| Edit the menu | The `<nav class="main-nav">` block near the top of each page, and the footer menu at the bottom |
| Swap any photo | See **Swapping photos** below |
| Change the showreel speed | `REEL_TIME` at the top of `assets/js/showreel.js` |

Each file starts with a short comment that says what it does, and the HTML uses
comments like `<!-- ===== Hero ===== -->` to mark each section.

### How the before/after slider works

`assets/js/slider.js` looks for any element with `data-compare`. The "after" photo
sits underneath and the "before" photo is laid on top and cropped. You can move it:

- **Mouse:** click or drag anywhere on the photo.
- **Touch:** drag sideways. Swiping up or down still scrolls the page.
- **Keyboard:** Tab to the round handle, then use the arrow keys (hold Shift for bigger
  steps), Page Up/Down, Home and End.

Visitors who have asked their device for reduced motion get no animations anywhere
on the site.

---

## Swapping photos

Every photo on the site is **one file** and **one line** of HTML. The shape of each
photo on the page is set by the CSS, so a new photo of a different size or shape just
fills the same space. You never have to edit sizes.

### The quick way: drop, rename, double-click

1. Open the folder the photo lives in (see the table at the end of this section).
2. Delete the photo you're replacing, e.g. `04.webp`.
3. Drop your new photo in and give it the same name, keeping its own ending,
   e.g. `04.jpg`.
4. Double-click **`update-photos.bat`** in the website folder.

It turns every new JPG/PNG under `assets/images/` into a small `.webp` with the same
name, turns it the right way up, removes hidden GPS data, and deletes the original.
Refresh the page and the new photo is there. You can swap many photos in different
folders and double-click once at the end. (It needs Python, which this computer has.)

**Don't** just rename a `.jpg` to `.webp`: it would be a 3–6 MB file with your GPS
location inside it, on a public website.

### Pointing a spot at a different photo

To show a photo from another folder, open the page's `.html` file, search for the
old file name, and change `src="..."` to the new path. Also update `alt="..."`:
one sentence saying what the photo shows (screen readers and Google read it).

To bring in a whole folder of new photos from elsewhere:

```bash
python tools/prepare-photos.py "C:/path/to/new photos" assets/images/projects/my-new-project
```

### The home page showreel

The showreel photos live in **`assets/images/showreel/`**, named `01.webp`, `02.webp`,
`03.webp`… They play in number order.

- **Swap one:** the quick way above (e.g. delete `04.webp`, drop in `04.jpg`,
  double-click `update-photos.bat`). Then, in `index.html`, update that photo's
  caption (`data-title`) and description (`alt`). Search for
  "HOW TO CHANGE THE SHOWREEL PHOTOS" to find the list.
- **Add one:** save it as the next number (e.g. `10.jpg`), double-click
  `update-photos.bat`, then in `index.html` copy the last showreel line and change
  the number, caption and description.
- **Remove one:** delete its file and its line in `index.html`.
- **Reorder:** rename the files (e.g. swap `02` and `05`), then swap their two
  lines' captions and descriptions.

```html
<img class="showreel__slide" src="assets/images/showreel/01.webp" data-title="Rooftop suite deck, Cape Town" alt="Rooftop suite deck with a granite bar counter...">
```

Landscape photos look best. The timer bar adjusts itself.

### The first photo on Our Work

It's **`assets/images/featured/our-work-first.webp`**. Replace that one file the quick
way (delete it, drop in `our-work-first.jpg`, double-click `update-photos.bat`). If the
new photo shows something different, update its `alt` in `projects.html` (search for
`our-work-first`).

### Before/after sliders

Each slider is a `data-compare` block with two photos: the **after** photo first,
then the **before** photo inside `compare__before`. Use two photos taken from the same
spot. The home page slider also has a portrait pair for phones (the `<source ...>`
lines).

### Our Work: projects and the full gallery

- **Project rows:** each project is one `<article class="project">` block. To change
  its photo, edit the `<img src="...">` inside it. To add a project, copy a whole block.
  The rows swap sides automatically: give every second one the class `project--flip`.
- **Full gallery:** one line per photo:

  ```html
  <button class="gallery__item" type="button" data-project="room-803-deck"><img src="assets/images/projects/room-803-deck/01.webp" loading="lazy" alt="Rooftop bar counter facing the Atlantic"></button>
  ```

  `data-project` puts it under the right filter button (it must match a button's
  `data-filter`). Copy a line to add a photo, delete it to remove one.

### Where every photo is used

Paths below start from `assets/images/`.

| Page | Section | Photo file |
| --- | --- | --- |
| Home | Hero showreel | `showreel/01.webp … 10.webp` |
| Home | What we deliver | `projects/9th-floor-lobby/08.webp` |
| Home | What we deliver | `projects/buffet-cladding/04.webp` |
| Home | What we deliver | `projects/gym/08.webp` |
| Home | What we deliver | `projects/room-803-deck/04.webp` |
| Home | Before and after (phone version) | `projects/suite-bathroom/after-02.webp` |
| Home | Before and after | `projects/lift-lobby/after-02.webp` |
| Home | Before and after (phone version) | `projects/suite-bathroom/before-02.webp` |
| Home | Before and after | `projects/lift-lobby/before-01.webp` |
| Home | Close-up showcase | `projects/room-803-deck/18.webp` |
| Home | Working in open hotels | `projects/9th-floor-lobby/10.webp` |
| Home | Contact call to action | `projects/room-803-deck/06.webp` |
| Services | Page hero | `projects/lift-lobby/after-02.webp` |
| Services | Core services | `projects/bathroom-gallery/completed-03.webp` |
| Services | Core services | `projects/lift-lobby/after-01.webp` |
| Services | Core services | `projects/suite-bathroom/after-01.webp` |
| Services | Core services | `projects/bathroom-gallery/completed-06.webp` |
| Services | How we work | `projects/lift-lobby/before-02.webp` |
| Services | How we work | `projects/suite-bathroom/before-01.webp` |
| Services | How we work | `projects/bathroom-gallery/completed-04.webp` |
| Services | How we work | `projects/bathroom-gallery/completed-02.webp` |
| Services | How we work | `projects/lift-lobby/after-01.webp` |
| Our Work | Projects | `featured/our-work-first.webp` |
| Our Work | Projects | `projects/lift-lobby/after-02.webp` |
| Our Work | Projects | `projects/lift-lobby/before-01.webp` |
| Our Work | Projects | `projects/suite-bathroom/after-02.webp` |
| Our Work | Projects | `projects/suite-bathroom/before-02.webp` |
| Our Work | Projects | `projects/buffet-cladding/03.webp` |
| Our Work | Projects | `projects/timber-slat-wall/01.webp` |
| Our Work | Projects | `projects/ceilings-foyer/04.webp` |
| Our Work | Projects | `projects/gym/02.webp` |
| Our Work | Catalogue download | `projects/room-803-deck/15.webp` |
| Our Work | Catalogue download | `projects/9th-floor-lobby/08.webp` |
| Our Work | Catalogue download | `projects/bathroom-gallery/completed-05.webp` |
| About | Page hero | `projects/bathroom-gallery/completed-02.webp` |
| About | Our company | `projects/lift-lobby/after-01.webp` |
| About | Photo strip | `projects/bathroom-gallery/completed-03.webp` |
| About | Photo strip | `projects/lift-lobby/after-02.webp` |
| About | Photo strip | `projects/suite-bathroom/after-01.webp` |
| Request a Quote |  | `brand/logo-480.webp` |
| Request a Quote | Recent work | `projects/lift-lobby/after-02.webp` |
| Request a Quote | Recent work | `projects/bathroom-gallery/completed-05.webp` |
| Request a Quote | Recent work | `projects/bathroom-gallery/completed-01.webp` |
| Request a Quote | Recent work | `projects/lift-lobby/after-01.webp` |
| Our Work | Full gallery | 51 photos, one line each, in `projects.html` under "Full gallery" |

---

## Uploading to Xneelo

1. Log in to the Xneelo control panel and open **File Manager** for nssmart.co.za
   (or connect with an FTP program such as FileZilla).
2. Open the `public_html` folder.
3. Upload these files and folders, replacing what is there:
   - `index.html`, `services.html`, `projects.html`, `about.html`, `quotation.html`
   - the whole `assets` folder
   - `logo.png`, `favicon.png`, `robots.txt`, `sitemap.xml`
   - `NS_Smart_Renovation_Catalogue.pdf`
4. **Don't upload** `README.md`, `.gitignore`, `update-photos.bat`, the `tools` folder, the `.git` folder,
   or a `.taste-skill` or `.claude` folder.
5. Optional tidy-up: the old site had loose files in `assets/css/` (`site.css`,
   `home.css`, …), `assets/js/` (`site.js`, `projects.js`) and flat images in
   `assets/images/projects/` (`completed-bathroom-01.webp`, …). The new site doesn't
   use them, so you can delete them from the server once the new pages are live.
6. Open https://nssmart.co.za in a private window and check every page on your
   computer and your phone.

## Previewing changes

Push to the `main` branch on GitHub and the preview at
https://abdul-s1.github.io/company-website/ updates within a minute or two.
To preview locally, open `index.html` in a browser.

## Ground rules

- This repository is **public**. Never add pricing, financial details, private notes or
  any photo marked "do not publish" in the photo index.
- Only use real project photos, never stock or AI-generated ones.
- Keep the page file names, the catalogue address and the `<head>` tags (titles,
  descriptions, canonical links, structured data). Search engines rely on them.
