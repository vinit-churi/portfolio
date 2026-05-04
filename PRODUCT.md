# Impeccable Design Guidelines
# Portfolio — Vinit Churi (vinit.dev)

## Design Context

### Users
Three overlapping audiences landing on this portfolio:
- **Startup CTOs** evaluating whether Vinit can own infra at scale — they are technical, time-poor, and skeptical of hype
- **Hiring managers at infra-focused companies** — they read dozens of portfolios; they scan for signal, not noise
- **Open source collaborators** — engineers who want to understand how Vinit thinks before engaging

All three arrive with high pattern-matching ability. They will immediately recognize generic templates and discount them. They respond to density, precision, and specificity over visual flash.

**Job to be done:** Within 30 seconds, convince a skeptical technical person that Vinit is the real deal — not a self-promoter, not a generalist, not a template-filler.

**Emotional goal: Curiosity.** The interface should make visitors want to read one more line, scroll one more section, click one more link. Not intimidation. Not trust-through-polish. Curiosity — the sense that there is more depth here than a single visit can exhaust.

### Brand Personality
**Three words: Precise. Alive. Understated.**

- **Precise** — every word, every spacing decision, every component earns its place. Nothing decorative.
- **Alive** — despite the monochrome restraint, the system feels active: pulse animations, live status, terminal blinking cursors. Not a static brochure.
- **Understated** — confidence without announcement. The work speaks. The UI doesn't shout.

Voice: direct, technical, first-person sparse. No marketing language. No "passionate about" or "results-driven." Specificity over adjectives.

### Aesthetic Direction
**Visual tone:** Dark-terminal meets precision instrument. Think oscilloscope readout, not agency portfolio.

**Theme:** Dark-only. Background `#131313`. Monochromatic MD3 palette — whites, grays, blacks. Zero accent color in the palette; white IS the accent.

**Typography:** Manrope (headlines — geometric, bold, tight tracking) + Inter (body — neutral, legible) + Geist Mono (labels, data, code — signals technical precision).

**Shape language:** Near-zero border radius (0.125rem). Sharp corners = precision tooling. No rounded buttons, no pill badges, no card softness.

**Motion:** Micro only. Pulse animations on live indicators, hover scale on images, color transitions on links. Never page-level animation, never entrance animations that delay content.

**Imagery:** Grayscale, opacity 60–80%, hover-zoom. Images serve as texture, not focal points.

**Anti-references:**
- NOT generic Figma/Framer template portfolios (Bento grids, gradient blobs, scrolljacking)
- NOT corporate (no blue, no sans-serif cleanliness, no stock photography of handshakes)
- NOT Dribbble-style (no loud color, no playful illustration, no neumorphism)
- NOT "developer blog" (no sidebar, no tag clouds, no Comic Sans jokes)

**Reference feel:** Linear.app's precision × a Bloomberg Terminal's data density × the restraint of a well-written technical paper.

### Design Principles

1. **Specificity over decoration** — Replace any generic placeholder (dates, stats, descriptions) with exact, real data. "412 PRs" is design. "Many PRs" is not. Vague text is a design failure.

2. **Restraint creates curiosity** — Show less than you have. Truncate, collapse, and paginate. The user should always feel there is more to discover. Never dump everything at once.

3. **The monochrome rule** — In a greyscale system, every value choice is amplified. `text-white` vs `text-on-surface-variant` is the entire visual hierarchy. Guard these distinctions. Never introduce color without explicit intent.

4. **Terminal as metaphor** — Monospace labels, uppercase tracking, status indicators, blinking cursors, and data readouts are not decoration — they are the brand vocabulary. Use them consistently for metadata, timestamps, and system-state communication.

5. **Earn every pixel** — Before adding any element, ask: does this increase curiosity or reduce noise? If neither, cut it. Dense and meaningful beats sparse and decorative. Empty and meaningful beats dense and noisy.
