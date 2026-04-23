export function formatDate(date: Date | string) {
  let d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    minute: "2-digit",
    hour: "numeric",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
