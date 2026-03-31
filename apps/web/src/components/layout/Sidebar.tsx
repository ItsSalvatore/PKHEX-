import { NavLink, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/app-store';
import { GAME_NAMES } from '@pkhex/core';
import { clsx } from 'clsx';
import {
  Home, Upload, Users, Box, Backpack, Gift, Shield, Gamepad2,
  Settings, ChevronLeft, ChevronRight, Zap, Sparkles, BookOpen, Menu, X,
} from 'lucide-react';

type NavItem = { path: string; icon: typeof Home; label: string; requiresSave?: boolean };

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: 'Start',
    items: [
      { path: '/', icon: Home, label: 'Dashboard' },
      { path: '/load', icon: Upload, label: 'Load save' },
    ],
  },
  {
    label: 'Save data',
    items: [
      { path: '/party', icon: Users, label: 'Party', requiresSave: true },
      { path: '/boxes', icon: Box, label: 'PC Boxes', requiresSave: true },
      { path: '/trainer', icon: Sparkles, label: 'Trainer', requiresSave: true },
      { path: '/inventory', icon: Backpack, label: 'Inventory', requiresSave: true },
    ],
  },
  {
    label: 'Tools',
    items: [
      { path: '/mystery-gifts', icon: Gift, label: 'Mystery Gifts' },
      { path: '/pokedex', icon: BookOpen, label: 'Pokédex' },
      { path: '/legality', icon: Shield, label: 'Legality', requiresSave: true },
      { path: '/cheat-codes', icon: Gamepad2, label: 'Cheat codes' },
    ],
  },
  {
    label: 'App',
    items: [{ path: '/settings', icon: Settings, label: 'Settings' }],
  },
];

export function Sidebar() {
  const { saveFile, sidebarOpen, toggleSidebar } = useAppStore();
  const location = useLocation();

  const visible = (item: NavItem) => !item.requiresSave || !!saveFile;

  return (
    <>
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 top-14 z-30 bg-slate-900/30 dark:bg-black/40 lg:hidden"
          aria-label="Close menu"
          onClick={toggleSidebar}
        />
      )}

      <header
        className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-white/[0.08] dark:bg-surface-900 lg:hidden"
      >
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Zap className="h-4 w-4" aria-hidden />
          </div>
          <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">PKHeX</span>
        </div>
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100 dark:text-surface-200 dark:hover:bg-white/[0.06]"
          aria-expanded={sidebarOpen}
          aria-controls="app-sidebar-nav"
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      <aside
        id="app-sidebar-nav"
        className={clsx(
          'fixed z-40 flex flex-col border-slate-200 bg-white dark:border-white/[0.08] dark:bg-surface-900',
          'lg:top-0 lg:h-full lg:border-r',
          'max-lg:top-14 max-lg:h-[calc(100dvh-3.5rem)] max-lg:w-[min(17rem,100vw)] max-lg:border-r max-lg:shadow-xl',
          sidebarOpen ? 'max-lg:translate-x-0' : 'max-lg:-translate-x-full max-lg:pointer-events-none',
          sidebarOpen ? 'lg:w-56' : 'lg:w-[4.5rem]',
        )}
      >
        <div
          className={clsx(
            'hidden border-b border-slate-200 px-4 py-4 dark:border-white/[0.08] lg:flex lg:items-center lg:gap-3',
            !sidebarOpen && 'lg:justify-center lg:px-2',
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Zap className="h-4 w-4" aria-hidden />
          </div>
          <div className={clsx('min-w-0', !sidebarOpen && 'lg:hidden')}>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">PKHeX</p>
            <p className="text-[11px] text-slate-500 dark:text-surface-500">Save editor</p>
          </div>
        </div>

        {saveFile && sidebarOpen && (
          <div className="mx-3 mt-3 hidden rounded-lg border border-indigo-200/70 bg-indigo-50/90 p-3 dark:border-indigo-500/20 dark:bg-indigo-500/[0.08] lg:block">
            <p className="text-xs font-medium text-indigo-900 dark:text-indigo-200">
              {GAME_NAMES[saveFile.gameVersion] ?? 'Unknown game'}
            </p>
            <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{saveFile.trainer.name}</p>
            <p className="truncate text-[11px] text-slate-500 dark:text-surface-500">{saveFile.fileName}</p>
          </div>
        )}

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-3" aria-label="Main">
          {NAV_GROUPS.map(group => {
            const items = group.items.filter(visible);
            if (items.length === 0) return null;
            return (
              <div key={group.label} className="mb-1">
                <p
                  className={clsx(
                    'mb-1 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-surface-500',
                    !sidebarOpen && 'lg:hidden',
                  )}
                >
                  {group.label}
                </p>
                <ul className="space-y-0.5">
                  {items.map(item => {
                    const Icon = item.icon;
                    const isActive =
                      item.path === '/' ? location.pathname === '/' : location.pathname === item.path;
                    return (
                      <li key={item.path}>
                        <NavLink
                          to={item.path}
                          end={item.path === '/'}
                          onClick={() => {
                            if (window.matchMedia('(max-width: 1023px)').matches) toggleSidebar();
                          }}
                          className={clsx(
                            'nav-item',
                            isActive && 'active',
                            !sidebarOpen && 'lg:justify-center lg:px-2',
                          )}
                          title={!sidebarOpen ? item.label : undefined}
                        >
                          <Icon className="h-5 w-5 shrink-0" aria-hidden />
                          <span className={clsx('truncate', !sidebarOpen && 'lg:hidden')}>{item.label}</span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={toggleSidebar}
          className="mx-2 mb-3 hidden h-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 dark:border-white/[0.08] dark:text-surface-400 dark:hover:bg-white/[0.04] lg:flex"
          aria-expanded={sidebarOpen}
          aria-controls="app-sidebar-nav"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </aside>
    </>
  );
}
