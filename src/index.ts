import { existsSync, copyFileSync } from 'fs'
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

const organise = async (sources: string[], target: string, glob: string) => {
  if (!sources || !target) {
    return
  }

  await Promise.all(
    sources.map(async source => {
      if (!existsSync(source)) {
        logger(`${source} does not exist, skipping`, 'WARNING')
        return
      }

      logger(`Scanning ${source}`)

      const files = await globby(`${source}/*.${glob}`)

      if (!files.length) {
        logger(
          `No files found using glob ${glob} inside ${source}, skipping`,
          'WARNING'
        )
        return
      }

      logger(
        `${files.length} files found using ${glob} inside ${source}, organising...`
      )

      files.map(async file => {
        const dateTaken = await getDateTaken(file)
        const targetDirectory = buildTargetDirectoryName(dateTaken, target)
        const filename = buildFilename(targetDirectory + basename(file))

        createDirectoryIfNotExists(targetDirectory)

        logger(`Copying ${file} to ${filename}`)
        copyFileSync(file, filename)
      })
    })
  )
}

// eslint-disable-next-line semi-style
;(async () => {
  await organise(
    config.images?.input,
    config.images?.output,
    '{JPG,jpg,JPEG,jpeg,GIF,gif,png,PNG,tiff}'
  )
  await organise(
    config.videos?.input,
    config.videos?.output,
    '{mp4,MP4,MOV,mov,MPG,AAE,3gp,MTS}'
  )
})()
