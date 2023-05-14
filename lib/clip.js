import path from 'path';
import fse from 'fs-extra';
import chalk from 'chalk';
import dateFormat from 'dateformat';
import co from 'co';
import prompt from 'co-prompt';

import bookLength from '../lib/bookLength.js';

export default function clip(options) {
  let { leaves } = options;

  co(function* () {
    if (options !== undefined && options.leafs % 1 === 0) {
      leaves = options.leafs;
    } else {
      leaves = yield prompt('No. of leafs?: ');
    }
    return leaves;
  }).then((leafs) => {
    const currentBookLength = bookLength();
    const now = new Date();
    const timestamp = dateFormat(now, 'dddd-mmmm-dS-yyyy-hh-MM-ss-TT');

    process.stdout.write(chalk.yellow(` Clipping [ ${chalk.magenta(leafs)} ] leaf(s) from the end… : `));

    const promises = [];

    for (let pageIndex = currentBookLength, endIndex = currentBookLength - (parseInt(leafs) * 2); pageIndex > endIndex; pageIndex--) {
      promises.push(
        fse.move(
          path.join('__dirname', '..', 'manuscript', `page-${pageIndex}`),
          path.join('__dirname', '..', 'trash', `page-${pageIndex}-${timestamp}`),
        ),
      );
    }
    return Promise.all(promises);
  }).then((res) => {
    process.stdout.write(`${chalk.blue('done.')}\n`);
  }).catch((err) => {
    if (err) { return console.log(chalk.red('Clip execution failed', err)); }
  });
}
