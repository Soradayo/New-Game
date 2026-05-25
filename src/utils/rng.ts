export function makeSeed(turn: number, salt: string): number {
  let hash = 2166136261;
  const input = `${turn}:${salt}`;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0) / 4294967295;
}
