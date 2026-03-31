import { Link } from 'react-router-dom';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
}

export function EmptyState({
  title = 'No save file loaded',
  description = 'Load a save file to use this section. Your data stays in this browser unless you use a local PKHeX bridge.',
  actionLabel = 'Load save file',
  actionTo = '/load',
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200/80 text-slate-500 dark:bg-white/[0.06] dark:text-surface-500">
        <FolderOpen className="h-7 w-7" aria-hidden />
      </div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-surface-400">{description}</p>
      <Link
        to={actionTo}
        className="btn-primary mt-6 inline-flex items-center justify-center rounded-lg no-underline"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
