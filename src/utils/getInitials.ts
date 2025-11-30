export function getInitials(name: string) {
  if (!name) {
    return "";
  }

  const names = name.trim().split(" ");

  return names
    .map(n => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
