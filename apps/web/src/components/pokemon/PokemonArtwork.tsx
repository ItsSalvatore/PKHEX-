import { useMemo } from 'react';
import { getPokemonArtworkFallbackUrls } from '@/utils/sprites';
import { FallbackImg } from './FallbackImg';

interface PokemonArtworkProps {
  species: number;
  shiny?: boolean;
  alt: string;
  className?: string;
}

export function PokemonArtwork({ species, shiny = false, alt, className }: PokemonArtworkProps) {
  const urls = useMemo(() => getPokemonArtworkFallbackUrls(species, shiny), [species, shiny]);
  return <FallbackImg urls={urls} alt={alt} className={className} loading="eager" />;
}
