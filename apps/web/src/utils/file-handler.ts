export async function readFileAsArrayBuffer(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Uint8Array(reader.result));
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

export function downloadFile(data: Uint8Array, fileName: string): void {
  const blob = new Blob([data.buffer as ArrayBuffer], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/** Shown in UI — not used to block the file picker (saves are detected by size/content). */
export const KNOWN_SAVE_EXTENSIONS_LABEL =
  '.sav, .srm, .dsv, .duc, .dat, .bin, .raw, .gci, .eep, .fla, .main, .bak, .pk4-.pk9, .wc6-.wc9';

/**
 * Use a permissive picker like desktop PKHeX: many emulators use .srm, no extension, or custom names.
 * Parsing uses @pkhex/core (TypeScript) by default, or PKHeX.Core via optional `VITE_PKHEX_BRIDGE_URL`.
 */
export const SAVE_FILE_INPUT_ACCEPT = '*/*';
