/** Format a number as Brazilian Real, e.g. 2099 -> "R$ 2099,00". */
export const BRL = (n: number): string => 'R$ ' + Number(n).toFixed(2).replace('.', ',')

/** Parse a loosely-formatted BRL string back into a number. */
export const parseBRL = (s: string | number): number => {
  const n = parseFloat(
    String(s)
      .replace(/[^0-9,.-]/g, '')
      .replace(/\./g, '')
      .replace(',', '.'),
  )
  return isNaN(n) ? 0 : n
}

/** Short random id. */
export const uid = (): string => Math.random().toString(36).slice(2, 9)

/** hostname without "www." for a URL, or a friendly fallback. */
export const hostOf = (url: string): string => {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return 'link salvo'
  }
}
