---
name: Aayaadi Designs
description: Website concept & interactive pitch demo for Aayaadi Designs interior architecture studio
colors:
  primary: "#9b6b2c"
  primary-dark: "#7d5320"
  ink: "#1a1a1a"
  paper: "#f3f3f1"
  white: "#ffffff"
  text: "#4b4b4b"
  text-strong: "#262626"
  muted: "#6b6b6b"
  on-ink: "#dcdcdc"
  on-ink-secondary: "#b3b3b3"
  on-ink-tertiary: "#9a9a9a"
  rule-dark: "#2e2e2e"
  rule-dark-secondary: "#3a3a3a"
typography:
  display:
    fontFamily: "Geist, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "max(40px, 9.6vw)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Geist, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "max(30px, 4.1vw)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Geist, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "max(24px, 3.85vw)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.028em"
  body:
    fontFamily: "Geist, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "max(14px, 1.28vw)"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0em"
  label:
    fontFamily: "Geist, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "max(11px, 1.02vw)"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.08em"
rounded:
  sm: "2px"
  md: "4px"
spacing:
  pad: "max(16px, 1.74vw)"
  col2: "34.3vw"
components:
  button-gold:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    padding: "0.55em 1.5em"
  button-line:
    textColor: "{colors.text-strong}"
    padding: "0.5em 1.2em"
  button-ghost:
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    padding: "0.55em 1.5em"
---

# Design System: Aayaadi Designs

> **Depth and voice pass, 29 Oct 2026 (latest).** Grounds were given a real tonal ladder so
> elevation reads before any shadow is drawn: `--ink #130f0b`, `--bone #f1ebdf`, `--stone #e6dac6`,
> `--white #fffcf5`. Brass carries more chroma (`--brass #9a6522`, 4.9:1 with white) and the gold
> button is now solid with a lit top edge and a warm cast, not a horizontal gradient. Shadows are
> warm rather than neutral grey and are built as a tight contact shadow plus a wide ambient one;
> photographs sit in a hairline mount (`inset` ring plus lit top edge). Fraunces is pinned to
> `"opsz" 144` with a lower `SOFT` on display headings, so hairlines stay fine at size. `--muted`
> was darkened to `#655949` to clear AA on the stone ground (4.9:1). A new `#credo` statement
> section sits between the studio and the work gallery: a dark beat whose words warm from dim to
> lit in reading order as it scrolls up (`main.js`, driven by the existing scroll hooks, and all
> words are lit at once under `prefers-reduced-motion`). Section copy was rewritten away from
> abstract headings and repeated `A · B · C` keyword triplets; see `AI-INVENTED.md`.
>
> The same pass then reached the lower half of the page. **Process**: the three deliverables per
> stage sit in a recessed bone tray (hairline border, lit top edge, soft inner shadow) a step below
> the white ground; the active stage number carries a brass glow, and so do the timeline fill and
> the stage dot. **FAQ**: every row carries the horizontal padding, so opening one lifts it onto
> white paper with a soft cast and nothing shifts sideways; the call card gained a warm pool inside
> it and a champagne lit edge. **Footer**: a warm pool sits behind the brand block, opposite the
> photograph. Display serif headings in all three now use the same `"opsz"` treatment, with `72`
> rather than `144` on sub-heads so they do not go too fine at smaller sizes.
>
> Translucent surfaces now read from `--ink-rgb` and `--champ-rgb` instead of hardcoded channels.
> Several had been left on the pre-pass ink (`rgba(23, 19, 15, …)`) and were fading to a colour the
> page no longer used, which showed as a seam against the enquire and footer photographs.
>
> **Polish pass, 29 Oct 2026.** The tokens in the frontmatter above predate this pass. The shipped system in `css/style.css` now uses warm grounds (`--ink #17130f`, `--bone #f6f1e7`, `--stone #ece3d3`, `--white #fffdf8`), brass `#85571d` / `#96631f` with champagne `#e8cf9f` on ink, Fraunces display (light, italic brass emphasis word) over Geist body, and a clamp-based type scale. The blurred ambient orbs and the Atmosphere selector were removed. Depth now comes from layered plate shadows (offset plus blur), a brass offset frame on the pillars exhibition, and scrubbed parallax. Hover never scales photographs. Motion is word-mask headings, a clip-path wipe for plates, a wipe exhibition for the pillars, a loupe on Closer looks and a scroll-driven process line.

## Overview

**Creative North Star: "The Curated Living Gallery"**

Aayaadi Designs is presented as an immersive architectural exhibition where residential spaces unfold with the rhythm, pacing, and dignity of an editorial art book. Rather than a high-frequency marketing landing page, the interface recedes into quiet neutral ground, allowing authentic textures—fluted walnut panelling, vein-matched marble, backlit amber stone, and sculpted metalwork—to command the viewer's attention.

The visual language transitions deliberately between atmospheric dark ink environments (the cinematic hero entrance, the closing evening interlude, and the monolithic footer) and tactile paper galleries that bathe the studio's interior photographs in daylight. Every interaction feels deliberate, weighted, and calm, honoring architectural craft over digital decoration.

**Key Characteristics:**
- **Editorial Typography**: Disciplined tight-leading display type paired with tracked caps and balanced paragraphs.
- **Tonal Contrast**: Dynamic shift from deep charcoal ink (`#1a1a1a`) to warm paper (`#f3f3f1`) and pure mounting white (`#ffffff`).
- **Architectural Movement**: Masked line reveals, aperture unmasking, and gentle scrubbed parallax that feel physical rather than synthetic.
- **Honest Materiality**: Real photography presented without artificial overlays, badges, or gimmicky animations.

## Colors

The palette balances warm organic neutrality with deep architectural contrast and refined bronze-gold metallic accents.

- **`--ink` (`#1a1a1a`)**: Ground tone for the hero ground, closing interlude, and footer. Deep, quiet, and timeless.
- **`--paper` (`#f3f3f1`)**: Warm mineral paper ground for the studio statement and selected work gallery.
- **`--white` (`#ffffff`)**: Clean exhibition ground used for the theme interactions, project card mounts, and closer look slides.
- **`--text-strong` (`#262626`)**: Charcoal black used for major titles, project numbers, and active navigation states.
- **`--text` (`#4b4b4b`)**: Deep graphite used for section titles and primary editorial copy on light backgrounds.
- **`--muted` (`#6b6b6b`)**: Secondary editorial copy, captions, and project descriptions. Engineered to satisfy WCAG AA contrast (4.9:1 on paper, 5.3:1 on white).
- **`--gold-a` (`#7d5320`) & `--gold-b` (`#9b6b2c`)**: Tailored bronze-gold gradient. Specifically darkened from template yellow to ensure white text achieves WCAG AA compliance (4.6:1).
- **`--rule-dark` (`#2e2e2e`) & `--rule-dark-2` (`#3a3a3a`)**: Subtle architectural hairlines across dark sections.

## Typography

Typography uses **Geist**, a geometric yet human grotesque sans-serif that balances Swiss precision with warm, contemporary architectural clarity.

- **Hero Display (`max(40px, 9.6vw)`)**: Extra-large, ultra-tight leading (`0.92`), tightly tracked (`-0.045em`), creating monolithic typographic blocks.
- **Editorial Statement (`max(24px, 3.85vw)`)**: Medium-bold weight (`500`), line-height `1.04`, masked into individual rising lines on scroll.
- **Section Headers (`max(30px, 4.1vw)` to `max(34px, 7vw)`)**: Light to regular weights with balanced line wrapping.
- **Body & Notes (`max(14px, 1.28vw)` / `15px` mobile)**: Generous reading line-height (`1.45–1.5`) with `text-wrap: pretty`.
- **Labels & Micro-Copy (`max(11px, 1.02vw)` / `12px` mobile)**: Uppercase, semibold (`500`), letter-spaced at `0.08em` (`--track-caps`).

## Layout

The layout is built upon an asymmetric two-column editorial grid:

- **Asymmetric Hanging Column**: Major body text, the second line of the hero title, the studio statement, and the theme words hang precisely from `--col2` (`34.3vw` desktop, `26vw` tablet).
- **Mobile Fluidity**: Collapses cleanly to a single-column layout at `<= 760px` with fixed comfortable type floors (`15px` body) and tactile touch targets (`44px+`).
- **Generous Margins**: Outer padding dynamically scales via `max(16px, 1.74vw)`, accommodating safe-area insets seamlessly.

## Elevation & Depth

- **Tonal Layering Over Drop Shadows**: Visual elevation is achieved purely through crisp planar contrast (pure white cards sitting on warm paper grounds) rather than blurry drop shadows.
- **Aperture & Masking Depth**: Elements emerge from defined spatial apertures (clip paths and negative margin overflows) rather than floating arbitrarily.
- **Tactile Parallax**: In desktop viewports, gallery cards and typography drift at varying scrubbed velocities (`0.82` to `1.15`), giving the impression of physical architectural depth.

## Shapes

- **Architectural Rectilinearity**: Sharp, structural corners (`border-radius: 0` to `2px`) evoke stone slabs, framed prints, and millwork panels.
- **Curved Interlude Transition**: The closing section introduces a sweeping organic top curve (`--curve: 7vw` desktop, `10vw` mobile) that softens the transition into evening contact and inquiry.
- **Precise Hairlines**: 1px dividers ground navigation baselines and footer bands.

## Components

- **Buttons**:
  - **Gold Action (`.btn-gold`)**: Subtle horizontal bronze gradient that smoothly shifts position on hover; crisp `2px` corners.
  - **Line Button (`.btn-line`)**: 1px structural border that inverts into solid graphite fill on hover.
  - **Ghost Button (`.btn-ghost`)**: Delicate semi-transparent white border for dark hero/interlude sections.
- **Project Cards (`.pcard`)**: Minimal white gallery mount encasing photographs with aspect ratios matching source compositions (`354/242`, `279/283`). Micro-scale zoom (`1.05`) on hover over 1.2s.
- **Theme Previews (`.styles`)**: Interactive word list where hovering or focusing a word enlarges it and displays a floating photographic preview aligned to the word's baseline.
- **Image Carousel (`.carousel`)**: Focused single/three-up sliding reel with custom circular step arrows, SVG chevron geometry, and touch pan support.
- **Lightbox Dialog (`.lightbox`)**: Accessible native `<dialog>` overlay with full keyboard trapping, escape handling, and high-resolution zoom presentation.

## Do's and Don'ts

### Do's
- **Preserve Architectural Restraint**: Keep all transitions, animations, and typography changes calm and deliberate.
- **Respect Image Integrity**: Always maintain source aspect ratios and verify crops across desktop, tablet, and mobile breakpoints.
- **Ensure Complete Fallbacks**: Ensure every heading, caption, and image remains 100% visible and accessible when JavaScript or CDNs are blocked.
- **Maintain Contrast Standards**: All text must meet WCAG AA contrast against its respective ground tone.

### Don'ts
- **Never Use Floating Dropshadows or Blur Slop**: Do not add generic box-shadows or saturated neon accents.
- **Never Hijack Scrolling**: Avoid forced scroll-jacking or rigid timelines that prevent smooth natural reading.
- **Never Fabricate Unverified Content**: Do not insert fake awards, fictitious metrics, star ratings, or imaginary client reviews.
- **Never Cut Off Descenders in Masks**: Ensure line-reveal masks have sufficient overflow padding and clear translation values (`yPercent: 125`).
