/** Simple string hash (djb2-ish) so the same date key always yields the same seed. */
function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (Math.imul(31, hash) + input.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

export function getDailySeed(dateKey: string): number {
  return hashString(`ultimate-ttt-${dateKey}`);
}
