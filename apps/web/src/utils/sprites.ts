const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

export function getPokemonSprite(species: number, shiny = false, form = 0): string {
  if (species <= 0) return '';
  const base = shiny ? `${SPRITE_BASE}/shiny` : SPRITE_BASE;
  if (form > 0) {
    return `${base}/${species}-${form}.png`;
  }
  return `${base}/${species}.png`;
}

export function getPokemonArtwork(species: number): string {
  if (species <= 0) return '';
  return `${SPRITE_BASE}/other/official-artwork/${species}.png`;
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
  const urls = species.filter(s => s > 0).map(s => getPokemonSprite(s));
  await Promise.allSettled(urls.map(preloadSprite));
}
