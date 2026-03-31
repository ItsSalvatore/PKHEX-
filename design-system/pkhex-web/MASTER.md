# Design System Master — PKHeX Web

> **Hierarchy:** For a given screen, read `design-system/pkhex-web/pages/<page>.md` first.  
> If it exists, its rules **override** this file; otherwise follow **MASTER** only.

---

**Project:** PKHeX Web (Pokémon save editor PWA)  
**Stack:** React, Vite, Tailwind CSS, Lucide icons  
**Last revised:** 2026-03-31

---

## Product context

- **Type:** Utility / dashboard — data-dense, long sessions, precision tasks (boxes, party, legality).
- **Default chrome:** **Dark-first** (OLED-friendly). Light mode is supported via `class` strategy; ensure contrast in both.
- **Motion:** Subtle (150–300ms). Respect `prefers-reduced-motion`.

---

## Foundation (align with Tailwind theme)

Use existing theme tokens from `apps/web/tailwind.config.js` instead of inventing parallel palettes.

| Role | Tailwind / usage |
|------|------------------|
| App background | `bg-surface-950` / `bg-[#0f0f23]` (keep deep, low glare) |
| Surfaces / cards | `surface-900`, `surface-800`, `glass` utility where used |
| Primary actions / focus | `indigo-500`–`indigo-400` rings and accents (current app pattern) |
| Secondary accent | `cyan-400` for highlights; `accent.*` for type charts / status chips |
| Body text | `text-white` / `text-surface-200`; muted `text-surface-400` |
| Success / legal OK | `accent-green` sparingly |
| Danger / illegal | `accent-red` sparingly |

**Typography**

- **UI body:** `font-sans` → **Inter** (already configured).
- **Data / IDs / hex / codes:** `font-mono` → **JetBrains Mono** / **Fira Code** fallback.

Optional display headers may use **Fira Code** for a “tooling” feel; do not replace Inter everywhere without a migration plan.

---

## Global interaction rules

- **Icons:** **Lucide** only at consistent sizes (e.g. `w-5 h-5`). No emoji as icons.
- **Click targets:** `cursor-pointer` on interactive elements; keyboard **focus-visible** ring (e.g. `ring-2 ring-indigo-500/60`).
- **Hover:** Prefer **border, bg, shadow, ring** changes — avoid **layout shift** (no `translateY` on cards in dense grids).
- **Transitions:** `transition-colors duration-200` (or `duration-150` for small controls).

---

## Layout

- **Max content width:** `max-w-6xl` or `max-w-7xl` for primary flows; full width for box grid if needed.
- **Spacing:** Consistent `space-y-*` / `gap-*`; account for **fixed sidebar** so content is not obscured.
- **Responsive:** Validate **375 / 768 / 1024 / 1440**; no horizontal scroll on mobile for core flows.

---

## Components (dark reference)

Patterns are expressed in Tailwind terms; implement in JSX, not copy-paste as raw CSS unless needed.

- **Primary button:** Solid indigo, `rounded-xl`, `font-medium`, hover slightly lighter indigo, `active:scale-[0.98]` optional (minimal shift).
- **Secondary / ghost:** `border-white/10` or `border-surface-600`, `bg-white/[0.02]`, hover `bg-white/[0.05]`.
- **Inputs:** `bg-surface-900`, `border-white/10`, focus ring indigo; **always pair `<label>` + `id` / `htmlFor`**.
- **Cards / glass:** Use existing `glass` + border visibility in both themes (`border-white/[0.08]` dark).

---

## Anti-patterns

- ❌ Emoji as icons  
- ❌ Muted body text below **~4.5:1** contrast on its background  
- ❌ Placeholder-only labels  
- ❌ `div` with `onClick` instead of `button` for actions  
- ❌ Heavy parallax / auto-playing motion on data screens  
- ❌ Marketing “horizontal scroll journey” patterns for core editor views  

---

## Pre-delivery checklist

- [ ] Lucide icons, consistent sizing  
- [ ] `cursor-pointer` + visible focus for interactive elements  
- [ ] Transitions ~150–300ms, no layout-breaking hover  
- [ ] Light **and** dark checked if the page supports both  
- [ ] `prefers-reduced-motion` honored for decorative motion  
- [ ] No content hidden under fixed nav / sidebar  
- [ ] No horizontal scroll on mobile for main layouts  
- [ ] Forms: labels, submit via `<form onSubmit>`, errors announced (`aria-live` where appropriate)  
