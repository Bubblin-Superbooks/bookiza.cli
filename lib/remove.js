import path from 'path'
import fse from 'fs-extra'
import book from 'book-length'
import chalk from 'chalk'
import pushStackUp from '../scripts/pushStackUp.js'
import deletePage from '../scripts/deletePage.js'
import addPages from '../generators/addPages.js'

export default function removePage (removeAt) {
  'use strong'

  let bookLength = book.length()

  process.stdout.write(chalk.yellow(`Deleting page @[ ${chalk.blue(removeAt)} ]… :`))

  deletePage(removeAt, () => {
    pushStackUp(parseInt(removeAt), bookLength, () => {
      fse.readJson(path.join('.', '.bookrc'))
        .then(bookrc => {

          let { mode } = bookrc
          let pages = 1

          addPages(bookLength, pages, mode)
        }).catch((err) => {
          if (err) return console.log(chalk.red('Could not read book mode:', err))
        })
    })
  })
}

