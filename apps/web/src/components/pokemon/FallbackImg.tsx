import { useState, useEffect, useMemo } from 'react';
import { clsx } from 'clsx';

interface FallbackImgProps {
  urls: string[];
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

/** Tries each URL until one loads; optional empty placeholder when all fail. */
export function FallbackImg({ urls, alt, className, loading = 'lazy' }: FallbackImgProps) {
  const key = useMemo(() => urls.join('|'), [urls]);
  const [index, setIndex] = useState(0);
  const [dead, setDead] = useState(false);

  useEffect(() => {
    setIndex(0);
    setDead(false);
  }, [key]);

  if (urls.length === 0 || dead) {
    return (
      <div
        className={clsx('rounded-md bg-white/[0.04] border border-white/[0.06]', className)}
        aria-hidden
      />
    );
  }

  const url = urls[Math.min(index, urls.length - 1)];

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => {
        setIndex((prev) => {
          const next = prev + 1;
          if (next < urls.length) return next;
          queueMicrotask(() => setDead(true));
          return prev;
        });
      }}
    />
  );
}
