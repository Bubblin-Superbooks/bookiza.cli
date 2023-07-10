import path from 'path'
import chalk from 'chalk'
import shell from 'shelljs'

export default function pushStackDown(shiftStart, shiftUpto, leaves, callback) {
  const pages = leaves * 2

  process.stdout.write(chalk.yellow('Shaking stack… [ DOWN ]: '))

  for (let pageIndex = shiftUpto; pageIndex >= shiftStart; pageIndex--) {
    shell.mv(
      path.join('__dirname', '..', 'manuscript', `page-${pageIndex}`),
      path.join('__dirname', '..', 'manuscript', `page-${pageIndex + pages}`))
  }
  if (typeof callback === 'function') callback()
}
