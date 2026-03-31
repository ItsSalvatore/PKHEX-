# Page overrides: Load Save (`/load`)

> Overrides `design-system/pkhex-web/MASTER.md` for this route only.

## Layout

- **Primary action:** Large **drop zone** + hidden file input; entire zone is one logical control (keyboard: focusable trigger or visible button fallback).
- **Width:** Prefer `max-w-2xl` centered for the upload card — keeps focus on one task.

## Content

- **Copy:** State clearly that parsing is **local** / **optional local PKHeX.Core bridge** in dev; avoid implying cloud upload.
- **States:** Show **loading** (`isLoading`) on the drop zone; disable duplicate picks while loading.

## Components

- **Drop zone:** `cursor-pointer`, clear drag state (`border-indigo-500`, `scale-[1.02]` only if it does not clip; prefer border/bg change per MASTER).
- **Privacy / info:** Use **amber** informational panel pattern already in app; keep text **surface-400** body, **amber-300** title for hierarchy.

## A11y

- File input must stay **focusable** or provide an explicit **“Browse”** control with `aria-describedby` linking to format hints.
- After failed load, expose error via store **and** consider `role="alert"` or `aria-live="polite"` for screen readers.
