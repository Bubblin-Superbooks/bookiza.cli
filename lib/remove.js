import path from 'path'
import fse from 'fs-extra'
import chalk from 'chalk'
import pushStackUp from '../scripts/pushStackUp.js'
import deletePage from '../scripts/deletePage.js'
import addPages from '../generators/addPages.js'
import bookLength from '../lib/bookLength.js';

export default function removePage(removeAt) {
  const length = bookLength();

  process.stdout.write(chalk.yellow(`Deleting page @[ ${chalk.blue(removeAt)} ]… :`));

  deletePage(removeAt, () => {
    pushStackUp(parseInt(removeAt, 10), length, () => {
      fse.readJson(path.join('.', '.bookrc'))
        .then((bookrc) => {
          const { mode } = bookrc;
          const pages = 1;
          addPages(length, pages, mode);
        }).catch((err) => {
          if (err) console.log(chalk.red('Could not read book mode:', err))
        })
    })
  })
}
