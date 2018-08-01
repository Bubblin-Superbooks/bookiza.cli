function movePage (moveFrom, moveTo) {
  'use strong'

  const chalk = require('chalk')
  const path = require('path')
  const fse = require('fs-extra')
  const book = require('book-length')

  if (parseInt(moveTo) > book.length() || parseInt(moveFrom) > book.length()) return

  process.stdout.write(chalk.yellow(`Moving page @[ ${chalk.blue(moveFrom)} ] to… : @[ ${chalk.blue(moveTo)} ]`))

  fse.move(path.join('__dirname', '..', 'manuscript', `page-${moveFrom}`), path.join('__dirname', '..', 'manuscript', `page-${moveTo}_`))
  .then(() => {
    if (parseInt(moveFrom) < parseInt(moveTo)) {
      const stack = require(path.join('..', 'scripts', 'pushStackUp.js'))
      stack.pushStackUp(parseInt(moveFrom), parseInt(moveTo), () => {
        fse.move(path.join('__dirname', '..', 'manuscript', `page-${moveTo}_`), path.join('__dirname', '..', 'manuscript', `page-${moveTo}`))
      })
    } else {
      const stack = require(path.join('..', 'scripts', 'pushStackDown.js'))
      stack.pushStackDown(parseInt(moveTo), parseInt(moveFrom) - 1, 0.5, () => {
        fse.move(path.join('__dirname', '..', 'manuscript', `page-${moveTo}_`), path.join('__dirname', '..', 'manuscript', `page-${moveTo}`))
      })
    }

  })
  .catch(err => {
    console.error(err)
  })
}

module.exports.movePage = movePage
