import path from 'path';
import chalk from 'chalk';
import shell from 'shelljs';

export default function pushStackUp(removedAt, shiftUpTo, callback) {
  process.stdout.write(chalk.yellow('Re-stacking pages… [ UPWARDS ]:'));

  for (let pageIndex = (removedAt + 1); pageIndex <= shiftUpTo; pageIndex++) {
    shell.mv(
      path.join('__dirname', '..', 'manuscript', `page-${pageIndex}`),
      path.join('__dirname', '..', 'manuscript', `page-${pageIndex - 1}`),
    );
  }

  process.stdout.write(chalk.blue(` Done! ${chalk.magenta('Re')}`));

  if (typeof callback === 'function') {
    callback();
  }
}
