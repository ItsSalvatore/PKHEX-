import { useState, useCallback, type DragEvent } from 'react';

interface UseFileDropOptions {
  onDrop: (files: FileList) => void;
  accept?: string[];
}

export function useFileDrop({ onDrop, accept }: UseFileDropOptions) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    if (accept && accept.length > 0) {
      const validFiles = Array.from(files).filter(f => {
        const ext = '.' + f.name.split('.').pop()?.toLowerCase();
        return accept.includes(ext);
      });
      if (validFiles.length > 0) {
        const dt = new DataTransfer();
        validFiles.forEach(f => dt.items.add(f));
        onDrop(dt.files);
      }
    } else {
      onDrop(files);
    }
  }, [onDrop, accept]);

  return { isDragging, handleDragOver, handleDragLeave, handleDrop };
}
