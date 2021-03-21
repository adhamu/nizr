export default (
  message: string,
  type: 'INFO' | 'WARNING' | 'ERROR' = 'INFO'
): void =>
  // eslint-disable-next-line no-console
  console.log(`${new Date().toISOString()} --- ${type}: ${message}`)
