/* globals mv  */
function pushStackDown (shiftStart, shiftUpto, leafs, callback) {
  const path = require('path')
  const chalk = require('chalk')

  let pages = leafs * 2

  process.stdout.write(chalk.yellow('Shaking stack… [ DOWN ]: '))

  for (let pageIndex = shiftUpto; pageIndex >= shiftStart; pageIndex--) {
    mv(path.join('__dirname', '..', 'manuscript', `page-${pageIndex}`), path.join('__dirname', '..', 'manuscript', `page-${pageIndex + pages}`))
  }

  if (typeof callback === 'function') {
    callback()
  }
}

module.exports.pushStackDown = pushStackDown
