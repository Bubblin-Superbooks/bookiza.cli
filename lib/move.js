import path from 'path'
import fse from 'fs-extra'
import book from 'book-length'
import chalk from 'chalk'
import pushStackUp from '../scripts/pushStackUp.js'
import pushStackDown from '../scripts/pushStackDown.js'

export default function movePage (moveFrom, moveTo) {
  'use strong'

  if (parseInt(moveTo) > book.length() || parseInt(moveFrom) > book.length()) return

  process.stdout.write(chalk.yellow(`Moving page @[ ${chalk.blue(moveFrom)} ] to… : @[ ${chalk.blue(moveTo)} ]`))

  fse.move(path.join('__dirname', '..', 'manuscript', `page-${moveFrom}`), path.join('__dirname', '..', 'manuscript', `page-${moveTo}_`))
  .then(() => {
    if (parseInt(moveFrom) < parseInt(moveTo)) {
      pushStackUp(parseInt(moveFrom), parseInt(moveTo), () => {
        fse.move(path.join('__dirname', '..', 'manuscript', `page-${moveTo}_`), path.join('__dirname', '..', 'manuscript', `page-${moveTo}`))
      })
    } else {
      pushStackDown(parseInt(moveTo), parseInt(moveFrom) - 1, 0.5, () => {
        fse.move(path.join('__dirname', '..', 'manuscript', `page-${moveTo}_`), path.join('__dirname', '..', 'manuscript', `page-${moveTo}`))
      })
    }

  })
  .catch(err => {
    console.error(err)
  })
}

