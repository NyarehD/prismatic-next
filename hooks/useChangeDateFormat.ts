export default function useChangeDateFormat(date: Date) {
  return `${date.toLocaleTimeString()} ${date.toLocaleDateString()}`
}
