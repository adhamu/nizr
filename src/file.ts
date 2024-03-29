import { existsSync, mkdirSync, statSync } from 'fs'
import { parse } from 'path'

import exifr from 'exifr'

import { logger } from './logger'

const getFileModifiedTime = (file: string) => {
  const stats = statSync(file)

  return stats.mtime
}

export const createDirectoryIfNotExists = (directory: string): void => {
  if (!existsSync(directory)) {
    logger.info(`Creating directory ${directory}`)

    mkdirSync(directory, {
      mode: 0o755,
      recursive: true,
    })
  }
}

export const getModifiedTime = async (file: string): Promise<Date> => {
  try {
    const output = await exifr.parse(file)

    return output?.DateTimeOriginal ?? getFileModifiedTime(file)
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
  let counter = 1

  const { dir, name, ext } = parse(filename)

  while (existsSync(filename)) {
    filename = `${dir}/${name}_${counter}${ext}`
    counter += 1
  }

  return filename
}
