# Aayaadi Designs: website concept (unofficial)

A private, static, one-page website concept for **Aayaadi Designs**, an interior design studio in Gurugram. It is an independent concept prepared for discussion. **It is not Aayaadi's official website.** Do not deploy it publicly or put it on any Aayaadi domain or account. The page carries `noindex, nofollow`.

The page is built on the supplied "Asterix" starter (plain HTML, CSS and JS, no build step). The starter's layout and motion system are kept, and every template brand, image and fictional claim has been replaced or removed.

**Status:** the static first pass is done. Images are optimised. Motion pass 01 (hero entrance) and motion pass 02 (Studio statement line reveal) are in place. The remaining sections still use the starter's existing motion, unchanged. See `BUILD_LOG.md`.

## Run it locally

There is no build step. Serve the folder (opening `index.html` directly also works, but a server is closer to the real thing):

```bash
cd aayaadi-designs-demo
npx serve .                 # then open the URL it prints
# or
python -m http.server 8000  # then open http://localhost:8000/
```

On the machine this was built on, Python is only the Microsoft Store alias (not installed), so use `npx serve .` there.

You need internet access for the Geist font and the GSAP, ScrollTrigger and Lenis CDN scripts. Without them, the page falls back to a fully readable static layout in system fonts.

## File map

```
index.html            the page: all sections, copy, image references
css/style.css         design tokens (:root), layout, responsive rules (<= 760px), reduced-motion
js/main.js            layer 1 (always on): details carousel, Form/Material/Light/Detail preview buttons,
                      compact scroll-up bar, gallery lightbox (<dialog>), hero hairline
                      layer 2 (GSAP + ScrollTrigger + Lenis, if loaded and motion allowed):
                      hero entrance + scroll-away (initHero), studio line reveal (setupStatement), gallery parallax,
                      one pin, closing-section reveal
js/brand.js           typographic wordmark splitter for the footer (placeholder, not the studio's logo)
img/aayaadi/web/      WebP derivatives the page actually loads (<original>-<width>.webp)
img/aayaadi/*.jpg     13 full-size copies with their original filenames; not loaded by the page,
                      kept for reference (leave them out of a preview upload)
ASSET_MANIFEST.md     audit of all 63 source images: groups, selections, open questions
BUILD_LOG.md          what was inspected, changed and tested; known issues; next phase
_handoff/             untouched copy of the handoff bundle (plan docs + original ZIPs)      [read-only]
_source-assets/       the three photo archives, extracted, one folder per ZIP               [read-only]
_reference/           untouched extract of asterix-template.zip, for baseline and diffing   [read-only]
```

The three underscore folders are source material, not part of the site. Leave them out of any preview upload.

## Page sections (top to bottom)

| Id | Section | Content rule |
|---|---|---|
| `#top` | Hero: typographic wordmark, nav, "Spaces, shaped around living.", enquiry button | Concept copy; no ratings or awards |
| `#studio` | Short studio statement and three thumbnails | Draft concept copy, labelled as such on the page |
| `#work` | "Selected work": four photos with neutral room labels; each opens larger in a lightbox with its caption | No project names, areas, locations or dates; no project pages implied |
| `#themes` | Form / Material / Light / Detail preview buttons (hover, focus or tap shows a photograph) | Template style counts removed |
| `#details` | "Closer looks" carousel of three real photos with descriptive captions | Replaces the starter's fictional design-process carousel and `iso.js` |
| `#enquire` | "Let's shape your space." with call and Instagram buttons | Replaces the fictional testimonials |
| `#contact` | Footer: phone, studio address (links to the Google Maps listing), Instagram, concept disclaimer | Contact details come from the public listings in the handoff and **still need confirming** |

The starter's partner-logo marquee and FAQ were removed because nothing in them could be verified. Restore them from `_reference/asterix-template/` only once there are real partners, or real answers approved by the studio.

## Libraries (pinned, via CDN)

- GSAP 3.12.5 and ScrollTrigger (cdnjs)
- Lenis 1.1.13 (jsDelivr)
- Google Fonts Geist (the starter's Allura script font was dropped along with its ampersand)

## How to change things

- **Photos:** generate WebP widths into `img/aayaadi/web/`, named `<original>-<width>.webp` (`ASSET_MANIFEST.md` records the settings used). Update that image's `src`, `srcset` and `sizes` in `index.html`. Keep `width` and `height` at the derivative's aspect ratio. If you change the hero, update the `<link rel="preload">` in `<head>` too. Card crops are set by `object-position` in `css/style.css` (`.pcard--N img`, `.hero__media img`). The Form/Material/Light/Detail previews come from each link's `data-img`.
- **Copy:** all text is in `index.html`. Everything except the contact details is draft concept copy.
- **Logo:** the nav and footer show a typographic "AAYAADI". When an approved logo arrives, replace `.nav__word` with it, and change the footer's `data-wordmark` text (or swap in the logo there too).
- **Colours and type:** see `:root` in `css/style.css`. Use the grey tokens (`--text`, `--text-strong`, `--muted`, `--on-ink*`) and the type tokens (`--fs-*`, `--track-caps`) rather than new literals. Phones get fixed type sizes in the 760px query. The gold button gradient was darkened so its white text passes WCAG AA.
- **Motion:** attribute hooks in `index.html` drive the motion: `data-lines`, `data-speed`, `data-fade`, `data-rise`, `data-carousel`, `data-hero-fade`. The scenes themselves live in `buildScroll()` in `js/main.js`. The Studio statement is split into lines only after the web font has loaded, and goes back to plain text when its reveal ends. If you change its copy or size, leave that ordering alone.

## Resilience

- **Hero entrance:** about 2.3 s, one GSAP timeline, never blocks scrolling. The pre-entrance state exists only while `html.hero-intro` is set. An inline script adds that class only when JS runs and motion is allowed.
- **Reduced motion, or GSAP blocked:** no hero entrance and no scroll effects; every section renders statically. The carousel and hover list still work.
- **JavaScript off:** the hero appears complete, the wordmark shows as text, the carousel becomes a swipeable scroller with every caption visible, and all links still work.
- **`main.js` never runs:** an inline failsafe removes `hero-intro` after 4 s, so the hero shows in its final state.
