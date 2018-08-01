function insertLeafs (insertAt, options) {
  'use strong'

  const path = require('path')
  const stack = require(path.join('..', 'scripts', 'pushStackDown.js'))
  const fse = require('fs-extra')
  const book = require('book-length')
  const chalk = require('chalk')

  let leafs = 1

  if (options !== undefined && options.leafs % 1 === 0) {
    leafs = options.leafs
  }

  stack.pushStackDown(insertAt, book.length(), leafs, () => {
    fse.readJson(path.join('.', '.bookrc'))
      .then(bookrc => {
        const pulp = require(path.join('..', 'generators', 'addPages.js'))

        let pages = leafs * 2

        let { mode } = bookrc

				let startAt = parseInt(insertAt)

        pulp.addPages({ startAt, pages, mode })

      }).catch(err => {
        if (err) return console.log(chalk.red('Could not execute page creation:', err))
      })
  })
}

module.exports.insertLeafs = insertLeafs
