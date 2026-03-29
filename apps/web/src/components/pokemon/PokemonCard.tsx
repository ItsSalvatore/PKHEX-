import type { Pokemon } from '@pkhex/core';
import { getSpeciesName, getNatureName } from '@pkhex/core';
import { PokemonSprite } from './PokemonSprite';
import { clsx } from 'clsx';
import { Sparkles } from 'lucide-react';

interface PokemonCardProps {
  pokemon: Pokemon | null;
  selected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export function PokemonCard({ pokemon, selected, onClick, size = 'md', showDetails = false }: PokemonCardProps) {
  if (!pokemon || pokemon.species === 0) {
    return (
      <button
        onClick={onClick}
        className={clsx(
          'pokemon-slot',
          selected && 'selected',
          size === 'sm' && 'rounded-lg',
          size === 'lg' && 'rounded-2xl',
        )}
      >
        <div className="w-8 h-8 rounded-full bg-white/[0.03] border border-white/[0.04]" />
      </button>
    );
  }

  const name = pokemon.nickname || getSpeciesName(pokemon.species);

  return (
    <button
      onClick={onClick}
      className={clsx(
        'pokemon-slot occupied',
        selected && 'selected',
        size === 'sm' && 'rounded-lg',
        size === 'lg' && 'rounded-2xl p-3',
      )}
    >
      {pokemon.isShiny && (
        <div className="absolute top-1 right-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
        </div>
      )}
      <div className="flex flex-col items-center gap-1">
        <PokemonSprite
          species={pokemon.species}
          shiny={pokemon.isShiny}
          form={pokemon.form}
          alt={name}
          className={clsx(
            'pixelated drop-shadow-lg',
            size === 'sm' && 'w-10 h-10',
            size === 'md' && 'w-12 h-12',
            size === 'lg' && 'w-16 h-16',
          )}
        />
        {(showDetails || size === 'lg') && (
          <>
            <span className="text-[10px] font-medium text-white truncate max-w-full">{name}</span>
            <span className="text-[9px] text-surface-400">Lv.{pokemon.level}</span>
          </>
        )}
      </div>
    </button>
  );
}
