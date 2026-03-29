const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

/** Primary front sprite URL (may 404 for missing forms). */
export function getPokemonSprite(species: number, shiny = false, form = 0): string {
  if (species <= 0) return '';
  const base = shiny ? `${SPRITE_BASE}/shiny` : SPRITE_BASE;
  if (form > 0) {
    return `${base}/${species}-${form}.png`;
  }
  return `${base}/${species}.png`;
}

/**
 * Ordered fallbacks: form-specific front → default front → official artwork → HOME render.
 * Matches PokeAPI sprite repo layout (same source PKHeX-adjacent tools often mirror).
 */
export function getPokemonSpriteFallbackUrls(species: number, shiny = false, form = 0): string[] {
  if (species <= 0) return [];
  const variant = shiny ? `${SPRITE_BASE}/shiny` : SPRITE_BASE;
  const urls: string[] = [];
  if (form > 0) urls.push(`${variant}/${species}-${form}.png`);
  urls.push(`${variant}/${species}.png`);
  const artRoot = shiny
    ? `${SPRITE_BASE}/other/official-artwork/shiny`
    : `${SPRITE_BASE}/other/official-artwork`;
  urls.push(`${artRoot}/${species}.png`);
  const homeRoot = shiny ? `${SPRITE_BASE}/other/home/shiny` : `${SPRITE_BASE}/other/home`;
  if (form > 0) urls.push(`${homeRoot}/${species}-${form}.png`);
  urls.push(`${homeRoot}/${species}.png`);
  return urls;
}

export function getPokemonArtwork(species: number, shiny = false): string {
  if (species <= 0) return '';
  return shiny
    ? `${SPRITE_BASE}/other/official-artwork/shiny/${species}.png`
    : `${SPRITE_BASE}/other/official-artwork/${species}.png`;
}

export function getPokemonArtworkFallbackUrls(species: number, shiny = false): string[] {
  if (species <= 0) return [];
  const art = shiny
    ? `${SPRITE_BASE}/other/official-artwork/shiny/${species}.png`
    : `${SPRITE_BASE}/other/official-artwork/${species}.png`;
  const home = shiny
    ? `${SPRITE_BASE}/other/home/shiny/${species}.png`
    : `${SPRITE_BASE}/other/home/${species}.png`;
  const front = shiny ? `${SPRITE_BASE}/shiny/${species}.png` : `${SPRITE_BASE}/${species}.png`;
  return [art, home, front];
}

export function getItemSprite(itemId: number): string {
  if (itemId <= 0) return '';
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${itemId}.png`;
}

const spriteCache = new Map<string, string>();

export async function preloadSprite(url: string): Promise<void> {
  if (spriteCache.has(url)) return;
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => { spriteCache.set(url, url); resolve(); };
    img.onerror = () => resolve();
    img.src = url;
  });
}

export async function preloadBoxSprites(species: number[]): Promise<void> {
  const urls = species.filter(s => s > 0).map(s => getPokemonSpriteFallbackUrls(s, false, 0)[0]).filter(Boolean);
  await Promise.allSettled(urls.map(preloadSprite));
}
