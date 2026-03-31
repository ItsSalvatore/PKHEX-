# Page overrides: Boxes

> Overrides `design-system/pkhex-web/MASTER.md` for box storage views.

## Layout

- **Grid:** **Uniform slot grid** (not masonry). Same slot size per game; consistent `gap` (e.g. `gap-2` / `gap-3`).
- **Density:** High — prioritize **sprite + species identity**; avoid oversized cards that reduce boxes per viewport.

## Visual states

- **Empty slot:** Clear “empty” silhouette or dashed border; **do not** look like a broken image.
- **Filled slot:** Selected state uses **ring** or **border** (indigo), not only color (accessibility).
- **Hover:** Subtle border/brightness only — **no vertical translate** on slots (grid jump).

## Interaction

- **Click:** Select slot → editor / detail. **Double-click** behavior only if documented (optional).
- **Drag-and-drop** (if present): Provide **keyboard** alternative or clear instructions.

## Performance

- Virtualize or lazy-render **off-screen** boxes if the grid grows large.
- Sprite URLs: prefer **fixed dimensions** placeholders to avoid CLS.
