export function ensureTrailingNewlines(str: string) {
  return str.replace(/(?<!\n)\n?$/, "\n\n");
}
