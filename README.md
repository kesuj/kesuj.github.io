# Keshav Jha — Personal Website

A single-page portfolio built with plain HTML, CSS and JavaScript. No build step, no dependencies.

The current layout follows Dymas Alfin's Dribbble shot "Personal Portfolio Website — Animations"
(https://dribbble.com/shots/26995447-Personal-Portfolio-Website-Animations): light page, oversized
outlined name behind a centred portrait, pill navigation, ghost section titles, accordion rows,
a dark experience band and a large contact headline.

## Files

| File | Purpose |
|---|---|
| `index.html` | All page content. Edit text here. |
| `style.css` | Styling. Colours and fonts live in the `:root` block at the top. |
| `script.js` | Hero load animation, name fitting, portrait colour, filters, accordions, reveal on scroll. |
| `assets/` | Photos. See the image slots below. |
| `cv/` | CV as PDF, DOCX and HTML. The site links to `cv/Keshav_Jha_CV.pdf`. |

## Preview locally

Open `index.html` in a browser, or run a tiny server:

```
python -m http.server 8000
```

then visit http://localhost:8000.

## Image slots

Drop files into `assets/` with these names and they appear automatically.

| File | Where it shows |
|---|---|
| `keshav.png` | The hero portrait. A cut-out (transparent background) works best, but a photo on a plain white background also works. Roughly square, at least 1200 px tall. The site falls back to `keshav.jpg`, and hides the portrait if neither exists. |
| `project-rasuwa.jpg`, `project-helmet.jpg`, `project-tracker.jpg`, `project-cleaner.jpg`, `project-bms.jpg`, `project-alarm.jpg` | Project card images |
| `hero-1.jpg` … `hero-5.jpg` | The tilted photo that appears when a row in "What I do" opens |

The photos in `assets/` right now are stock placeholders (see `assets/CREDITS.md`). Replace them with your own.

## Electrical theme

The design stays the same but carries a few engineering details: a copper accent (`--accent` in `style.css`), IBM Plex Mono for labels, numbers and tags, a perfboard dot grid and PCB traces with a current pulse behind the hero, a pulsing LED status dot, a 230 V / 50 Hz marker with a sine wave in the hero footer, an oscilloscope-style graticule on the dark experience band, and a schematic divider (resistor, capacitor, inductor, source) above the contact block. All of it is in the "Electrical theme layer" at the end of `style.css`, so it can be removed by deleting that block.

## Animations

- Hero: letters of the name drop in one by one, the portrait rises, the side blocks slide in.
- Portrait is black and white until you hover the face (tap on phones).
- Section titles have a large ghost word behind them that slides into place on scroll.
- "What I do" rows open on hover (click on touch screens) into a dark panel with a tilted photo.
- Experience rows expand on click.
- Project filter tabs: All, Field, Power, Embedded.

Everything is switched off for users who have "reduce motion" on.

## Deploy for free

**GitHub Pages**
1. Create a repo, push these files to the `main` branch.
2. Settings → Pages → Source: `main` / root. Your site goes live at `https://<username>.github.io/<repo>/`.

**Netlify**
Drag the folder onto https://app.netlify.com/drop. Done.

**Custom domain**
Both services let you point a domain (e.g. `keshavjha.com.np`) at the site in their settings.

## Older versions

| Folder | Design |
|---|---|
| `editorial-version/` | The previous light editorial layout (big two-line headline, image mosaic, full-screen menu). |
| `dark-version/` | The earlier dark design. |
| `site/` | The first draft. |
