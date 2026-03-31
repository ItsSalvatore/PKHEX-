import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GAME_NAMES } from '@pkhex/core';
import { useAppStore } from '@/store/app-store';

const ROUTE_LABELS: Record<string, string> = {
  '/': 'Home',
  '/load': 'Load save',
  '/party': 'Party',
  '/boxes': 'PC Boxes',
  '/trainer': 'Trainer',
  '/inventory': 'Inventory',
  '/mystery-gifts': 'Mystery Gifts',
  '/pokedex': 'Pokédex',
  '/legality': 'Legality',
  '/cheat-codes': 'Cheat codes',
  '/settings': 'Settings',
};

/**
 * Keeps document title, description, theme-color, and html data-* attributes in sync with
 * the loaded save (game version, generation, trainer) and current route so the PWA shell
 * and OS task switcher reflect context.
 */
export function usePwaGameContext() {
  const saveFile = useAppStore((s) => s.saveFile);
  const theme = useAppStore((s) => s.theme);
  const location = useLocation();

  useEffect(() => {
    const page =
      ROUTE_LABELS[location.pathname]
      ?? (location.pathname.replace(/^\//, '') || 'Home');

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    const descMeta = document.querySelector('meta[name="description"]');
    const appleTitle = document.querySelector('meta[name="apple-mobile-web-app-title"]');

    if (!saveFile) {
      document.title = `PKHeX · ${page}`;
      document.documentElement.removeAttribute('data-game-version');
      document.documentElement.removeAttribute('data-generation');
      document.documentElement.removeAttribute('data-trainer');
      document.documentElement.removeAttribute('data-save-file');
      if (descMeta) {
        descMeta.setAttribute(
          'content',
          'PKHeX — Pokémon save editor. Load a save to see game version and data context.',
        );
      }
      if (themeMeta) {
        themeMeta.setAttribute('content', theme === 'light' ? '#f1f5f9' : '#0f0f23');
      }
      return;
    }

    const game = GAME_NAMES[saveFile.gameVersion] ?? `Game ${saveFile.gameVersion}`;
    const gen = saveFile.generation;
    const trainer = saveFile.trainer.name || 'Trainer';

    document.title = `${game} · ${trainer} · ${page} — PKHeX`;
    document.documentElement.setAttribute('data-game-version', String(saveFile.gameVersion));
    document.documentElement.setAttribute('data-generation', String(gen));
    document.documentElement.setAttribute('data-trainer', trainer);
    document.documentElement.setAttribute('data-save-file', saveFile.fileName);

    if (descMeta) {
      descMeta.setAttribute(
        'content',
        `Editing ${game} (generation ${gen}) — ${trainer}. File: ${saveFile.fileName}. Page: ${page}.`,
      );
    }

    if (appleTitle) {
      appleTitle.setAttribute('content', `${game} · PKHeX`);
    }

    if (themeMeta) {
      themeMeta.setAttribute('content', theme === 'light' ? '#f1f5f9' : '#0f0f23');
    }
  }, [saveFile, location.pathname, theme]);
}
