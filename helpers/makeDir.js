import path from 'path'
import { mkdirSync } from 'node:fs'

export default function makeDir (dirsArray, parentDir, callback) {
  dirsArray.forEach(dirName => {
    if (parentDir === undefined) {
      mkdirSync(dirName)
    } else {
      mkdirSync(path.join(parentDir, dirName))
    }
  })
  if (typeof callback === 'function') {
    callback()
  }
}
