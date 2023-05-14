import co from 'co';
import prompt from 'co-prompt';
import check from 'check-types';
import chalk from 'chalk';
// import path from 'path'
import isSafePositiveInteger from '../helpers/isPositiveInteger.js';

import sproutLeavesAndLayout from '../scripts/sproutLeavesAndLayout.js';

export default function createNewProject(projectname, options) {
  // maxSafeInteger for older node engines
  // const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991

  // Restricting length of book to 2000 pages.
  const LEAF_LIMIT = 1000;

  // Generator
  co(function* () {
    let { leafs } = options;

    if (!isSafePositiveInteger(parseInt(leafs, 10))) {
      leafs = yield prompt('Number of leafs: ');

      if (!isSafePositiveInteger(parseInt(leafs, 10))) {
        leafs = 2;
      }
    }

    if (check.greater(parseInt(leafs, 10), LEAF_LIMIT)) {
      leafs = 1000; // Restrict booklength and warn user.
      console.log(chalk.yellow('Restricting book length to 1000 leafs (or 2000 pages).'));
    }

    return leafs;
  }).then((leafs) => {
    let { template } = options;

    if (template === undefined || check.not.contains(['comics', 'magazine', 'novel', 'text', 'super', 'photo', 'childrens'], template)) {
      template = 'blank';
    }

    console.log(`${`${chalk.yellow('Initializing project… ')} [ manuscript=${chalk.magenta(`${projectname}`)}`} | leafs=${chalk.magenta(`${leafs}`)} | template=${chalk.magenta(`${template}`)} ]`);
    sproutLeavesAndLayout(projectname, leafs, template);
  }).catch((err) => {
    if (err) return console.error(chalk.bold.red('Failed to initialize new project', err));
  });
}
