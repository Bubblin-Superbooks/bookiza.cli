/* globals mv  */
function pushStackUp (removedAt, shiftUpTo, callback) {
  const path = require('path')
  const chalk = require('chalk')

  process.stdout.write(chalk.yellow('Shaking stack… [ UP ]:'))

  for (let pageIndex = (removedAt + 1); pageIndex <= shiftUpTo; pageIndex++) {
    // via shelljs:
    mv(path.join('__dirname', '..', 'manuscript', `page-${pageIndex}`), path.join('__dirname', '..', 'manuscript', `page-${pageIndex - 1}`))
  }

  process.stdout.write(chalk.blue(` Done! ${chalk.magenta('Re')}`))

  if (typeof callback === 'function') {
    callback()
  }
}

module.exports.pushStackUp = pushStackUp
