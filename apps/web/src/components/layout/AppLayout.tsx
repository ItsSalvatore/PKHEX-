import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAppStore } from '@/store/app-store';
import { usePwaGameContext } from '@/hooks/usePwaGameContext';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

export function AppLayout() {
  usePwaGameContext();
  const { sidebarOpen, error, clearError } = useAppStore();

  useEffect(() => {
    if (window.matchMedia('(max-width: 1023px)').matches) {
      useAppStore.setState({ sidebarOpen: false });
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-200 dark:bg-surface-950">
      <Sidebar />
      <main
        className={clsx(
          'min-h-screen transition-[padding] duration-200 ease-out',
          'pt-14 pl-0 lg:pt-0',
          sidebarOpen ? 'lg:pl-56' : 'lg:pl-[4.5rem]',
        )}
      >
        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="mb-6 p-4 rounded-xl flex items-center justify-between border animate-slide-up
                bg-red-50 border-red-200 text-red-800
                dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-300"
            >
              <p className="text-sm">{error}</p>
              <button
                type="button"
                onClick={clearError}
                className="p-2 rounded-lg transition-colors cursor-pointer
                  hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50
                  dark:hover:bg-red-500/20"
                aria-label="Dismiss error"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
