export function formatSeconds(seconds: number) {
  const hours = Math.floor(seconds / (60 * 60)).toString();
  const minutes = Math.floor((seconds / 60) % 60).toString();
  seconds = seconds % 60;

  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}
