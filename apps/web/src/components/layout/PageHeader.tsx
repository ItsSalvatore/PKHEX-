import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  icon?: LucideIcon;
}

export function PageHeader({ title, description, icon: Icon }: PageHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-200/90 text-slate-700 dark:bg-white/[0.06] dark:text-surface-200">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
        )}
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
            {title}
          </h1>
          {description != null && description !== '' ? (
            <div className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-surface-400">{description}</div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
