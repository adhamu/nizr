/* eslint-disable no-console */
const output = (message: string, type: 'INFO' | 'WARNING' | 'ERROR') =>
  console.log(`${new Date().toISOString()} --- ${type}: ${message}`)

export default {
  info: (message: string): void => output(message, 'INFO'),
  warn: (message: string): void => output(message, 'WARNING'),
  error: (message: string): void => output(message, 'ERROR'),
}
