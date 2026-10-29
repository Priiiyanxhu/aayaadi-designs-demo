# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary Audience (Pitch Stage)**: The founders and leadership team of **Aayaadi Designs** (Shreshth & Aashima), an established interior design firm based in Gurugram, Haryana.
- **Secondary Audience (End Client Stage)**: Discerning residential homeowners in Gurugram and Delhi NCR seeking bespoke, architectural, and turnkey interior design services for luxury apartments, villas, and modern living spaces.

## Product Purpose

- Serve as a high-fidelity, interactive pitch demo demonstrating how an elevated, luxury-editorial website can communicate Aayaadi's craft and design sensibility.
- Win the mandate to build the official website for Aayaadi Designs by proving out-of-distribution visual polish, restrained motion, responsive reliability, and architectural dignity.
- Success means the studio founders recognize their own design standards reflected in the digital experience, approve the aesthetic direction, and engage to develop and deploy their official presence.

## Positioning

- **Editorial Luxury vs. Generic Agency Templates**: Rather than a noisy marketing brochure with ratings widgets, animated counters, or generic stock templates, the experience is treated like an architectural monograph or high-end design publication.
- **Authentic Materiality**: The interface recedes to let real photographic evidence—fluted millwork, veined stone, warm coves, and custom metalwork—drive the narrative.

## Operating Context

- Pitch presentation delivered privately (direct link / local preview) to the studio principals.
- Evaluated on high-resolution desktop screens (MacBook/iMac) as well as mobile devices (smartphones where clients browse social links).
- Operates under `noindex, nofollow` as a private, unofficial demonstration until formally commissioned.

## Capabilities and Constraints

- **Form**: Fast, lightweight, static one-page editorial website with smooth narrative scrolling.
- **Stack Constraints**: Plain HTML5, modern Vanilla CSS with CSS custom properties, Vanilla JavaScript. Zero build step. Pinned CDN enhancements for GSAP (3.12.5), ScrollTrigger, and Lenis smooth scroll, with resilient CSS/JS-off fallbacks.
- **Content Boundaries**: Uses draft concept copy clearly disclaimed as unofficial. No invented awards, fake metrics, or unverified client testimonials.

## Brand Commitments

- **Studio Name**: Aayaadi Designs.
- **Discipline**: Interior Design Studio.
- **Studio Location**: 19 Ground Floor, K-16, DLF Phase 2, Sector 25, Gurugram, Haryana 122002.
- **Phone**: +91 98737 47198.
- **Instagram**: @aayaadi_designs.
- **Visual Tone**: Restrained, elegant, warm minimalism, architectural rhythm, generous editorial whitespace, and dignified typography (Geist sans-serif).

## Evidence on Hand

- **Real Photography**: 63 curated source photographs from Aayaadi Designs' public Google listing (audited in `ASSET_MANIFEST.md`), highlighting real Gurugram residential projects, bespoke joinery, and lighting.
- **Derivative Assets**: 38 responsive WebP derivatives (`img/aayaadi/web/`) sized for retina and standard displays.
- **No Fabrications**: Project titles, square footage, and client identities are intentionally held neutral until confirmed with the studio.

## Product Principles

1. **Let the Work Lead**: The interface must be quiet, dignified, and editorial. Typography and spatial imagery remain the center of attention; UI chrome and motion recede.
2. **Never Lie**: Use only real photographs from the studio's portfolio. Mark all pitch copy as concept draft; never invent fake reviews, awards, or partner logos.
3. **Restrained, Deliberate Motion**: Movement must feel cinematic and architectural—aperture unmasking, slow parallax drift, and clean line reveals. Never hijack user scrolling or induce motion sickness.
4. **Resilient Under Any Condition**: The website must remain completely readable, well-spaced, and functional even if JavaScript is disabled, external CDNs fail, or the user requests reduced motion.

## Accessibility & Inclusion

- WCAG AA contrast compliance across all type tokens and button gradients (e.g. darkened gold button gradient for 4.6:1 text contrast).
- Full `prefers-reduced-motion: reduce` support where animations gracefully bypass to settled static states.
- Semantic landmarks, logical focus order with visible focus indicators, and screen-reader accessible line splitting via `aria-hidden` and `.sr-only` pairings.
