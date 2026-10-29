# Asset manifest: Aayaadi Designs concept

Audit of every image in the three supplied photo archives (63 images), done on 27 Oct 2026 for the static first pass.

- **Three tiers of files** (see "Source assets vs web derivatives" below):
  1. **Source assets**, untouched and read-only: `_source-assets/<archive name>/`, plus the ZIPs in `_handoff/inputs/`.
  2. **Full-size copies**, byte-identical with the original filenames: `img/aayaadi/*.jpg`. Kept for reference; **the page no longer loads them.**
  3. **Web derivatives**, WebP at several widths: `img/aayaadi/web/`. **These are the only images the page loads.**
- **How each row was made:** dimensions, EXIF orientation, camera date and true file format were read from the files themselves. "Likely subject" describes only what is visible. Every image was viewed.
- **Duplicates:** checked with MD5 (no exact duplicates) and a 64-bit perceptual hash (one borderline pair, GM 31 and IG 18; viewed side by side, they are different scenes).
- **Orientation:** every file has EXIF orientation 1 (upright), so stored and displayed dimensions are the same.

## Archive key

| Code | Archive | Source (per the archive's own README) |
|---|---|---|
| GM | `Aayaadi-Designs-Google-Maps-Photos.zip` | Google Maps listing "Aayaadi Designs", 33 gallery items (32 photos + 1 video poster), `=s2048` downloads, captured 27 Oct 2026 |
| GG | `Aayaadi-Designs-Gurugram-Photos.zip` | 9 photos from the place-details gallery, **all sourced from the Facebook page "Aayaadi By Shreshth Aashima"** |
| IG | `Aayaadi-Designs-Instagram-New-Photos.zip` | Selected posts from @aayaadi_designs, deduplicated by the supplier against GM and GG; reel files were unavailable, so only posters are included |

## Confidence scale

Confidence means confidence that the image is **a real photograph of an interior that Aayaadi presents as its own work**. It does not mean the project's name, client, location or date are known; none of those are known for any image.

- **High:** Aayaadi posted it on its own Instagram with its watermark, or it matches such a post by EXIF session and identical furniture.
- **Medium:** a real photograph in Aayaadi's Google or Facebook gallery, with no independent link. Google listing galleries can include uploads by visitors and customers as well as the owner.
- **Low:** a 3D render, mock-up, artwork, graphic or otherwise not a completed interior.
- **n/a:** logos, promotional graphics and people-led reel frames.

## Evidence-based groups

Images are grouped only where the evidence supports it. Everything else is treated as a separate editorial image. Group letters are internal labels, not project names.

| Group | Members | Evidence | Strength |
|---|---|---|---|
| **A** | GM 01, 02, 05, 08, 13, 20, 22; IG 19b, 19c | EXIF capture 14 May 2025, 15:22–15:51 (GM 01/05/08/13/20/22). Same tray ceiling with wood trim and LED strips; same dining set in 05/08/20; same kitchen through the opening in 05/13/20; same veined wall, sofa and gold lotus in 01/02/22. IG 19b/19c are slides 2–3 of Aayaadi's own watermarked "onyx" post, whose slide 1 the supplier matched to GM 22. | Strong: one home, presented by Aayaadi |
| **B** | GM 06, 09, 17, 18, 31, 33 | EXIF 1 Mar 2024, 12:25–13:03. 06/18 show the same bed and bedspread; 09/31/33 the same patterned table and tub chairs; the glowing amber panel in 17 is visible behind the table in 09; 31/33 share the layered, cove-lit wall moulding. | Strong: one home |
| **C** | GM 04, 07, 10, 12, 16, 19, 25, 27 | EXIF 27 Sep 2024, 17:40–19:40. 04/19 show the same bed; 25/27 the same nook; 07/16 the same chess-piece decor. | Moderate: one capture session; that it is a single home is likely but unproven |
| **D** | GM 11, 23, 24 | EXIF 14 Jul 2023, 20:19, within one minute. All three are framed artworks. | Strong as a session; not interiors |
| **R** | GM 03, 21, 32 (also 29, 30) | Identical 2000×1500 size, no capture date, CGI lighting and surfaces | Renders, not completed spaces |
| **E** | GG 08, IG 09 | Same dining room: amber backlit wall and Sputnik-style chandelier | Strong: same room |
| **F** | IG 15, IG 16 | Same staircase | Strong: same staircase |

## Images used on the page (13)

| File | Where it is used |
|---|---|
| `aayaadi-google-22-photo.jpg` | Hero (the intro loader that also used it has been removed) |
| `aayaadi-google-02-video-poster.jpg` | Studio thumbnail 1; Details slide 1 |
| `aayaadi-google-07-photo.jpg` | Studio thumbnail 2; "Form" preview |
| `aayaadi-google-17-photo.jpg` | Studio thumbnail 3; "Light" preview |
| `aayaadi-google-31-photo.jpg` | Gallery card 01 |
| `aayaadi-google-19-photo.jpg` | Gallery card 02 |
| `aayaadi-google-05-photo.jpg` | Gallery card 03 |
| `aayaadi-google-16-photo.jpg` | Gallery card 04 |
| `aayaadi-google-01-photo.jpg` | "Material" preview (loads on hover or focus) |
| `aayaadi-google-10-photo.jpg` | "Detail" preview (loads on hover or focus) |
| `aayaadi-google-06-photo.jpg` | Details slide 2 |
| `aayaadi-google-13-photo.jpg` | Details slide 3 |
| `aayaadi-google-15-photo.jpg` | Closing "Let's shape your space." background |

All 13 come from the Google listing. Ten of them belong to Groups A, B or C; GM 15 is ungrouped.

## Source assets vs web derivatives

**How the derivatives were made (28 Oct 2026):**
- Encoder: sharp 0.33.5 (libvips 8.15.3, libwebp 1.4.0), reading the read-only originals in `_source-assets/`.
- WebP quality 82 for the hero and the closing background, 80 for everything else; effort 6; never upscaled.
- Each file is named `<original filename without extension>-<width>.webp`, so every derivative traces back to its source.

**Quality check:** a 1:1 crop of fine detail compared original against derivative (the fluting and veining in GM22 at 1536 px, and the patterned table top in GM31 at 800 px). No visible loss.

**How the page uses them:**
- Every `<img>` has `srcset`/`sizes`, so the browser fetches one appropriate width.
- Below-the-fold images use `loading="lazy"`.
- The hero is preloaded with `fetchpriority="high"`.
- `width`/`height` match each derivative's aspect ratio, to prevent layout shift.

| Source (tier 1/2) | Source size | Web derivatives in `img/aayaadi/web/` (width → KB) | Used for | `sizes` |
|---|---|---|---|---|
| `aayaadi-google-22-photo.jpg` | 1536×2048, 440 KB | 640 → 60, 960 → 115, 1280 → 179, 1536 → 235 | Hero (preloaded, `fetchpriority=high`, not lazy) | `(max-aspect-ratio: 3/4) 75vh, 100vw` |
| `aayaadi-google-02-video-poster.jpg` | 1152×2048, 276 KB | 240 → 12, 480 → 33, 800 → 71, 1152 → 120 | Studio thumb; Details slide 1 | thumb `5.5vw` / `44px`; slide `37vw` / `72vw` |
| `aayaadi-google-07-photo.jpg` | 1536×2048, 505 KB | 240 → 7, 480 → 22, 800 → 57, 1200 → 122 | Studio thumb; "Form" preview (800) | thumb as above |
| `aayaadi-google-17-photo.jpg` | 1536×2048, 529 KB | 240 → 12, 480 → 38, 800 → 89, 1200 → 177 | Studio thumb; "Light" preview (800) | thumb as above |
| `aayaadi-google-31-photo.jpg` | 1536×2048, 461 KB | 480 → 36, 800 → 85, 1200 → 156 | Gallery card 01 | `34vw` / `82vw` |
| `aayaadi-google-19-photo.jpg` | 1536×2048, 559 KB | 480 → 35, 800 → 91, 1200 → 192 | Gallery card 02 | `27vw` / `82vw` |
| `aayaadi-google-05-photo.jpg` | 1536×2048, 557 KB | 480 → 34, 800 → 83, 1200 → 176 | Gallery card 03 | `23vw` / `82vw` |
| `aayaadi-google-16-photo.jpg` | 1536×2048, 536 KB | 480 → 27, 800 → 64, 1200 → 145 | Gallery card 04 | `24vw` / `82vw` |
| `aayaadi-google-06-photo.jpg` | 1536×2048, 473 KB | 480 → 37, 800 → 88, 1200 → 169 | Details slide 2 | `37vw` / `72vw` |
| `aayaadi-google-13-photo.jpg` | 1536×2048, 329 KB | 480 → 21, 800 → 48, 1200 → 87 | Details slide 3 | `37vw` / `72vw` |
| `aayaadi-google-01-photo.jpg` | 1536×2048, 652 KB | 800 → 110 | "Material" preview (on hover or focus) | fixed |
| `aayaadi-google-10-photo.jpg` | 1536×2048, 438 KB | 800 → 56 | "Detail" preview (on hover or focus) | fixed |
| `aayaadi-google-15-photo.jpg` | 1440×811 (PNG data), 1,481 KB | 960 → 78, 1440 → 144 | Closing background (lazy) | `(max-aspect-ratio: 16/9) 200vh, 100vw` |

All derivatives together come to 3.3 MB on disk, but a browser downloads only one width per image. Measured image transfer for a complete scroll of the page, headless Chrome 156:

- 1440×900 at 1×: **797 KB** (12 requests)
- 390×844 at 3×: **1,455 KB** (12 requests)

Before this pass, a full scroll loaded about 6.3 MB of originals.

## Per-image audit

**Columns:** Px = width × height. Orient. = P (portrait), L (landscape) or S (square). Proposed use: **USED** = on the page now, Reserve = good spare, Not used = excluded, with the reason given.

### Google Maps (GM): 33 files

| # | File | Px | Orient. | Likely subject (visible only) | Quality / watermark / format notes | Grp | Proposed use | Conf. | Verify with Aayaadi |
|---|---|---|---|---|---|---|---|---|---|
| GM01 | `aayaadi-google-01-photo.jpg` | 1536×2048 | P | Living room: large veined stone-look panel framed by fluted panels, pale sectional with grey cushions, round tables with gold lotus, tripod lamp; split AC at right | Sharp phone photo, slight wide-angle lean; no watermark; EXIF 2025-05-14 15:51 | A | **USED**: "Material" preview | High | Client permission to publish? Project name/location? Is the panel onyx, marble or porcelain? |
| GM02 | `aayaadi-google-02-video-poster.jpg` | 1152×2048 | P (9:16) | Close-up: gold lotus on a round cream stone-look table; sofa, grey cushions, veined wall behind | Poster frame of a 0:06 video; sharp enough; no EXIF, no watermark | A (visual) | **USED**: studio thumb, Details slide 1 | High | Can the source video be supplied? |
| GM03 | `aayaadi-google-03-photo.jpg` | 2000×1500 | L | Bedroom: panelled walls with sconces, wall TV, stone-look floor, wardrobes with brass handles | **Appears to be a 3D render**; no capture date | R | Not used (render) | Low | Render or photo? Which project? Was it built? |
| GM04 | `aayaadi-google-04-photo.jpg` | 1536×2048 | P | Bedroom: scalloped upholstered headboard, backlit timber-slat strip, textured grey wall, pink/grey bedding, end bench | Real photo, good; ceiling fan in frame; EXIF 2024-09-27 18:50 | C | Reserve (same room as GM19) | Medium | Project and permission |
| GM05 | `aayaadi-google-05-photo.jpg` | 1536×2048 | P | Dining: white-and-black veined table, blue/grey upholstered chairs, fluted-glass door, kitchen through an opening | Real photo, good; EXIF 2025-05-14 15:50 | A | **USED**: gallery card 03 | High | Permission |
| GM06 | `aayaadi-google-06-photo.jpg` | 1536×2048 | P | Bedroom: carved white bed, tufted brown headboard, moulded wall panels, crystal sconces, cove light | Real photo; warm white balance; EXIF 2024-03-01 12:26 | B | **USED**: Details slide 2 | Medium | Project and permission |
| GM07 | `aayaadi-google-07-photo.jpg` | 1536×2048 | P | Cream fluted wardrobes with arched grooves framing a walnut-finish TV panel; chess-piece decor | Real photo; EXIF 2024-09-27 17:46 | C | **USED**: studio thumb, "Form" preview | Medium | Project and permission |
| GM08 | `aayaadi-google-08-photo.jpg` | 1536×2048 | P | White fluted display unit with mirrored shelves and decor, split AC set into the unit; dining chairs in front | Real photo; the AC unit dominates; EXIF 2025-05-14 15:49 | A | Not used (AC dominates) | High | n/a |
| GM09 | `aayaadi-google-09-photo.jpg` | 1536×2048 | P | Dining: geometric-patterned table, ochre tub chairs, glowing amber panel behind; white jaali prayer unit with deity pictures at right | Real photo; religious images in frame; EXIF 2024-03-01 13:03 | B | Not used (religious imagery; would need a crop and permission) | Medium | Is the table inlay work? Permission for prayer-unit imagery? |
| GM10 | `aayaadi-google-10-photo.jpg` | 1536×2048 | P | Grey wardrobe shutters with inlaid concentric lines and long black handles; bed edge, open shelves | Real photo; EXIF 2024-09-27 19:17 | C | **USED**: "Detail" preview | Medium | Permission |
| GM11 | `aayaadi-google-11-photo.jpg` | 1536×2048 | P | Framed pencil/paper-collage portrait artwork | Photo of an artwork; glare on glass; EXIF 2023-07-14 20:19 | D | Not used (artist and sitter unknown) | Low | Whose artwork? Why is it on the listing? |
| GM12 | `aayaadi-google-12-photo.jpg` | 1536×2048 | P | Prayer room: bronze-framed fluted-glass doors, stone-look backdrop with a coloured religious emblem, framed portraits | Real photo; religious and personal content; EXIF 2024-09-27 19:40 | C | Not used (religious/personal) | Medium | n/a |
| GM13 | `aayaadi-google-13-photo.jpg` | 1536×2048 | P | Kitchen through a timber-framed opening: sage-green cabinets, fluted timber counter, glossy floor | Real photo; chair edge and a red item at the bottom edge; EXIF 2025-05-14 15:22 | A | **USED**: Details slide 3 (square crop) | High | Permission |
| GM14 | `aayaadi-google-14-photo.jpg` | 1080×1231 | P | Bright palette-knife painting of a dancing couple above a white sofa; timber floor, topiaries | **PNG data in a .jpg file.** Looks like a digital mock-up (art placed in a stock room), not a photographed interior | none | Not used | Low | Is this an art product Aayaadi sells? |
| GM15 | `aayaadi-google-15-photo.jpg` | 1440×811 | L | Lounge seen through a geometric metal screen of slatted triangles; tufted cream sofa, dark veined block table, gold-toned walls, white jaali panel | **PNG data in a .jpg file**, 1.5 MB. Real photo with a warm film-like grade; no EXIF; softens when enlarged past 1440 px | none | **USED**: closing interlude background (decorative) | Medium | Which project? Home or commercial? Higher-resolution original? |
| GM16 | `aayaadi-google-16-photo.jpg` | 1536×2048 | P | Study: shared desk for two, two office chairs, white high-gloss cabinets, lit shelf with chess pieces, herringbone floor, black glass display | Real photo; mild wide-angle; EXIF 2024-09-27 18:06 | C | **USED**: gallery card 04 | Medium | Permission |
| GM17 | `aayaadi-google-17-photo.jpg` | 1536×2048 | P | Backlit amber stone-look wall and counter over a white fluted cabinet with fluted-glass doors | Real photo; strong colour; EXIF 2024-03-01 13:00 | B | **USED**: studio thumb, "Light" preview | Medium | Material: agate, onyx or a printed panel? |
| GM18 | `aayaadi-google-18-photo.jpg` | 1536×2048 | P | Same bedroom as GM06 from another angle; mauve channel-upholstered window seat | Real photo; EXIF 2024-03-01 12:25 | B | Reserve | Medium | n/a |
| GM19 | `aayaadi-google-19-photo.jpg` | 1536×2048 | P | Same bedroom as GM04, closer: scalloped headboard, round bedside table, backlit slats | Real photo, good; EXIF 2024-09-27 18:38 | C | **USED**: gallery card 02 | Medium | Permission; is GM32 the design render of this room? |
| GM20 | `aayaadi-google-20-photo.jpg` | 1536×2048 | P | Wide dining view: GM05's table and chairs with GM08's display unit and the kitchen beyond | Real photo; AC visible; EXIF 2025-05-14 15:49 | A | Reserve | High | n/a |
| GM21 | `aayaadi-google-21-photo.jpg` | 2000×1500 | L | Bedroom: grooved wardrobes with brass handles, abstract art, chevron rug, tray ceiling | **3D render** | R | Not used (render) | Low | Built? |
| GM22 | `aayaadi-google-22-photo.jpg` | 1536×2048 | P | Wide living room: veined panel between fluted panels, sectional and loveseat with grey cushions, two tub armchairs, round tables with gold lotus, tripod lamp; AC at upper right | Real photo, sharp; EXIF 2025-05-14 15:50. Per the IG README, the same shot is slide 1 of Aayaadi's watermarked IG post DLMd_y5SBUj | A | **USED**: hero | High | Client consent for publishing this home? |
| GM23 | `aayaadi-google-23-photo.jpg` | 2048×1536 | L | Framed red paper-rose relief artwork | Photo of an artwork; EXIF 2023-07-14 20:19 | D | Not used | Low | Whose artwork? |
| GM24 | `aayaadi-google-24-photo.jpg` | 1536×2048 | P | Framed pencil portrait, mechanical/ribbon style | Photo of an artwork; glare; EXIF 2023-07-14 20:19 | D | Not used | Low | Whose artwork? |
| GM25 | `aayaadi-google-25-photo.jpg` | 1536×2048 | P | Nook: grey grooved wall, twisted wall light, timber shelves with trophies and books, curtains | Real photo; **a child's photo and trophies are visible** (privacy; could be misread as awards); EXIF 2024-09-27 17:40 | C | Not used | Medium | n/a |
| GM26 | `aayaadi-google-26-photo.jpg` | 747×671 | L | Mood board: canal photo with a boat plus six colour swatches | Graphic; the canal photo is probably third-party | none | Not used | Low | n/a |
| GM27 | `aayaadi-google-27-photo.jpg` | 1536×2048 | P | Window seat with timber base and grey cushion, sheer and linen curtains, wall light, shelves with trophies | Real photo; trophies visible; EXIF 2024-09-27 17:40 | C | Not used (trophies) | Medium | n/a |
| GM28 | `aayaadi-google-28-photo.jpg` | 2048×1447 | L | Before/after façade: older house with a parked car beside a render of a modern façade | **PNG data in a .jpg file**, 3.7 MB. Composite; **carries the older "aayaadi" wordmark logo** bottom right | none | Not used (exterior composite; vehicle in frame) | Low | Is this an Aayaadi architecture project? |
| GM29 | `aayaadi-google-29-photo.jpg` | 643×642 | S | Bedroom: slatted timber ceiling and headboard wall, black tufted headboard, glass wardrobe | **PNG data in a .jpg file.** Low-res, over-sharpened **render** | R | Not used | Low | n/a |
| GM30 | `aayaadi-google-30-photo.jpg` | 1053×1056 | S | Bedroom: grey headboard, gold damask niche, table lamps, timber floor | **PNG data in a .jpg file.** **Render** | R | Not used | Low | n/a |
| GM31 | `aayaadi-google-31-photo.jpg` | 1536×2048 | P | Dining: geometric-patterned table and tub chairs before a layered moulded wall with warm cove light; brass wall light | Real photo; EXIF 2024-03-01 12:53 | B | **USED**: gallery card 01 | Medium | Permission |
| GM32 | `aayaadi-google-32-photo.jpg` | 2000×1500 | L | Bedroom: scalloped cream headboard, backlit fluted strip, grey wall, fluted-glass wardrobe | **3D render.** Strong visual similarity to the real room in GM04/GM19 | R | Not used. If confirmed, a possible future render-to-reality pairing | Low | Is this the design visual for the room in GM04/19? |
| GM33 | `aayaadi-google-33-photo.jpg` | 1536×2048 | P | Living-dining: grey sofas, square white stone-look table, cove-lit moulded wall, dining set, jaali prayer unit, open kitchen, cassette AC | Real photo; busy frame; EXIF 2024-03-01 12:59 | B | Reserve | Medium | n/a |

### Gurugram (GG, Facebook-sourced): 9 files

| # | File | Px | Orient. | Likely subject (visible only) | Quality / watermark / format notes | Grp | Proposed use | Conf. | Verify with Aayaadi |
|---|---|---|---|---|---|---|---|---|---|
| GG01 | `aayaadi-01-1272601991537837.jpg` | 960×958 | S | Gold "AD"-style monogram on black | Logo graphic, 27 KB | none | Not used. Evidence that a monogram logo exists | n/a | Is this the current official logo? Can they supply a vector file and usage rules? |
| GG02 | `aayaadi-02-1037172415080797.jpg` | 1920×1080 | L | Exterior: brick cottages with tiled roofs around a pool under a glass-and-steel pergola; lawn, palms | **Render** | none | Not used | Low | Architecture work? Built? |
| GG03 | `aayaadi-03-2619819051611453.jpg` | 1000×1000 | S | Bedroom: brick-look wall with framed prints, timber floor, tufted headboard | **Render**, vintage filter | none | Not used | Low | n/a |
| GG04 | `aayaadi-04-2617593345167357.jpg` | 801×799 | S | Living room: sofa, armchairs, mirrored slatted wall, framed black-and-white photos | Sepia **render** | none | Not used | Low | n/a |
| GG05 | `aayaadi-05-2480138625579497.jpg` | 1440×961 | L | Child's room: yellow and teal wardrobe, study desk, white chairs, bed | Real photo (older), fair; small trophies on a shelf | none | Not used | Medium | n/a |
| GG06 | `aayaadi-06-2431778493748844.jpg` | 1440×1098 | L | Bedroom: black-and-white high-gloss headboard wall, mirror strips, floral bedding | Real photo (older), fair | none | Not used | Medium | n/a |
| GG07 | `aayaadi-07-2523307297929296.jpg` | 1440×1152 | L | Promo: "Time to transform your home! Let us design your quarantine spaces" plus two small interior photos and the older logo | Marketing graphic with text | none | Not used | n/a | n/a |
| GG08 | `aayaadi-08-2436325619960798.jpg` | 1440×1800 | P | Dining: backlit amber onyx-look wall, Sputnik-style chandelier, tub chairs, bench; overlaid caption "onyx and the balanced lighting serves as the focal facet of the interior setting" | Text overlay and white border | E | Not used (text) | Medium | Is there a clean original? |
| GG09 | `aayaadi-09-2936974306562591.jpg` | 1080×1080 | S | Living room: herringbone metal-inlay wall, recliner, pink chairs, geometric rug, wall clock | **Render** with repeated "aayaadi" watermarks | none | Not used | Low | n/a |

### Instagram (IG): 21 files

| # | File | Px | Orient. | Likely subject (visible only) | Quality / watermark / format notes | Grp | Proposed use | Conf. | Verify with Aayaadi |
|---|---|---|---|---|---|---|---|---|---|
| IG01 | `aayaadi-ig-01-must-DctJ32qkvPw-slide1.jpg` | 720×900 | P | Line drawing of a parallel kitchen with an "OFF" toggle graphic | Sketch frame of a before/after post; UI overlay; small AD watermark | none | Not used | n/a | Could real sketches support a future, verified process section? |
| IG02 | `aayaadi-ig-02-reel-DZm2X9czMOY-poster.jpg` | 640×1136 | P | Reel frame: a man speaking in a bedroom; caption "DID YOU KNOW THIS?" | Identifiable person plus text; AD watermark | none | Not used | n/a | Who is this? Do not use without consent. |
| IG03 | `aayaadi-ig-03-reel-DYwz0BRyu2o-poster.jpg` | 720×1280 | P | Reel frame: the same man in a living room beside a TV unit | Person; AD watermark | none | Not used | n/a | As above |
| IG04 | `aayaadi-ig-04-COfZLuRJr17.jpg` | 1080×1080 | S | Bedroom: blue LED cove, brick wall, gaming chair | **Render**; heavy "aayaadi" watermarks | none | Not used | Low | n/a |
| IG05 | `aayaadi-ig-05-CO91bKhJX1A.jpg` | 1080×1080 | S | Bedroom: blue LED cove, gaming desk, timber doors with brass inlay | **Render**; heavy watermarks | none | Not used | Low | n/a |
| IG06 | `aayaadi-ig-06-CO5b1v-pqd7.jpg` | 1080×1080 | S | Bedroom: round backlit mirror, timber door with brass inlay | **Render**; heavy watermarks | none | Not used | Low | n/a |
| IG07 | `aayaadi-ig-07-COado-_pWk1.jpg` | 1080×1080 | S | Bedroom: green channel-tufted bed, chevron timber panel, face art prints | **Render**; heavy watermarks | none | Not used | Low | n/a |
| IG08 | `aayaadi-ig-08-COkZuzWJlPs.jpg` | 1080×1080 | S | Bedroom: white fluted wall, copper mirror strip, diamond-cut wardrobe | **Render**; heavy watermarks | none | Not used | Low | n/a |
| IG09 | `aayaadi-ig-09-reel-CYonfgLAxss-poster.jpg` | 720×1280 | P | Same dining room as GG08, without text | Low-res reel poster; strong colour cast | E | Not used | Medium | Clean high-res original? |
| IG10 | `aayaadi-ig-10-reel-CTt4p-IAYWV-poster.jpg` | 720×1280 | P | Prayer wall: backlit panel with a seated Jain Tirthankara figure, tree motif and devotional text; green wall, sconces, plants | Religious; low-res | none | Not used | Medium | n/a |
| IG11 | `aayaadi-ig-11-reel-CVLDYPQAtEw-poster.jpg` | 720×1280 | P | Bedroom: leather headboard, floral bedding, textured wall panels, painting, pendant | Low-res poster | none | Not used | Medium | n/a |
| IG12 | `aayaadi-ig-12-reel-DcgZRRAzvOj-poster.jpg` | 1080×1920 | P | Coffered and vaulted white ceiling with mouldings; caption "One project. 9 Ceilings. Which one is your favorite?" | Text overlay; AD watermark | none | Not used | Medium | Don't reuse the "9 ceilings" claim unless the studio confirms it |
| IG13 | `aayaadi-ig-13-reel-DdyoY_JTVf4-poster.jpg` | 1080×1920 | P | Curved column detail, blurred window; caption "The beauty of Curve" | Blurry; text; watermark | none | Not used | Low | n/a |
| IG14 | `aayaadi-ig-14-reel-DbQZhH_S5c9-poster.jpg` | 1080×1920 | P | Bathroom: round backlit mirror, vessel basin on a vanity, stone-look wall tiles, fluted-glass partition; caption text | Text overlay; watermark | none | Not used | Medium | Is a clean still available? |
| IG15 | `aayaadi-ig-15-reel-DbqRsCETQwM-poster.jpg` | 720×1280 | P | Staircase (black granite treads, glass and brass rail, green fluted panel) with a man posing | Person | F | Not used | Medium | n/a |
| IG16 | `aayaadi-ig-16-Db3Ijsikiqf.jpg` | 1080×1339 | P | The same staircase with no person: glass balustrade, brass handrail and standoffs, green fluted panel with a linear light | Good quality; **faint AD watermark low on the glass** | F | Not used in v1 (watermark). Strong "Form" candidate if a clean original is supplied | High | Clean original? Permission? |
| IG17 | `aayaadi-ig-17-reel-DY7HxNVozdV-poster.jpg` | 640×1136 | P | Bedroom: grey wingback headboard, textured wall panels, linear wall light, grey storage bench | Low-res poster | none | Not used | Medium | n/a |
| IG18 | `aayaadi-ig-18-mandir-DanSajnklgi-slide1.jpg` | 1080×1339 | P | Lounge and prayer room: curved cream sofas facing a backlit shrine with a Tirthankara idol, moulded walls, sconces | Religious; letterboxed white bands with the AD logo. Borderline hash match with GM31; visually a different scene | none | Not used | High | n/a |
| IG19b | `aayaadi-ig-19b-onyx-DLMd_y5SBUj-slide2.jpg` | 1080×1350 | P | The GM01/GM22 living room, front-on | AD watermark on the table; lower resolution than GM22 | A | Not used (GM22 is cleaner) | High | n/a |
| IG19c | `aayaadi-ig-19c-onyx-DLMd_y5SBUj-slide3.jpg` | 1080×1350 | P | The same living room, angle showing two tub armchairs and the loveseat | AD watermark on a chair | A | Not used | High | n/a |
| IG20 | `aayaadi-ig-20-reel-DeRjYzGAA7S-poster.jpg` | 1080×1920 | P | Reel frame: caption "LUXURY DINNING AREA TIP 101" (sic) over a man in a dining room | Person; text with a typo | none | Not used | n/a | n/a |

## Brand evidence (not used on the page)

The archives show two Aayaadi marks, neither supplied as an approved file:

- an older lowercase **"aayaadi" wordmark** with a green "y" (GM28, GG07, and the GG09/IG04–08 watermarks);
- a gold **"AD" monogram** with "Aayaadi Designs" (GG01, and the IG01–03, 12–14, 16, 18, 19b/c watermarks), which looks like the current one.

The page therefore uses a plain typographic "AAYAADI" placeholder, labelled as such in the footer.

## Recommended asset sequence (current page)

1. **Hero:** GM22, the living room wide shot from Group A, the strongest attribution.
2. **Studio thumbnails:** GM02 (lotus detail), GM07 (fluted joinery), GM17 (backlit stone).
3. **Selected work:** GM31 (dining, B), GM19 (bedroom, C), GM05 (dining, A), GM16 (study, C).
4. **Form / Material / Light / Detail:** GM07, GM01, GM17, GM10.
5. **Details carousel:** GM02, GM06, GM13.
6. **Closing interlude:** GM15.

**Spares in priority order:** GM04, GM18, GM20, GM33. Then IG16 (staircase), if a clean unwatermarked original is supplied.

## Open questions for Aayaadi

1. Which of these photographs show Aayaadi's own completed projects? Did Aayaadi upload them to Google, or did visitors?
2. Do they have permission from the homeowners to show Groups A, B and C publicly? Are there any rooms they would rather not show?
3. Project names, locations, dates and scope for each group, if they want them shown.
4. Are GM03, 21, 29, 30 and 32 renders? Were any of them built (for example, GM32 and the room in GM04/19)?
5. Can they supply original, unwatermarked, full-resolution files (especially IG16 and a clean GG08/IG09)?
6. The official logo files, and which mark is current.
7. Contact details to show (phone, address, Instagram), plus whether there is an email or a WhatsApp number.
