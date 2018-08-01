function removePage (removeAt) {
  'use strong'

  const chalk = require('chalk')
  const path = require('path')
  const manuscript = require(path.join('..', 'scripts', 'deletePage.js'))
  const stack = require(path.join('..', 'scripts', 'pushStackUp.js'))
  const fse = require('fs-extra')

  const book = require('book-length')

  let bookLength = book.length()

  process.stdout.write(chalk.yellow(`Deleting page @[ ${chalk.blue(removeAt)} ]… :`))

  manuscript.deletePage(removeAt, () => {
    stack.pushStackUp(parseInt(removeAt), bookLength, () => {
      fse.readJson(path.join('.', '.bookrc'))
        .then(bookrc => {
          const pulp = require(path.join('..', 'generators', 'addPages.js'))

          let { mode } = bookrc
          let pages = 1

          pulp.addPages({ bookLength, pages, mode })
        }).catch((err) => {
          if (err) return console.log(chalk.red('Could not read book mode:', err))
        })
    })
  })
}

module.exports.removePage = removePage
