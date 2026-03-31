# Page overrides: Party

> Overrides `design-system/pkhex-web/MASTER.md` for the party view.

## Layout

- **Structure:** **Six slots** in a **row** on wide screens; **2×3** or **1×6** stack on narrow — never hide slots without indicating “empty party”.
- **Density:** **Compact** summary per Pokémon (sprite, name, level); defer deep stats to the editor drawer/modal.

## Visual hierarchy

- **Lead slot** (index 0): Slight emphasis OK (e.g. stronger border); keep **equal hit area** for all six slots.
- **Empty party member:** Same treatment as empty box slot — obvious placeholder.

## Interaction

- Selecting a party member should mirror box selection patterns (**ring**, **cursor-pointer**).
- Updates after edit must sync **party array** in store without losing selection where possible.

## A11y

- Announce slot index in labels where helpful (e.g. “Party slot 3, Pikachu, level 20”) for screen reader context.
