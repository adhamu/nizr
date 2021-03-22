import { existsSync, copyFileSync, renameSync } from 'fs'
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

  await Promise.all(
    inputs.map(async input => {
      if (!existsSync(input)) {
        logger(`${input} does not exist, skipping`, 'WARNING')
        return
      }

      logger(`Scanning ${input}`)

      const files = await globby(`${input}/${pattern}`)

      if (!files.length) {
        logger(
          `No files found using pattern ${pattern} inside ${input}, skipping`,
          'WARNING'
        )
        return
      }

      logger(
        `${files.length} files found using ${pattern} inside ${input}, organising...`
      )

      files.map(async file => {
        const dateTaken = await getDateTaken(file)
        const targetDirectory = buildTargetDirectoryName(dateTaken, output)
        const filename = buildFilename(targetDirectory + basename(file))

        createDirectoryIfNotExists(targetDirectory)

        logger(`${move ? 'Moving' : 'Copying'} ${file} to ${filename}`)
        move ? renameSync(file, filename) : copyFileSync(file, filename)
      })
    })
  )
}

// eslint-disable-next-line semi-style
;(() => {
  config.map(async c => {
    await organise(c)
  })
})()
