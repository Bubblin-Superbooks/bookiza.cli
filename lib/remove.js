import path from 'path'
import fse from 'fs-extra'
import chalk from 'chalk'
import pushStackUp from '../scripts/pushStackUp.js'
import deletePage from '../scripts/deletePage.js'
import addPages from '../generators/addPages.js'
import bookLength from '../lib/bookLength.js';

export default function removePage(removeAt) {
  const bookLength = bookLength();

  process.stdout.write(chalk.yellow(`Deleting page @[ ${chalk.blue(removeAt)} ]… :`));

  deletePage(removeAt, () => {
    pushStackUp(parseInt(removeAt), bookLength, () => {
      fse.readJson(path.join('.', '.bookrc'))
        .then(bookrc => {
          let { mode } = bookrc;
          let pages = 1;
          addPages(bookLength, pages, mode);
        }).catch((err) => {
          if (err) return console.log(chalk.red('Could not read book mode:', err))
        })
    })
  })
}
