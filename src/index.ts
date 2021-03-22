import { copyFileSync, renameSync } from 'fs'
import { basename } from 'path'
import globby from 'globby'

import {
  buildTargetDirectoryName,
  createDirectoryIfNotExists,
  getDateTaken,
  buildFilename,
} from './file'
import logger from './logger'
import config from '../config.json'

type Config = {
  inputs: string[]
  output: string
  pattern: string
  move?: boolean
}

const organise = async (config: Config) => {
  const { inputs, output, pattern = '*', move = false } = config

  if (!inputs || !output) {
    return
  }

  const [files] = await Promise.all(
    inputs.map(input => globby(`${input}/${pattern}`))
  )

  if (!files) {
    logger('No files found, skipping', 'WARNING')

    return
  }

  const modified = await Promise.all(files.map(file => getDateTaken(file)))

  logger(`${files.length} files found using ${pattern}, organising...`)

  files.forEach((file, i) => {
    const targetDirectory = buildTargetDirectoryName(modified[i], output)
    const filename = buildFilename(targetDirectory + basename(file))

    createDirectoryIfNotExists(targetDirectory)

    logger(`${move ? 'Moving' : 'Copying'} ${file} to ${filename}`)
    move ? renameSync(file, filename) : copyFileSync(file, filename)
  })
}

// eslint-disable-next-line semi-style
;(() => {
  config.map(c => {
    organise(c)
  })
})()
