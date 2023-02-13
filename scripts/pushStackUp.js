import path from 'path'
import chalk from 'chalk'
/* globals mv  */
export default function pushStackUp (removedAt, shiftUpTo, callback) {

  process.stdout.write(chalk.yellow('Shaking stack… [ UP ]:'))

  for (let pageIndex = (removedAt + 1); pageIndex <= shiftUpTo; pageIndex++) {
    // via shelljs:
    mv(
      path.join('__dirname', '..', 'manuscript', `page-${pageIndex}`), 
      path.join('__dirname', '..', 'manuscript', `page-${pageIndex - 1}`)
      )
  }

  process.stdout.write(chalk.blue(` Done! ${chalk.magenta('Re')}`))

  if (typeof callback === 'function') {
    callback()
  }
}

