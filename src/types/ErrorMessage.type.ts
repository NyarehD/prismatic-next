export default interface ErrorMessage {
  message: string
  path: []
  type: string
  context: {
    key: string
    label: string
    limit: number
    value: string
  }
}