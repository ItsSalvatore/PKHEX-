import { useMemo } from 'react';
import { getPokemonSpriteFallbackUrls } from '@/utils/sprites';
import { FallbackImg } from './FallbackImg';

interface PokemonSpriteProps {
  species: number;
  shiny?: boolean;
  form?: number;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function PokemonSprite({ species, shiny = false, form = 0, alt, className, loading }: PokemonSpriteProps) {
  const urls = useMemo(
    () => getPokemonSpriteFallbackUrls(species, shiny, form),
    [species, shiny, form],
  );
  return <FallbackImg urls={urls} alt={alt} className={className} loading={loading} />;
}
