import path from 'path'
import fse from 'fs-extra'
import chalk from 'chalk'
import pushStackDown from '../scripts/pushStackDown.js'
import addPages from '../generators/addPages.js'

import bookLength from '../lib/bookLength.js';

export default function insertLeafs(insertAt, options) {
  let leafs = 1;

  if (options !== undefined && options.leafs % 1 === 0) {
    leafs = options.leafs;
  }

  pushStackDown(insertAt, bookLength(), leafs, () => {
    fse.readJson(path.join('.', '.bookrc'))
      .then(bookrc => {
        const pages = leafs * 2;
        const { mode } = bookrc;
        const startAt = parseInt(insertAt, 10);
        addPages(startAt, pages, mode);
      }).catch(err => {
        if (err) return console.log(chalk.red('Could not execute page creation:', err))
      }) 
  })
}

