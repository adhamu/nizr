/* eslint-disable no-console */
export default (
  message: string,
  type: 'INFO' | 'WARNING' | 'ERROR' = 'INFO'
): void => {
  const output = `${new Date().toISOString()} --- ${type}: ${message}`

  switch (type) {
    case 'WARNING':
      console.warn(output)
      break
    case 'ERROR':
      console.error(output)
      break
    default:
      console.log(output)
  }
}
