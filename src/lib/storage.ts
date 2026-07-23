/** Read + JSON-parse a localStorage key, returning null on any failure. */
export function LS<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw == null ? null : (JSON.parse(raw) as T)
  } catch {
    return null
  }
}

/** JSON-serialize + write a localStorage key, swallowing quota/serialization errors. */
export function SV(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}
