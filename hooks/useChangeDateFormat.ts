export default function useChangeDateFormat(date: Date | string) {
  if (typeof date === "string") {
    date = new Date(date);
  }
  return `${date.toLocaleTimeString()} ${date.toLocaleDateString()}`
}
