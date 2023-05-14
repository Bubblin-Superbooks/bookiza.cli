import co from 'co';
import prompt from 'co-prompt';
import path from 'path';
import fse from 'fs-extra';
import chalk from 'chalk';
import addPages from '../generators/addPages.js';
import bookLength from '../lib/bookLength.js';

export default function addLeafs(options) {
  co(function* () {
    let leafs;
    if (options !== undefined && options.leafs % 1 === 0) {
      leafs = options.leafs;
    } else {
      leafs = yield prompt('No. of leafs?: ');
    }
    return leafs;
  }).then((leafs) => {
    fse.readJson(path.join('.', '.bookrc'))
      .then((bookrc) => {
        const { mode } = bookrc;

        process.stdout.write(chalk.yellow(`${chalk.blue(JSON.stringify([mode.HTML, mode.CSS]))} : Adding [ ${chalk.magenta(leafs)} ] leaf(s)… : `));

        const startAt = bookLength() + 1;
        const pages = leafs * 2;

        addPages(startAt, pages, mode); // Spawn a process?
      }).catch((err) => {
        if (err) return console.log(chalk.red('Could not read book mode:', err));
      });
  }).catch((err) => {
    if (err) { return console.log(chalk.red('Adding leafs failed:', err)); }
  });
}
