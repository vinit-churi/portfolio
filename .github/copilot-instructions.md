# Copilot Instructions — Portfolio (vinit.dev)

This is Vinit Churi's personal portfolio. Next.js 16 App Router, Tailwind v4, Turso (libsql) + Drizzle ORM, TypeScript strict.

## Stack Notes
- Package manager: **Bun** (not npm/yarn)
- DB: Turso via `@libsql/client` + `drizzle-orm/libsql`
- Schema at `lib/schema.ts`, DB client at `lib/db.ts`
- All content is DB-driven; mutations call `revalidatePath("/")` for ISR
- Admin auth: httpOnly cookie `admin_token` checked against `ADMIN_SECRET` env var
- Read Next.js docs at `node_modules/next/dist/docs/` before using any Next.js API — this version may have breaking changes from training data

## Design Context

### Users
Startup CTOs, hiring managers at infra companies, open source collaborators. All technical, time-poor, skeptical of hype. They scan for signal. Generic templates get discounted immediately.

**Emotional goal: Curiosity.** Make them want to read one more line, scroll one more section.

### Brand Personality
**Precise. Alive. Understated.**
Voice: direct, technical, sparse. No marketing language. Specificity over adjectives.

### Aesthetic Direction
Dark-terminal meets precision instrument. Linear.app precision × Bloomberg Terminal data density × restraint of a technical paper.

- Dark-only. Background `#131313`. Monochromatic MD3 — whites/grays/blacks. White IS the accent.
- Manrope (headlines) + Inter (body) + Geist Mono (labels/data/code)
- Near-zero border radius (0.125rem). Sharp corners only.
- Micro motion only: pulse on live indicators, hover scale on images, color transitions. No entrance animations.
- Grayscale images at 60–80% opacity. Texture, not focal points.

**NOT:** Bento grids, gradient blobs, scrolljacking, corporate blue, Dribbble color, rounded pill badges.

### Design Principles

1. **Specificity over decoration** — Real data only. "412 PRs" is design. "Many PRs" is not. Vague text is a design failure.
2. **Restraint creates curiosity** — Show less than you have. Truncate, collapse, paginate. User should always feel there's more depth.
3. **Monochrome rule** — Every gray value choice is amplified. `text-white` vs `text-on-surface-variant` is the full hierarchy. Never introduce color without explicit intent.
4. **Terminal as metaphor** — Monospace labels, uppercase tracking, status indicators, blinking cursors are the brand vocabulary. Use for metadata, timestamps, system-state.
5. **Earn every pixel** — Does this element increase curiosity or reduce noise? If neither, cut it.
