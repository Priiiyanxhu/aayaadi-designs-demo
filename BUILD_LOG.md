# Build log: Aayaadi Designs concept

## 29 Oct 2026: new hero image with depth; clear-glass navigation

- Hero image replaced with the owner-supplied wide dining room (`KF04_DINING_WIDE.jpg`, AI-edited, see `AI-INVENTED.md`), converted to WebP at 960/1440/1920/2752 via headless Chrome. Preload and `og:image` updated.
- Depth and life: the photo, a warm ceiling-light bloom (soft-light) and the type are separate planes that drift by different amounts with the pointer (desktop, motion allowed only); the bloom fades up during the entrance; on scroll the room recedes and scales to 1.06. Fine film grain over the photo. Shading re-cut for a bright room: top band for the nav, lower-left corner for the title, deeper on phones.
- Layout: title in three lines (accent "living." stepped in) at bottom-left, eyebrow with a short rule, blurb bottom-left, a clear-glass caption plate and the disclaimer bottom-right, scroll cue centred. Plate hidden on phones.
- Navigation glass changed from frosted to clear (1px blur, rim lit from top left, inner glow, stronger lens refraction: 24px band, scale 64); bars enlarged (64px pills, 15px+ labels); hero Enquire is gold-tinted glass. The light-tone compact bar keeps a little frost because body text runs behind it.
- Tested: qa-hero, qa-polish and qa-interact passed after the image change (anchors-native passed after the nav resize, before the image); no console errors or overflow at 1440 and 390. Not run: repro-p5, the full matrix, real devices, Safari, Firefox.

## 29 Oct 2026: hero rewrite, display type and liquid-glass navigation

- Hero: new headline "Interior design, shaped around living." moved from the top-centre to bottom-left above the foot; the full-width hairline (and its JS placement code and GSAP tween) removed; eyebrow "Interior design studio · Gurugram" in champagne; new blurb. Nav children now fade instead of the nav itself, so the glass can see the photo during the entrance.
- Type: Fraunces (Google Fonts) added for display headings (hero, Studio statement, gallery, theme words, Details, Process, Enquire) with italic gold accent words; Geist kept for UI and body. Section labels are now gold uppercase. Greys warmed (`--text #4a4541`, `--muted #6b645c` 5.25:1 on paper, `--text-strong #2a241f`).
- Navigation: hero links in a centred dark glass pill; the compact bar became a floating glass pill with section links (desktop), scroll-spy (`aria-current`), and a tone switch to dark over the closing photo and footer. A lit "drop" follows hover/focus and the current section on a critically damped spring (no library). On Chromium a per-pill SVG lens map refracts the backdrop at the rim; other engines get the frosted fallback. Reduced transparency and increased contrast get solid surfaces. The pasted React/WebGL navbar was not used: this site is vanilla HTML with no React, so the material was rebuilt in CSS + SVG.
- Anchor offset now measures the floating bar's bottom edge (`offsetTop + offsetHeight + 8`).
- Tested: qa-hero, qa-interact, qa-polish (hover check updated from the removed underline to the glass drop), qa-studio, qa-gallery, anchors-native all passed; no console errors at 1440 and 390; no horizontal overflow. Not run: repro-p5, the full width × mode matrix, real devices, Safari, Firefox.

## 29 Oct 2026: landing-page additions (owner approved invented sample copy)

- Added `#process` (three steps) and `#faq` (six questions, native `<details>`) between Themes and Details, reusing the existing `data-fade` reveal. They sit above Details because Details is pinned and the Enquire section slides over it; putting them below made the pin cover them.
- Added a skip link, `og:image` and `twitter:card` tags, and `404.html`.
- All invented copy is listed in `AI-INVENTED.md` and flagged as sample copy on the page. No testimonials, names, prices, email or WhatsApp were invented. Legal pages and an enquiry form were not added (they need real policies and a real receiving address).
- Set up the Matt Pocock skills config: `CLAUDE.md`, `docs/agents/*`, `docs/adr/`, `.scratch/` (local markdown tracker).
- Tested: pages load at 1440 and 390 with no errors or horizontal overflow; qa-polish, qa-interact, qa-studio and qa-gallery all passed. Not tested: the full width/mode matrix, hero suite, real devices, Safari, Firefox, screen reader.

## 28 Oct 2026: final polish before the next motion pass

**Scope:** the compact bar against anchor destinations, PageDown during smooth scrolling, and the theme-word contrast and focus states. The hero and Studio animations, gallery images and order, the lightbox, page structure, typography, libraries and deployment are unchanged.

### 1. Compact bar and anchor destinations

- **Reproduced:** from the footer, links that jump upward bring the bar in over the destination. Headings ended up behind it for `#work` at 1440/1024/768, `#enquire` at 1024 (54 px) and 768 (41 px), and `#details` at 768. Downward jumps were fine, because the bar hides.
- **Pinned section:** an upward jump to `#details` at 1440 overshot by 166 px. That section is pinned on desktop (ScrollTrigger, `pinSpacing: false`), and once the pin has run its box is shifted by the pin distance. Both the old handler and Lenis's element measurement read that shifted box.
- **Fix (`js/main.js`):** the in-page link handler moves into the always-on layer.
  - It measures the pin's `.pin-spacer` wrapper when there is one.
  - When a jump goes upward and lands past the hero, it lands one bar-height lower (56 px, or 52 px on phones). Downward jumps keep a zero offset.
  - It scrolls to that number with Lenis when present, otherwise natively: instant with reduced motion or without GSAP, as before.
  - Focus still moves to the destination.
  - No CSS `scroll-margin` or `scroll-padding` was used. Lenis ignores it, and natively it would also offset downward jumps, where the bar is hidden.
- **Unchanged:** the bar's behaviour (hidden over the hero, hidden scrolling down, shown after about 24 px of upward scroll past the hero) and its size.
- **Behaviour change:** in reduced-motion and CDN-blocked modes, in-page links now go through this handler instead of native fragment navigation. The jump is still instant, but the URL hash is no longer updated, which matches the Lenis path.

### 2. PageDown during a smooth wheel scroll: reproduced and fixed

- **Repro (headless Chrome 156, real wheel then key):**
  - **Control, no glide running:** PageDown and Space move 787 px; ArrowDown moves 40 px.
  - **Wheel 600 px, then a key at once:** the key's movement was lost. The page stopped at the wheel's target (net about 344 px from the key press, which is just the rest of the glide). This happened for PageDown, PageUp, ArrowDown and Space.
  - No frame moved backwards. The key's scroll was overwritten, which reads to the user as snapping back.
- **Cause:** Lenis 1.1.13's `onNativeScroll` only syncs to native scroll when `isScrolling` is `false` or `"native"`. During a smooth glide it ignores the browser's keyboard scroll, and the next animation frame writes Lenis's trajectory back.
- **Fix (`js/main.js`):** a capture-phase `keydown` listener for PageDown, PageUp, Home, End, ArrowUp, ArrowDown and Space. It calls Lenis's public `reset()` only while `lenis.isScrolling === 'smooth'`, so the native key scroll starts from the current position. Otherwise smooth wheel scrolling is unchanged, and reduced motion has no Lenis at all.
- **After the fix:**
  - PageDown, PageUp and Space moved 787–819 px from where they were pressed. ArrowDown moved 61, 62 and 40 px across three runs: its own 40 px, plus whatever was left of the glide when it was pressed.
  - Backward travel was 0 in every trace.

### 3. Theme-word contrast and states

- **Measured contrast on white:**
  - resting #767676: 4.54:1;
  - active #4b4b4b: 8.72:1;
  - previous #949494: 3.03:1;
  - focus gold #9b6b2c: 4.63:1.
- **Screenshots reviewed (1440 and 390):** default, hover/tap "Material", keyboard focus.
  - The resting grey reads as quiet, not heavy, and the preview photo dominates when a word is active.
  - Active is distinguishable without colour: the word scales 1.4× (1.12× on phones), the photo appears, the part over the photo turns white, and `aria-pressed` changes.
  - **No colour change made.**
- **Genuine issue found:** the 2 px gold ring was drawn on the unscaled button box. When a word is active, the ring sat inside the enlarged word over the photo, and on the yellow backlit stone ("Light") it was faint.
  - **Fix (`css/style.css`):** the ring moves to the scaled `.style__in`, with a 7 px white halo (`box-shadow`), so it surrounds the visible word and holds up over any photo.
  - **Verified:** a real Tab reaches Form, Material and Light at 1440 and 390, with the ring and halo around the visible word.
  - An earlier phone capture showing no ring used script-set focus right after a touch tap, which the browser doesn't treat as keyboard focus. That was a harness artifact.

### Files changed

| File | Change |
|---|---|
| `js/main.js` | `lenis` declared up front. In-page link handler moved to the always-on layer, with the upward-jump bar offset, `.pin-spacer` measurement and numeric targets. Keydown `reset()` during smooth glides. |
| `css/style.css` | Focus ring for `.style__btn` drawn on `.style__in`, with a white halo |
| `BUILD_LOG.md` | This entry |

### Tests actually run

- **PageDown repro** before and after the fix: control, PageDown, PageUp, ArrowDown and Space, as above.
- **Anchor-under-bar repro** (5 targets × 5 widths, from below): before, headings sat behind the bar in 6 cases plus the `#details` overshoot; after, none.
- **Native-path anchors** (reduced motion and CDN blocked, at 1440/768/390): the hero "Work" link lands at 0 with focus moved, and the bar's Enquire from the footer lands its heading below the bar (132, 97 and 124 px). All passed.
- **Bar over every section** (Studio, gallery, themes, details, closing, footer) at 1440 and 390, revealed by a real scroll-up: the bar was shown in all 12 cases. Screenshots reviewed: it stays legible over the dark closing photo.
- **Theme focus suite:** all passed.
- **Regression suites, all passed:**
  - checks from the usability pass;
  - gallery-fragment repro (none found);
  - hero, Studio and Studio skip-past suites;
  - gallery and interaction suites;
  - polish and geometry checks;
  - load matrix: 5 widths × normal/reduced/no-JS/no-CDN, all `bad:0`, with no overflow, broken images, dead anchors or page errors. CDN-blocked runs log only the four deliberately blocked requests.
- **Regressions caught and fixed during this pass:**
  - **CDN-blocked jumps had turned smooth.** The new handler first scrolled smoothly without GSAP; before this pass those jumps were instant. That's restored, and the interaction suite's 500 ms check passes again.
  - **Focus-outline check (test assumption).** The interaction suite only looked for an outline on the focused element itself, so it missed the theme words' ring on the inner word. The check now also looks there and reports which stops are missing: none.
- **Test environment:** internet access dropped mid-run again (`ERR_TIMED_OUT`, with page loads of 30–45 s). Every suite cut short was re-run after connectivity returned, and all the results above are from completed runs.

### Remaining limitations

- **Free scrolling:** during ordinary scrolling, the revealed bar covers the top 52–56 px of whatever is under it, by design. Only link destinations are offset.
- **Anchor offset assumes the bar shows:** the offset applies to upward jumps that land past the hero, on the assumption that the upward movement reveals the bar. A very short upward jump of under about 24 px wouldn't reveal it and would land 56 px lower than needed. Harmless.
- **Keyboard scroll smoothness:** keys pressed during a glide now scroll natively from the current position. The glide stops; it doesn't blend with the key scroll.
- **Not tested:** real devices, Safari, Firefox, a screen reader, Lighthouse, throttled networks.

Stopped here for review; the next motion pass has not been started.

## 28 Oct 2026: usability and design-consistency pass

**Scope:** the fixes from the read-only design critique. The hero and Studio animations, content, photographs, image delivery and libraries are unchanged. No deployment.

### Confirmed issues, root causes and changes

1. **The nav disappeared after the hero.** `.nav` is `position: absolute` inside the hero, so it scrolled away with it.
   - Added `.minibar`: a fixed 56 px bar (52 px on phones) with the wordmark and Enquire only, on translucent paper with a light blur.
   - **Hidden over the hero.** Past the hero, it shows after about 24 px of upward scroll and hides after about 24 px of downward scroll. The distance is accumulated and resets when direction changes, so small reversals don't flicker it.
   - **Stays while focused.** It stays visible while it has keyboard focus, and it's `visibility: hidden` when out of view, so it's never focusable then.
   - **Reduced motion:** it cross-fades instead of sliding. With JS off it isn't rendered.
   - **No layout shift:** it's fixed, so it shifts nothing.
   - **Shared change:** the in-page link handler now also moves focus to the target section (`tabindex="-1"`, no outline), as a native fragment link would. So Enquire leads keyboard users straight to the Call button. This affects every in-page link.
2. **Mobile hero crop.** The photo is 3:4 and a phone screen is narrower (about 0.46), so phones see the photo's full height and only its sides are cropped. The ceiling can't be cropped with `object-position` alone.
   - At the default 50 % horizontal position, both the ceiling fan (about 68 % across) and the AC unit (about 75 %) were in frame.
   - **Fix:** `object-position: 0% 72%` at 760 px and below. It keeps the stone panel, sofa, armchairs and lotus table, and drops the fan and AC. The headline stays over the dark ceiling.
   - **Rejected:** two enlarge-and-crop variants (112 % and 118 %), rendered and compared at 390 and 360. They moved the headline onto the busy fluted wall, cut off the lotus and upscaled the image.
   - Desktop is unchanged (`50% 72%`).
3. **Gallery heading fragments.** Already root-caused and fixed in motion pass 03: the sideways `data-slide` sweep and the heading parallax pushed the words past the gallery's `overflow: hidden` edges. The repro script was re-run in this pass at 5 widths × 4 scroll positions, and no fragments were found.
4. **Card 04 sat above card 03 at desktop widths.** `.pcard--3` was `top: 80vw` and `.pcard--4` was `top: 70vw`. The two values are swapped. On phones the cards stack in source order, which was already correct.
5. **Theme words were four links to the same `#details`.**
   - They're now `<button type="button" aria-pressed aria-controls="themes-preview">`. Each previews its documented photograph (`ASSET_MANIFEST.md`), and the preview image gets that photo's description as its alt text.
   - **Pointer:** hover previews.
   - **Keyboard:** focus previews, Enter/Space works, Escape closes.
   - **Touch:** a tap toggles; tapping elsewhere closes.
   - **JS off:** the "Choose a word…" hint is hidden.
   - **Contrast:** the resting word colour is now #767676 (4.5:1 on white), up from #949494 (3:1). The active state keeps the darker `--text`.
6. **Gallery cards zoomed on hover but led nowhere.**
   - Each card now gets a "View larger: [room]" button (added by JS) that opens a native `<dialog>` lightbox: the larger photo, its existing caption and number, Close, and previous/next across the four cards (disabled at the ends).
   - **Keys and pointer:** arrow keys step through the cards; Escape or a click on the dark area closes it.
   - **Focus:** it moves to Close on open and returns to the card on close.
   - **Scroll lock:** the page behind doesn't scroll (Lenis is stopped and the root is set to `overflow: hidden`).
   - **Reduced motion:** no open animation.
   - **JS off:** no lightbox controls, and the hover zoom is gated on `.js`, so there's no dead affordance.
7. **Labels and buttons.**
   - The details section's centred uppercase eyebrow ("▪ IN DETAIL") is now the same left sentence-case `.label` as "Studio" and "Themes", reading "Details" to match the nav. The unused `.eyebrow`/`.dot` CSS was removed.
   - **Interpretation:** the brief's "gallery section label" was taken to mean this eyebrow, the only centred uppercase label on the page. "Selected work" keeps its large heading and has no extra label added.
   - `.btn-line` now has 2 px corners, and the button reads "Closer looks" (it still links to `#details`).
8. **Contact channels.** Unchanged and not invented. Still to confirm with the studio before showing anything new: an email address, whether +91 98737 47198 takes WhatsApp, and the studio's preferred enquiry channel.

### Files changed

| File | Change |
|---|---|
| `index.html` | Compact bar; theme words as buttons with `data-alt`; preview `id`, no longer `aria-hidden`; "Details" label; "Closer looks"; `<dialog class="lightbox">` |
| `css/style.css` | `.minibar` (+ reduced motion, + phone height); phone hero `object-position`; card 03/04 `top` swapped; `.style__btn`; word colour #767676; JS-off hint hidden; `.pcard__zoom`, `.js`-gated hover zoom; lightbox styles (+ phone controls); `.details__label`; `.btn-line` radius; `[tabindex="-1"]:focus` |
| `js/main.js` | Theme controls rewritten for buttons, `aria-pressed`, alt text and Escape; `setupMinibar()`; `setupLightbox()`; Lenis stop/start on lightbox open/close; the in-page link handler moves focus to the target |
| `README.md`, `BUILD_LOG.md` | Updated |

### Tests actually run (headless Chrome 156, local server confirmed serving this directory)

- **Pass checks (`qa-p4`):** all passed.
  - **Compact bar** at 1440/1024/768/390/360:
    - hidden at the top and while scrolling up inside the hero;
    - hidden scrolling down past the hero; shown on scroll-up, fully in view;
    - no flicker on ±8 px reversals; hidden again scrolling down and back at the top.
  - **Enquire:** keyboard Enquire lands on `#enquire`, focus moves there, and the next Tab is "Call +91…". A phone tap on Enquire lands too.
  - **Bar fallbacks:** reduced motion is opacity only; JS off renders no bar; CDN blocked still shows it.
  - **Mobile crop:** `0% 72%` with the photo loaded at 390 and 360, `50% 72%` at 1440, and the entrance clip cleared.
  - **Card order:** 01 → 02 → 03 → 04 at all five widths.
  - **Theme controls:** four buttons with no links; colour #767676; keyboard focus, Tab and Escape; hover; touch tap and tap elsewhere; JS off.
  - **Lightbox** at 1440 and 390:
    - opens the right card with its caption; the photo loads and fits the screen; focus goes to Close;
    - the page behind doesn't scroll; next/previous work, with Next disabled at the end; Tab stays inside;
    - Escape/Close return focus to the card; clicking the backdrop closes it;
    - reduced motion has no animation; JS off has no controls or zoom.
  - **Labels:** "Studio", "Themes" and "Details" share one style at the page margin (25 px and 16 px); the button reads "Closer looks" with 2 px corners.
- **Harness fix, not a site bug:** the first run failed the desktop bar checks because the test jumped the page with a scripted `scrollTo` while Lenis was still gliding, so Lenis animated back to its stale target. A scroll-value trace confirmed the bar works with a real wheel, and the desktop test now travels by wheel only. The "Details" label first measured at 0 px because its gap was padding inside the box; it's now a margin.
- **Regression, all passed:**
  - the fragment repro (none found);
  - hero suite; Studio suite (re-run after a CDN page-load timeout in the first run); Studio skip-past suite;
  - gallery suite (one stale assertion for the old "See the details" label updated, then passed);
  - interaction suite (theme assertions updated for buttons);
  - hover-polish checks and audit geometry checks;
  - load matrix: 5 widths × normal/reduced/no-JS/no-CDN, all `bad:0`, with no overflow, broken images, dead anchors or page errors.
  - One reduced-motion run at 768 logged an aborted `hero-640.webp` request. It's the same full-page-screenshot artifact as before, with no broken image.
- **Screenshots reviewed:** the bar at 1440 and 390, the phone hero (crop variants and final), the gallery order at 1440, "Form" previewing with a focus ring, the lightbox at 1440 and 390, and the "Details" label at 1440.

### Remaining issues

- **Bar over content:** when shown, the compact bar covers the top 52–56 px of whatever is under it, which is inherent to a reveal-on-scroll-up bar. Scrolling down hides it.
- **Lenis with scripted scrolls:** if a scripted `scrollTo` or keyboard scrolling happens while Lenis is still gliding from a wheel scroll, Lenis can animate back to its old target. This is existing Lenis behaviour that the test harness surfaced. It isn't caused by the bar, but keyboard PageDown during a wheel glide is worth a manual check.
- **Lightbox previous/next:** these cover only the four gallery cards, not the "Closer looks" carousel.
- **Carried over:** contact channels to confirm, the 3:1-to-4.5:1 word-contrast change to review visually, and unconfirmed content.

**Not tested:** real phones and tablets, Safari (`<dialog>`, `backdrop-filter`), Firefox, a screen reader (announcements of `aria-pressed` and the dialog), Lighthouse, throttled networks.

Stopped here for review; no new animation phase started.

## 28 Oct 2026: UI polish fixes (from a `better-ui` review)

Approved by the user ("go ahead") after a read-only review. Only `css/style.css` changed. These are shared styles, so they touch the nav, the buttons, the footer links and the carousel controls; no layout, content or motion timelines changed.

- **Hover only on hover-capable pointers.** The nav underline and the hover states of `.btn-gold`, `.btn-ghost`, `.btn-line` and `.footer__value a` now sit inside `@media (hover: hover) and (pointer: fine)`. This matches the gallery card zoom, so a touch tap can't leave a button inverted or an underline drawn.
- **Hover feedback at 150 ms.** The button, link, carousel-arrow colour and dot transitions are now `150ms ease`; they were 0.3–0.6 s. The nav underline draw and the carousel arrows' disabled-opacity fade are unchanged.
- **Image outlines.** Content photos (gallery cards, Studio thumbnails, carousel slides, theme previews) get `outline: 1px solid oklch(0 0 0 / 0.1); outline-offset: -1px`, so pale walls and tables keep an edge on white and paper. The full-bleed hero and closing photos have none.
- **Not done (lows from the review, left for a decision):**
  - scope `.pcard { will-change }` to desktop;
  - keep opacity cross-fades under reduced motion;
  - add a 0.96 press scale to buttons, since there's currently no press state at all, which may be deliberate.

**Tests (headless Chrome 156):**
- **New polish checks:** all passed.
  - Mouse hover still changes all five targets at 1440.
  - The listed transitions read 0.15 s; content photos carry the outline; the hero doesn't.
  - At 390 with touch, tapping each button or link (navigation cancelled so the element stays under the finger) left no hover state.
  - The tap test wasn't run against the old CSS, so it shows hover doesn't latch now, not that it did before.
- **Regression, all passed:** the interaction suite, the gallery suite, and the load matrix at 1440/768/390 in normal, no-JS and no-CDN modes.

**Not tested:** real touch devices, Safari, Firefox.

## 28 Oct 2026: motion pass 03, Selected Work gallery

**Scope:** gallery only. The hero, Studio, details carousel, closing section, footer, content, photos and their order are unchanged. No new library, no deployment.

### Heading-fragment defect: reproduced, then root-caused

Before any change, I measured both headings at 1440/1024/768/390/360 with the gallery top at 95/80/60/40 % of the viewport. The fragments came from two starter scenes in `buildScroll()`, both on the same `<p class="gallery__h">`:

1. **Horizontal sweep (all widths).** `data-slide` scrubbed `x` from ±30 % of the viewport width to 0, between "top bottom" and "top 40%".
   - For most of that range each word sat partly beyond the screen edge.
   - `.gallery { overflow: hidden }` is viewport-wide, so it cut the word at the edge. That's the "ted", "elected" and "wo" fragments.
   - Measured: "Selected" was 403 px off-left at 1440, and "work." was still off-right at 390 with the gallery top at 40 %.
2. **Vertical parallax (≥ 761 px).**
   - `data-speed="0.82/0.86"` started the headings about 50–60 px above their resting place.
   - That put "Selected" above the gallery's top edge, where the same `overflow: hidden` sliced off the glyph tops along the Studio/Gallery seam (measured at 1440, 1024 and 768).
   - Both sections share the paper colour, so the cut letters looked like they were floating in the gap.

It was not a z-index or stacking problem. The words never left the gallery box; they were positioned so that the box's edges cut through them.

**Fix:**
- Removed the sideways sweep and the heading parallax.
- Each heading now rises vertically inside its own mask, `.gallery__mask`. The mask is padded 0.12em above, 0.16em below and 0.06em at the sides, pulled back with negative margins so the layout doesn't move, so ascenders, the "S" overshoot and the full stop are never cropped at rest.
- Text can only ever appear inside the word's resting box.
- After the fix, every measured position shows both masks fully inside the viewport and below the seam, at all five widths.

### Gallery motion (`setupGallery()` in `js/main.js`)

- **Headings:** a masked rise, `yPercent` 110 → 0, 1.2 s `expo.out`. It's the same move as the hero title and the Studio lines, and each heading plays once when its mask reaches 88 % of the viewport.
- **Cards:** each card has its own once-only timeline at 88 %, so they arrive in scroll order rather than together:
  - The card fades in, 0.5 s.
  - Its photo frame opens from `inset(8%)` to full, 1.3 s `expo.inOut`. The white card edge reads as a mount while it opens, and the four-value inset strings match the hero aperture.
  - The photo settles from scale 1.06 to 1, 1.8 s.
  - The caption follows at 0.5 s, staggered 0.06 s.
  - The photo's CSS hover transition is paused during the reveal and restored when it ends.
- **Closing copy:** the paragraph and "See the details" button rise 14 px and fade in, staggered 0.08 s. This replaces the shared `data-fade` hook on `.gallery__cta`.
- **Parallax:** desktop card parallax is kept but halved (`data-speed` 0.97/1.06/1.15 → 0.985/1.03/1.075), so the largest drift is about ±50 px instead of ±100 px.
- **Hover zoom:** the card zoom is now gated to `(hover: hover) and (pointer: fine)`, so a touch tap can't leave a photo zoomed.
- **Defect I introduced, then fixed:** my first version faded only the photo frame. On phones, a card's empty white mount then showed as a blank box in the bottom 12 % of the screen before its trigger fired (seen in the 390 frames). The whole card now fades in, and every entry frame at every width checks for a visible card with no photo: zero found.

### Files modified

| File | Change |
|---|---|
| `index.html` | Gallery headings wrapped as `.gallery__mask > .gallery__in`; `data-slide` and heading `data-speed` removed; card `data-speed` halved; `data-fade` removed from `.gallery__cta` |
| `css/style.css` | `.gallery__mask` rule; card hover zoom gated to fine pointers |
| `js/main.js` | `data-slide` handler removed (it was used only by the gallery headings); `setupGallery()` added; header comments updated |
| `README.md` | `data-slide` removed from the hook list |
| `BUILD_LOG.md` | This entry |

`data-fade` and the details eyebrow still use the shared handler, unchanged. No shared dependency needed changing.

### Tests actually run (headless Chrome 156, local server at 127.0.0.1:8000)

- **Repro script, before and after** (5 widths × 4 gallery positions): before, every width had fragment flags. After, none at any width or position.
- **Gallery suite** (1440/1024/768/390/360): all passed.
  - Waiting state before entry; no empty card mounts in any entry frame; mask inside the viewport and below the seam during entry.
  - Settled state: headings, frames, photos, captions and CTA all at rest and opaque, with no leftover clip or inline styles.
  - Reverse scroll to the top and back.
  - A fast scroll from Studio to Contact and back.
  - Nav jumps to `#details` and `#contact`, then back.
  - No console errors.
  - Reduced motion, JS off and CDN blocked (at 390 and 1440): everything visible and at rest.
  - Keyboard: Tab reaches "See the details" on screen with a visible outline, and Enter lands on `#details`.
  - Desktop hover zoom still works; a phone tap doesn't zoom.
- **Mid-rise frames:** "Selected" at 120 ms showed 70 of 105 px inside its mask at 1440 and 35 of 52 px at 390. Reviewed: it rises in place with no fragments.
- **Studio-to-Gallery boundary screenshots** reviewed at 1440 and 390: waiting, mid-rise, entry frames at 250/550/900 ms, and settled.
- **Regression, all passed:**
  - hero suite;
  - Studio suite and Studio skip-past suite;
  - interaction suite (anchors, carousel buttons, dots and arrow keys, hover/focus/tap previews, keyboard order and outlines, reduced motion, CDN blocked);
  - audit geometry checks;
  - load matrix: 6 widths × normal/reduced/no-JS/no-CDN, all `bad:0`, with no overflow, broken images, dead anchors or page errors. CDN-blocked runs log only the four deliberately blocked requests.

**Test environment notes:**
- External CDNs briefly timed out from this machine mid-pass; the local server was fine.
- From then on, the gallery suite and the mid-rise capture served the pinned CDN files from a test-harness cache. Each file is fetched once from the real CDN and saved; the site isn't changed.
- The regression run above used the live CDNs.
- My first cache helper mis-decoded `%20` in its path and created a stray `C:\Users\HARSH%20KUMAR\…\cdn-cache` folder, containing only its own ten cache files. It was deleted and the helper fixed.

### Remaining issues

- **Keyboard focus before the reveal:** a keyboard user who tabs to "See the details" before it has revealed will see its outline while the button fades in over about 1 s.
- **Carried over:** the hero photo's air-conditioner, the 3:1 contrast on the themes words, and the unconfirmed content and contact details.

**Not tested:** real devices, Safari, Firefox, a screen reader, Lighthouse, throttled networks.

Stopping here for review; the next section has not been started.

## 28 Oct 2026: Studio section QA and regression audit (no code changes)

**Verdict: PASS WITH MINOR ISSUES.** No defects were found in the Studio section. No project code was changed in this audit, only this log. The Studio reveal itself was last edited earlier in the day (`js/main.js`, `css/style.css`, `index.html`), and the audit ran against that code.

**Tested** (headless Chrome 156 against http://127.0.0.1:8000/, confirmed to be serving this project):
- **Lifecycle frames** at 1440, 1024, 768, 390 and 360 px (390/360 at 2×): initial, then about 25 %, 50 %, 75 % of the nominal timeline, then completed, then reverse scroll to the top, then re-entry. Screenshots reviewed at 1440, 390 and 360.
- **Hero → Studio boundary** at 60 % and 95 % of the hero scrolled away, at all five widths.
- **Skip-past paths** at 1440 and 390: nav jump to Contact then back, keyboard Tab onto "See the details" then back, instant scroll to the bottom then back, and the hero "Scroll" cue. The label, statement, thumbnails and note were fully revealed in every case.
- **Layout shift:** CLS 0.0005 (1440) and 0.0006 (390) across hero → Studio → back. Paragraph height constant in every sampled frame. Line left edge identical in every frame under a real wheel scroll (1440).
- **Trigger hygiene:** ScrollTrigger count 25 before and after five resizes. Resizing before the reveal re-splits to the new wrap (5 lines = 5 rows).
- **Fallbacks:** reduced motion, JavaScript off and CDN blocked all show the full static section (final suite run, plus screenshots of JS-off at 390 and CDN-blocked at 1440 reviewed).
- **Regression:** the final suites all passed on the current code. These were the load matrix (6 widths × normal/reduced/no-JS/no-CDN), interaction, hero, geometry and Studio suites. The WebP derivatives (38) are present; the 13 full-size copies are intact; no file under `_source-assets/` is writable.

**Harness errors made and corrected during the audit** (not page defects):
- Playwright's element screenshot scrolls the element into view and fired the once-only trigger early.
- A reload restores Chrome's scroll position, so the section was already in view and stayed static as designed.
- Both were fixed by capturing viewport clips after a fresh navigation.
- One assertion in the skip suite (wheel-scroll settled state) is vacuous because it ends in `|| true`. It isn't counted; the printed state shows everything revealed.

**Observations**
- **Motion character:** `expo.out` front-loads the motion. In the 25 % frame the lines are 9–55 px from rest; by 50 % they are within about 1–5 px. The visible reveal is about 0.8 s, with an invisible tail to 1.65 s. This matches the hero and reads as restrained. No change made.
- **Mid-rise descender cuts** (for example the comma after "materials") are the mask edge during motion. They are expected, and every line shows full descenders at rest.

**Remaining known issues**
- **Gallery, out of scope:** the gallery headings ("Selected", "work.") are offset sideways by the starter's `data-slide` effect, so their fragments ("ted", "elected", "wo") peek into the paper gap under the Studio section as it scrolls past, most visibly at 390. Worth fixing in the gallery pass.
- **Listeners that stay attached:** the resize and `fonts.loadingdone` listeners on the statement are never removed. They are no-ops after the reveal plays, and the page is a single instance guarded by `__siteBooted`.
- **Resize during the reveal:** a resize during the 1.65 s reveal (after the lines are fixed) could re-wrap a line inside its mask for that moment. It resolves when the reveal ends.
- **Carried over:** the air-conditioner in the hero photo, the 3:1 contrast on the themes words (starter's choice), and the unconfirmed content and contact details.

**Not tested:** real devices, Safari, Firefox, a screen reader (the accessibility tree was checked with Playwright's snapshot only), Lighthouse, throttled networks.

**Ready for approval:** yes, with the gallery fragment noted for the next pass.

## 28 Oct 2026: motion pass 02 (Studio statement) and a visual/typographic audit

**Scope:**
- **Motion pass 02:** the Studio statement only.
- **Visual and typographic audit:** a sitewide pass, done as a separate request after pass 02.
- **Unchanged:** the hero animation, gallery/carousel/closing motion, images and the overall identity. No new libraries, no deployment.
- **Reverted unreviewed edits:** a quick section-reveal draft for the gallery, carousel and enquiry was written and removed before pass 02 began, because pass 02 kept those sections out of scope.

### Studio statement: root cause of the ragged phone reveal

The old wipe was buggy. `setupHighlight()` split the statement into lines while Geist was still loading (`document.fonts.status` was "loading" at every width tested), so line breaks were measured in the fallback font.

At 390 px, two of those lines no longer fit once Geist arrived:
- The grey text layer wrapped onto a second row, but the dark block was `white-space: nowrap` and overflowed (379 px of content in a 362 px box).
- Words disappeared mid-wipe, and the paragraph sat at 8 rows during the animation, then snapped to 6 when it ended.

Desktop happened to fit. A second problem: at line-height 1.04, descenders reach roughly 0.2–0.4 px past the line box, so `inset(0)` clips cropped them.

### Fix

- **The reveal:** `setupStatement()` replaces the wipe with a per-line masked rise. It's the same move as the hero title: `expo.out`, 1.2 s, 0.08 s stagger, with the "Studio" label fading in alongside.
- **Line measurement:**
  - Lines are measured only after `document.fonts.ready` (3 s cap).
  - They're re-measured on `loadingdone` and on resize until the reveal plays.
  - If the section has already scrolled past the trigger by then, it stays static rather than hiding text the reader can already see.
- **Descenders and layout:** each mask extends 0.14em below the line, and the paragraph is `display: flow-root`, so its height doesn't change.
- **Clean finish:** when the reveal ends, the paragraph returns to plain text, so the settled layout is exactly the static layout.
- **Screen readers:** while the lines are split, an `.sr-only` copy carries the whole sentence and the line masks are `aria-hidden`.
- **Thumbnails and note:** these get their own trigger with a small stagger. `data-highlight` was renamed to `data-lines`, and `data-fade` was removed from `.mission__meta`.

### Visual and typographic audit, and fixes

There was no separate audit tool to run. The tastemaker skill's reference files and scripts aren't installed here, and Python isn't available. The audit used settled screenshots at 1440/768/390 plus a computed-style inventory of every text style.

| Issue found | Fix |
|---|---|
| Phones and tablets used 10–11 px for ten text roles | Floors raised (`--fs-small` 12, `--fs-body` 14). Phones get fixed 15/13/12 px body/small/caps. |
| Uppercase labels tracked at 0.01em, and louder than the body copy | `--fs-caps` made smaller, `--track-caps: 0.08em`, used by `.caps` and `.eyebrow` |
| About a dozen ad-hoc greys | Folded into `--text`, `--text-strong`, `--muted`, `--on-ink`, `--on-ink-2`, `--on-ink-3`, `--rule-dark-2` |
| "Studio" label floated off the statement's baseline | `align-items: baseline` on `.mission`. Measured delta: 0 px from 768 to 1440. |
| "Closer looks" caption title overlapped the photo corner | Caption offset clear of the image; viewport padding raised so a three-line caption still fits |
| Straight apostrophes in visible copy | Curly apostrophes (’) |
| Phone numbers could break mid-number | Non-breaking spaces |
| Orphans and ragged headings | `text-wrap: balance` on h2/h3, `pretty` on paragraphs; footer note balanced and capped at 68ch |
| Four cards all captioned "Selected interior" | Each now names what its photo visibly shows (from the existing alt text); no project facts added |
| Bare themes word list with no heading or hint | Visible "Themes" label and the hint "Choose a word to see a photograph." |
| Nav wordmark link about 20 px tall; "See the details" about 30 px | 44 px minimum height on both. Trailing tracking on the wordmark cancelled. |
| Footer wordmark touching the band's top edge on phones | `padding-block: max(18px, 1.6vw)` |

### Files modified

| File | Change |
|---|---|
| `js/main.js` | `setupHighlight()` replaced by `setupStatement()`; header comment updated |
| `css/style.css` | `.hl*` replaced by `.sl*`; type/colour tokens; all the audit fixes above |
| `index.html` | `data-lines`; `.mission__meta` no longer uses `data-fade`; themes heading and hint; card captions; apostrophes; `&nbsp;` in phone numbers |
| `README.md`, `BUILD_LOG.md` | Updated |

### Tests actually run (headless Chrome 156, local Node server; final run, sequential, on the finished code)

- **Studio suite** (1440/1024/768/390/360): all passed.
  - Single-row lines that match the natural wrap. Paragraph height constant in every sampled frame (150–2200 ms), and content below it never moves.
  - The label and thumbnails settle visible. Reverse-then-forward scrolling doesn't replay or re-split.
  - A screen reader gets one unsplit sentence.
  - No console errors.
  - A 5 s delayed web font is re-measured correctly.
  - Reduced motion, JS off and CDN blocked all show plain static content.
  - Intermediate frames were reviewed at 390 and 360.
- **Load matrix:** 6 widths × 4 modes, all `bad:0`, with no overflow, broken images, dead anchors or page errors. CDN-blocked runs log only the four deliberately blocked requests.
- **Interaction suite** (anchors, carousel, hover/focus/tap previews, keyboard order and outlines, reduced motion, CDN blocked) and **hero suite:** all passed.
- **Audit geometry checks** (6 widths): all passed.
  - Captions fit and sit clear of the photos.
  - Studio baseline delta is 0.
  - No button or link under 24 px outside inline text.
  - Phone numbers never wrap.
  - No horizontal overflow.

**Not done:** real devices, Safari/Firefox, a screen reader, Lighthouse.

**Note:** jsDelivr timed out once on this machine during parallel runs (one Lenis load and one page-load timeout). The final run was sequential and clean.

### Open

- The hero photo shows an air-conditioner near the nav at 1440 and on phones. Re-cropping would push the sofas under the title, so it's left for a photo decision.
- The themes words (#949494) meet only the 3:1 large-text contrast floor; that was the starter's choice.

## 28 Oct 2026: image optimisation and hero motion (first motion pass)

**Scope:** media optimisation, plus the hero entrance and its scroll-away. The other five homepage sections were **not** animated or re-tuned; their existing starter motion is unchanged. No new libraries (still GSAP 3.12.5, ScrollTrigger and Lenis 1.1.13), no AI images, no deployment.

### Inspected first

`README.md`, this log, `ASSET_MANIFEST.md`, `index.html`, `css/style.css`, `js/main.js` and `js/brand.js`. The loader (wordmark that opened into the hero) and the old `heroIntro()` were the only hero motion.

### Image optimisation

- 38 WebP derivatives of the 13 used photos went into `img/aayaadi/web/`, encoded from the read-only originals with sharp 0.33.5. Settings and the full table are in `ASSET_MANIFEST.md`.
- **Quality:** a 1:1 crop comparison (GM22 fluting and veining at 1536 px; GM31 patterned table top at 800 px) showed no visible loss.
- **Markup:** every `<img>` now has `srcset` + `sizes`, plus `width`/`height` at the derivative's aspect ratio. Below the fold: `loading="lazy"` + `decoding="async"`. The hero has `fetchpriority="high"` and a matching `<link rel="preload" imagesrcset>`. The hover previews (`data-img`) point at 800 px WebPs.
- **Measured** (headless Chrome 156, image transfer for a complete scroll):

  | Viewport | Before | After | Requests |
  |---|---|---|---|
  | 1440×900 at 1× | about 6.3 MB of originals | **797 KB** | 12 |
  | 390×844 at 3× | about 6.3 MB of originals | **1,455 KB** | 12 |

  No original JPEG or PNG is requested at either width.
- **One request per viewport:** a targeted trace shows the hero is requested exactly once at each viewport (1440 → 1536 w, 1024 → 1280 w, 768 → 960 w, 390 at 1× → 640 w), so there's no preload/`srcset` double fetch.

### Hero entrance (replaces the loader)

- **Loader removed.** It held the page for about 3.3–4.2 s, with scrolling stopped. Its markup, CSS, `boot()` and the 6 s loader failsafe are gone. `brand.js` stays for the footer wordmark.
- **One timeline** in `initHero()`, about 2.3 s, with scrolling available throughout:

  | Time | What happens |
  |---|---|
  | 0 s | The photo fades up inside a framed aperture: `inset(11% 33%)` on desktop, `inset(16% 18%)` on phones |
  | 0.1–1.7 s | The aperture opens to full bleed (`expo.inOut`) |
  | 0–2.4 s | The image settles from scale 1.04 to 1 |
  | 0.85 s | The two title lines rise from their masks, 0.12 s apart |
  | 0.95 s | The hairline draws |
  | 1.25 s | Nav, foot copy and scroll cue fade up together, staggered 0.05 s |

  The title only moves over the dark hero ground or the dimmed photo, so it stays readable.
- **Scroll cue:** a small "Scroll" label above a hairline with a slow travelling highlight (CSS, 2.4 s loop). It's a real link to `#studio` with an `aria-label`; phones show only the line. The animation is off under reduced motion.
- **Transition into the studio section:** scrubbed ScrollTriggers over the hero's height. The image drifts (`yPercent` 12), the title lifts (−10 %), a new `.hero__shade` deepens to 0.45, and the foot and scroll cue fade out by 40 %. Scrubbing means reverse scrolling restores it exactly. **No pinning.**
- **No duplicates:** an init guard (`window.__siteBooted`) means `main.js` initialises once, and all hero tweens and triggers live in one `gsap.context` that `initHero()` reverts before rebuilding. ScrollTrigger refreshes after fonts and on `load`.
- **Resilience:**
  - The pre-entrance state is CSS under `html.hero-intro`. An inline `<head>` script adds that class only when JS runs and `prefers-reduced-motion` isn't set.
  - `main.js` removes it straight away if GSAP or ScrollTrigger is missing or motion is reduced.
  - A 4 s inline failsafe removes it if `main.js` never runs.
  - JS off: the class is never added, so the static hero is complete from first paint.
- **Bugs found and fixed while testing:**
  - **Lopsided aperture.** The browser serialises `inset(11% 33% 11% 33%)` as `inset(11% 33%)`, and GSAP's two-to-four value interpolation snapped the left and bottom edges open. Fixed with a `fromTo` using literal four-value strings. Sampling the clip-path every 120 ms afterwards showed symmetric insets at every frame on both 1440 and 390, cleared to `none` at the end.
  - **Phone overlap.** The scroll label overlapped the "Not the official website" note; phones now show only the line.

### Files modified in this pass

| File | Change |
|---|---|
| `index.html` | `<head>` inline script (`hero-intro` + 4 s failsafe) and hero image preload. Loader markup removed. `srcset`/`sizes`/dimensions on every image. `.hero__shade` and `.hero__scroll` added. |
| `css/style.css` | Loader styles removed. `.hero__shade`, `.hero__scroll` (+ keyframes) and `.hero-intro` pre-state added. Phone rules for the scroll cue and aperture. Phone hero blurb `max-width` changed from 34ch to 30ch. |
| `js/main.js` | Init guard. Loader/`boot()`/old `heroIntro()` replaced by `initHero()` in a `gsap.context`. Hero scroll scenes moved out of `buildScroll()` into `initHero()`. Lenis no longer stopped at start. |
| `img/aayaadi/web/` | New, 38 WebP files. |
| `ASSET_MANIFEST.md`, `README.md`, `BUILD_LOG.md` | Updated. |

Not modified: `js/brand.js`, `img/aayaadi/*.jpg`, `_source-assets/`, `_reference/`, `_handoff/`.

### Tests actually run (headless Chrome 156 via playwright-core, local Node server)

1. **Load matrix:** 6 widths × 4 modes (normal, reduced motion, JS off, CDN blocked) = 24 runs. All had no horizontal overflow, no broken images, no dead anchors and no page errors.
   - Zero console errors or warnings except in CDN-blocked mode, which logged only the deliberately blocked font and script requests.
   - One CDN-blocked run (1024 px) logged an aborted `hero-640.webp`. It didn't reproduce in the targeted trace, and I believe the harness's full-page screenshot resize caused it.
2. **Hero suite, 1440×900 at 1× and 390×844 at 3×:** all passed.
   - Entrance filmstrip at 150/600/1100/1600/2300/3200 ms. Reviewed: the title stays readable throughout.
   - After the entrance: headline transforms at identity; nav, foot and image at opacity 1; clip cleared.
   - Correct WebP chosen; CLS 0.0005 (desktop) and 0.0001 (phone).
   - Page scrollable during the intro.
   - Scroll-away at 50 % hero height: shade 0.23, foot 0. Reverse scroll back to 0 restores shade 0 and foot 1.
   - No console errors.
3. **Interaction suite:** all passed.
   - Every in-page link, now including the scroll cue, lands correctly in normal, reduced-motion and CDN-blocked modes and on a 390 px touch phone.
   - Carousel buttons, dots, arrow keys and `aria-hidden`.
   - Hover, focus and tap-twice previews (now WebP).
   - Keyboard: 23 focus stops in logical order (the scroll cue comes after "Enquire"), all with visible outlines.
   - Reduced motion: static hero, no Lenis.
4. **Screenshots reviewed:** reduced-motion and JS-off hero at 1440 and 390 (complete static hero, nothing hidden); scroll-away frames at both widths; settled studio section at 390.

**Not done:** real devices, Safari/Firefox, a screen reader, Lighthouse/performance audits, or throttled-network loading.

### Unresolved and observations

- **Studio statement mid-wipe:** mid-animation captures of the existing "studio statement" highlight wipe look ragged on phones (half-wiped lines). The settled state is clean. Out of scope here; worth reviewing in the next section pass.
- **Failsafe trade-off:** with a slow or hanging CDN, the hero stays in its pre-entrance state (dark ground, nav hidden) until either `main.js` runs or the 4 s failsafe fires. A fast CDN failure removes it immediately (measured about 0.2–0.6 s in blocked runs).
- **Leftover code:** `brand.js` still contains the loader's split-around-a-slot-letter logic. It's harmless, but can be removed in a cleanup.
- `img/aayaadi/*.jpg` full-size copies stay in the project but aren't loaded. Exclude them from any preview upload.
- AVIF wasn't added. WebP alone already gives about an 8× reduction at desktop, and a `<picture>` AVIF layer can be added later if wanted.
- Carried over: the closing photo (GM15) is only 1440 px wide, and every content and contact fact still needs confirming with Aayaadi.

### Next

Review this hero pass. Then do the remaining sections one at a time, in the order in "Next: motion pass" below, and re-run the matrix, interaction and hero suites after each.

## 27 Oct 2026: phases 0–3 (static first pass) plus responsive and accessibility checks

**Phase numbering.** The startup prompt asked for phases 0–3 and calls the motion pass "Phase 4". In `Aayaadi_Execution_Plan_For_Claude.md`, the responsive/accessibility pass is Phase 4 and the motion pass is Phase 5. This pass covers plan phases 0–3 plus the responsive and accessibility work the prompt also asked for. **The motion pass has not started.**

### Phase 0: isolate, extract, run the untouched starter

- `Aayaadi_Claude_Handoff_Bundle.zip` was extracted to `_handoff/`. The original ZIP in `Documents/` was not touched.
- `asterix-template.zip` was extracted to `_reference/asterix-template/` (pristine) and copied to the project root as the working copy.
- The three photo ZIPs were extracted to `_source-assets/<archive name>/`.
- Everything under `_handoff/`, `_reference/` and `_source-assets/` is set read-only (88 files).
- **Read in full:** the template README, `index.html`, `css/style.css`, `js/main.js`, `js/brand.js`, `js/iso.js`, the plan, the startup prompt, `README_FIRST.txt`, and the three archive READMEs.
- **Baseline run** (pristine template on a local Node server, headless Chrome 156 via playwright-core 1.49.1, at 1440 and 390 px in normal, reduced-motion, JS-off and CDN-blocked modes). It loads with no page errors. Issues recorded:
  1. `GET /favicon.ico` returns 404 (no favicon).
  2. With JS off, the nav logo and footer wordmark are empty (they are built by `brand.js`).
  3. With JS off, the process carousel shows broken-image alt text (its images are drawn by `iso.js`) and all captions are hidden (`opacity: 0`).
  4. At 760 px and below, the nav links are `display: none` with no alternative, so phones get only the logo and one button.
  5. Contrast failures: white on the gold button gradient is about 2:1 at the light end; grey `#9d9d9d` note text on `#f3f3f1` is about 2.5:1; card type `#a8a8a8` on white is about 2.3:1; the styles-list words (`#c6c6c6`) are about 1.7:1.
  6. Fictional content throughout: ASTERIX brand, 5-star "Award-winning" claim, invented projects and m² areas, fictional testimonials, stand-in partner logos, invented FAQ answers, Moscow, UTC+3, `.example` email, ©Asterix.
  7. Mid-scroll screenshots show a ~16 px dark strip at the top. This is a Lenis catch-up artifact (settled captures don't show it), not a layout bug, and it is present in the template too.

### Phase 1: asset audit and content truth

- All 63 images were inspected: dimensions, EXIF orientation, camera date, MD5, a perceptual hash, and their **true format**. Five Google files (14, 15, 28, 29, 30) are PNG data with `.jpg` names. All were viewed. See `ASSET_MANIFEST.md`.
- **Groupings, evidence only:** A, B and C are three homes or capture sessions, tied by EXIF times and identical furniture. Group A is linked to Aayaadi's own watermarked Instagram post, so it has the strongest attribution. R is a set of renders (Google 03, 21, 29, 30, 32). Excluded images include renders, a mock-up, artworks, a mood board, promo graphics, people-led reel frames, religious imagery, a child's photo and trophies.
- **Facts available from the handoff, all unverified with Aayaadi:**
  - Name "Aayaadi Designs"
  - Category "Interior Design Studio"
  - Address 19 Ground Floor, K-16, DLF Phase 2, Sector 25, Gurugram, Haryana 122002 (the listing also says "Sarhol", omitted for length)
  - Phone +91 98737 47198
  - Instagram @aayaadi_designs
  - Facebook page "Aayaadi By Shreshth Aashima"
  - Google rating 4.9 from 49 reviews at capture
- **Deliberately not used:** the rating, the founders' names, the Instagram follower count, the "9 ceilings" reel claim, and any project, client, service or process claims.

### Phases 2–3: reskin and static pass

**Files changed or created (project root):**

| File | Change |
|---|---|
| `index.html` | Rewritten on the starter's structure. Title/description/OG updated for an unofficial concept; `noindex, nofollow, noarchive`; `lang="en-IN"`; inline SVG favicon. Hero: concept title "Spaces, shaped around living.", "Interior design studio / Gurugram, Haryana" (from the listing category and address), the approved supporting line, an "Independent concept / Not the official website" note, and an "Enquire" button. Nav: Studio, Work, Details, Contact. Studio statement (concept copy) plus a provenance note. Gallery "Selected work" with 4 real photos labelled only by room type plus "Selected interior". Form/Material/Light/Detail list with real previews (counts removed). Process carousel became a "Closer looks" carousel of 3 real photos with descriptive captions. Testimonials became a closing "Let's shape your space." section with call and Instagram buttons. **Removed:** partners marquee, FAQ, Allura font. Footer: phone, studio address (linked to the Google listing), Instagram, concept and Urbn Creations disclaimer, "Back to top". Alt text describes only what is visible. Width/height on all images; `loading="lazy"` below the fold; `fetchpriority="high"` on the hero. |
| `css/style.css` | Tokens kept. Contrast fixes: darker button gradient (white text about 4.6:1), `--muted #6b6b6b`, card type `#737373`, list words `#949494` (3:1, large text), eyebrow `#6b6b6b`, captions `#666`. Visible focus outline colour. Hero overlay strengthened for the bright photo, title resized for 4 words, hero crop tuned. Ampersand watermarks removed. Card crops via `object-position`. Partners/FAQ/quote styles removed; `process`/`stories` renamed `details`/`interlude`. No-JS carousel becomes a scroll-snap row with static captions. Phones (≤760 px) get a second nav row (the baseline hid the links). The carousel caption area gets a 128 px floor (it clipped at 768 px). `prefers-reduced-motion` kept. |
| `js/brand.js` | Replaced the ASTERIX-only SVG glyph table with a plain letter splitter (same `data-wordmark`/`data-slot` API). The HTML keeps the word as text, so it reads without JS. |
| `js/main.js` | Boot flag renamed (`__siteBooted`). Partners and FAQ code removed. Selectors moved to `.details`/`.interlude`. Testimonial quote animations and their pin removed (no quotes are left to reveal). Ampersand tween removed. `boot()` now skips straight to the hero intro if the wordmark split, slot letter or hero image is missing, so a missing glyph can't break the intro. **No new motion was added.** |
| `js/iso.js` | Not carried over (it drew the fake process illustrations). Still available in `_reference/`. |
| `img/` | The template images were not carried over. `img/aayaadi/` holds 13 byte-identical copies (MD5 verified) with their original filenames. |
| `README.md` | Rewritten: how to run, file map, sections, libraries, how to edit, resilience. |
| `ASSET_MANIFEST.md`, `BUILD_LOG.md` | New. |
| Inline failsafe | Loader removal if `main.js` never runs: 9 s → 6 s. |

### Checks actually run on the final files

All checks ran in headless **Chrome 156** (playwright-core 1.49.1) against a local Node static server bound to 127.0.0.1. The QA scripts are outside the project, in the session scratchpad (`tools/qa-pass.mjs`, `qa-interact.mjs`, `qa-shots.mjs`, `serve.mjs`).

1. **Load matrix:** 6 widths (1440, 1280, 1024, 768, 390, 375) × 4 modes (normal, reduced-motion, JS off, CDN blocked) = 24 runs. Every run had no horizontal overflow, no broken images, no dead `#` anchors and no page errors.
   - Normal, reduced-motion and JS-off runs had zero console errors or warnings.
   - CDN-blocked runs logged only the 4 requests that were deliberately blocked (Geist, GSAP, ScrollTrigger, Lenis); the loader cleared in about 0.1–0.2 s.
   - The server log shows no 404s, including the favicon.
2. **Interaction suite:** all passed.
   - Every in-page link (13) lands on its target in normal (Lenis), reduced-motion and CDN-blocked modes, and on a 390 px touch phone.
   - Carousel: next button, dot, ArrowLeft key, disabled state at the end, and `aria-hidden` syncing.
   - Hover preview opens with the right photo and closes when the pointer leaves; keyboard focus opens previews too.
   - On touch, the first tap previews without navigating and the second tap follows the link.
   - Keyboard: 23 focus stops in logical order, each with a visible outline and on screen.
   - Reduced motion: no Lenis, hero text static, nav visible.
3. **Visual review** of settled and mid-scroll screenshots at 1440, 768 and 390, plus full-page JS-off captures at 1440 and 390 and a reduced-motion capture at 768.
4. **Source search:** none of the template names, Moscow, `.example`, UTC, award/★, partner, FAQ, testimonial or style-count text remains in `index.html`, `css/` or `js/`. Two developer comments mention the starter: the CSS header credits "the Asterix starter", and an HTML comment notes the testimonials replacement.

**Not tested:** real phones and tablets, Safari/WebKit, Firefox, a screen reader, Lighthouse, and slow or throttled networks.

### Known issues and limitations

- **Images are full-size originals** (none optimised yet). About 6.3 MB of photos load as you scroll the page (the hero is 0.45 MB), plus about 1.1 MB more for the two hover previews that aren't otherwise on the page. Web-sized derivatives are planned for Phase 6.
- **The closing photo (Google 15) is only 1440 px wide.** It is slightly soft on large screens because the section is 112 % viewport height for its parallax drift.
- **The normal-mode loader holds the page for about 3.3–4.2 s.** This is the starter's existing behaviour, kept as asked. The plan says to keep the loader only if it earns its place; that's a Phase 5 decision.
- **The details pin is unchanged** from the starter's "process" pin. While it holds, the closing section slides over the carousel by design; the whole carousel is visible before that starts.
- **Hero crop:** at some desktop ratios, the edge of the split AC unit is still visible at top right.
- **Not verified with Aayaadi:** all page copy (draft concept copy) and the contact details (from public listings in the handoff).
- **The footer credits Urbn Creations** (suggested in the plan). Remove it if that's not wanted.

### Still to confirm with Aayaadi before sharing

See "Open questions for Aayaadi" in `ASSET_MANIFEST.md`: photo attribution and permissions, project facts, renders, clean originals, official logo, and contact details.

### Next: motion pass (plan Phase 5)

Only after the static reskin is reviewed and approved. Work one section at a time in this order:

1. **Loader:** decide whether to keep it. If kept, shorten it and make sure it never blocks content; otherwise replace it with a quick hero reveal.
2. **Hero drift:** keep it subtle and image-led.
3. **Statement wipe:** must stay legible if scripts fail.
4. **Gallery parallax:** retune the `data-speed` values for the new crops.
5. **Form/Material/Light/Detail and Closer looks reveals:** decide whether the details pin stays.
6. **Closing section and footer reveal.**

After layout changes, call `ScrollTrigger.refresh()`, and re-run the full QA matrix after each step.
