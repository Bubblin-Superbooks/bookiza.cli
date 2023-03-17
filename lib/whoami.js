import path from 'path';
import chalk from 'chalk';
import os from 'os';
import read from 'arc-bookiza';

export default function whoami() {
  const osHomeDir = os.homedir();
  const location = path.join(osHomeDir, '.', '.bookizarc');

  read(location)
    .then((data) => {
      const bookizArc = JSON.parse(data); // Arc object

      if (bookizArc.username !== '') {
        process.stdout.write(`${chalk.yellowBright(`${bookizArc.username}`) + chalk.gray(` <${bookizArc.email}>`) + chalk.yellow(`(https://bubblin.io/${bookizArc.username})`)}\n`);
        return true;
      }
      console.error(chalk.red('Unregistered client. Try $ bookiza register'));
      return false;
    }).catch((err) => console.log(chalk.red('Unregistered client:', err)));
}
