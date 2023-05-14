import shell from 'shelljs';
import chalk from 'chalk';

export default function renderPages() {
  shell.exec('gulp renderBook');
  console.log(chalk.magenta('Build step was successful.'));
}
