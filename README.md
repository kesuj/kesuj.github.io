# Keshav Jha — Personal Website

A single-page portfolio built with plain HTML, CSS and JavaScript. No build step, no dependencies.

Dark theme, modelled on the Dribbble shot "UI Flip – Overhaul of my personal website & portfolio" by Ivo Ivanov: a framed grid with guide lines and corner marks, small mono navigation, a two-tone headline, large project rows, a feature block for the Rasuwa flood survey at the end of the work list, and an accordion for experience. Design notes are in `DESIGN.md`.

## Files

| File | Purpose |
|---|---|
| `index.html` | All page content. Edit text here. |
| `style.css` | Styling. Colours and fonts live in the `:root` block at the top. |
| `script.js` | Mobile menu, active nav link, reveal on scroll. |
| `assets/` | Photos. See the image slots below. |
| `cv/` | CV as PDF, DOCX and HTML. The site links to `cv/Keshav_Jha_CV.pdf`. |

## Preview locally

Open `index.html` in a browser, or run a tiny server:

```
python -m http.server 8000
```

then visit http://localhost:8000.

## Photos

Real photographs of the kind of work, credited in `assets/CREDITS.md` and in the footer. Save your own photo under the same file name to replace one.

## Deploy for free

**GitHub Pages**
1. Create a repo, push these files to the `main` branch.
2. Settings → Pages → Source: `main` / root. Your site goes live at `https://<username>.github.io/<repo>/`.

**Netlify**
Drag the folder onto https://app.netlify.com/drop. Done.

**Custom domain**
Both services let you point a domain (e.g. `keshavjha.com.np`) at the site in their settings.

## Older versions

The previous design (portrait hero, accordions) is in git history, commit f1c32e8.
