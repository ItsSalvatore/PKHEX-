import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAppStore } from '@/store/app-store';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

export function AppLayout() {
  const { sidebarOpen, error, clearError } = useAppStore();

  return (
    <div className="min-h-screen bg-surface-950 bg-grid">
      <Sidebar />
      <main
        className={clsx(
          'min-h-screen transition-all duration-300',
          sidebarOpen ? 'ml-64' : 'ml-20',
        )}
      >
        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between animate-slide-up">
              <p className="text-sm text-red-400">{error}</p>
              <button onClick={clearError} className="p-1 hover:bg-red-500/20 rounded-lg transition-colors">
                <X className="w-4 h-4 text-red-400" />
              </button>
            </div>
          )}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
