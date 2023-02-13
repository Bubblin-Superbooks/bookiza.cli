import path from 'path'
import fse from 'fs-extra'
import book from 'book-length'
import chalk from 'chalk'
import pushStackDown from '../scripts/pushStackDown.js'
import addPages from '../generators/addPages.js'

export default function insertLeafs (insertAt, options) {
  'use strong'

  let leafs = 1

  if (options !== undefined && options.leafs % 1 === 0) {
    leafs = options.leafs
  }

  pushStackDown(insertAt, book.length(), leafs, () => {
    fse.readJson(path.join('.', '.bookrc'))
      .then(bookrc => {
        let pages = leafs * 2

        let { mode } = bookrc

				let startAt = parseInt(insertAt)

        addPages(startAt, pages, mode)

      }).catch(err => {
        if (err) return console.log(chalk.red('Could not execute page creation:', err))
      })
  })
}

