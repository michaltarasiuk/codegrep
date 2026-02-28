export function uppercaseFirst([first = "", ...rest]: string): string {
  return first.toUpperCase() + rest.join("");
}
