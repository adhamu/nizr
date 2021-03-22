import { existsSync, mkdirSync, statSync } from 'fs'
import exifr from 'exifr'
import increment from 'add-filename-increment'

import logger from './logger'

export const createDirectoryIfNotExists = (directory: string): void => {
  if (!existsSync(directory)) {
    logger(`Creating directory ${directory}`)

    mkdirSync(directory, {
      mode: 0o755,
      recursive: true,
    })
  }
}

const getFileModifiedTime = (file: string) => {
  const stats = statSync(file)

  return stats.mtime
}

export const getDateTaken = async (file: string): Promise<Date> => {
  try {
    const output = await exifr.parse(file)

    return output.DateTimeOriginal ?? getFileModifiedTime(file)
  } catch (error) {
    return getFileModifiedTime(file)
  }
}

export const buildTargetDirectoryName = (
  date: Date,
  baseDirectory: string
): string => {
  const yearTaken = date.getFullYear()
  const monthTaken = `${`0${date.getMonth() + 1}`.slice(
    -2
  )} - ${date.toLocaleString('default', {
    month: 'long',
  })}`

  return `${baseDirectory}/${yearTaken}/${monthTaken}/`
}

export const buildFilename = (file: string): string => {
  let filename = file

  while (existsSync(filename)) {
    filename = increment(filename)
  }

  return filename
}
