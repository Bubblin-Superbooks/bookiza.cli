import path from 'path'
import chalk from 'chalk'
/* globals mv  */
export default function pushStackDown (shiftStart, shiftUpto, leafs, callback) {

  let pages = leafs * 2

  process.stdout.write(chalk.yellow('Shaking stack… [ DOWN ]: '))

  for (let pageIndex = shiftUpto; pageIndex >= shiftStart; pageIndex--) {
    mv(
      path.join('__dirname', '..', 'manuscript', `page-${pageIndex}`), 
      path.join('__dirname', '..', 'manuscript', `page-${pageIndex + pages}`)
      )
  }

  if (typeof callback === 'function') {
    callback()
  }
}
