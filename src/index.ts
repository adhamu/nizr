import { existsSync, copyFileSync } from 'fs'
import { basename } from 'path'
import globby from 'globby'
import increment from 'add-filename-increment'

import { createRequiredDirectories, getDateTaken } from './file'
import config from '../config.json'
import logger from './logger'

const organise = async (sources: string[], target: string, glob: string) => {
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

      const directoriesRequired: string[] = []

      files.map(async file => {
        const dateTaken = await getDateTaken(file)
        const yearTaken = dateTaken.getFullYear()
        const monthTaken = `${`0${dateTaken.getMonth() + 1}`.slice(
          -2
        )} - ${dateTaken.toLocaleString('default', {
          month: 'long',
        })}`
        const targetDirectory = `${target}/${yearTaken}/${monthTaken}/`

        if (!directoriesRequired.includes(targetDirectory)) {
          directoriesRequired.push(targetDirectory)
        }

        createRequiredDirectories(directoriesRequired)

        let dest: string = targetDirectory + basename(file)

        while (existsSync(dest)) {
          dest = increment(dest)
        }

        logger(`Copying ${file} to ${dest}`)
        copyFileSync(file, dest)
      })
    })
  )
}

// eslint-disable-next-line semi-style
;(async () => {
  await organise(
    config.images.input,
    config.images.output,
    '{JPG,jpg,JPEG,jpeg,GIF,gif,png,PNG,tiff}'
  )
  await organise(
    config.videos.input,
    config.videos.output,
    '{mp4,MP4,MOV,mov,MPG,AAE,3gp,MTS}'
  )
})()
