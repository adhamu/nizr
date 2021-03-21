import { existsSync, mkdirSync, statSync } from 'fs'
import exifr from 'exifr'
import logger from './logger'

const createDirectory = (directory: string) => {
  if (!existsSync(directory)) {
    logger(`Creating directory ${directory}`)

    mkdirSync(directory, {
      mode: 0o755,
      recursive: true,
    })
  }
}

export const createRequiredDirectories = (directories: string[]): void => {
  directories.forEach(directory => {
    createDirectory(directory)
  })
}

export const getDateTaken = async (file: string): Promise<Date> => {
  const output = await exifr.parse(file)

  if (output.DateTimeOriginal) {
    output.DateTimeOriginal
  }

  const stats = statSync(file)

  return stats.mtime
}
