import path from 'path';
import fse from 'fs-extra';
import chalk from 'chalk';

export default function addPages({ startAt, pages, mode }) {
  const htmlExt = mode.HTML || 'html';
  const cssExt = mode.CSS || 'css';

  // let headExt = mode.HEAD || 'html'
  // let javascriptExt = mode.JS || 'js'

  let bodyTemplate = '';

  fse
    .readFile(path.join('.', 'templates', `body.${htmlExt}`), {
      encoding: 'utf-8',
    })
    .then((content) => {
      process.stdout.write(
        chalk.yellow(`Generating [ ${chalk.magenta(pages)} ] blank page(s)… :`)
      );

      bodyTemplate = content; // Set bodyTemplate for next promise. Ugly :(

      // Blank manuscript structure:
      const blankPages = [];

      for (let i = startAt, endAt = startAt + pages; i < endAt; i++) {
        const pageDir = path.join('.', 'manuscript', `page-${i}`);
        const thisDir = fse.ensureDir(pageDir); // promise { pending }

        blankPages.push(thisDir);
      }

      return Promise.all(blankPages);
    })
    .then(() => {
      const pendingWrites = []; // TODO: Consider fse.copy instead of IO per page.

      for (let i = startAt, endAt = startAt + pages; i < endAt; i++) {
        const styleFile = path.join(
          '.',
          'manuscript',
          `page-${i}`,
          `style.${cssExt}`
        );
        const htmlFile = path.join(
          '.',
          'manuscript',
          `page-${i}`,
          `body.${htmlExt}`
        );

        const thisWrite = fse.writeFile(styleFile, '');
        const thatWrite = fse.writeFile(htmlFile, bodyTemplate);

        pendingWrites.push(thisWrite);
        pendingWrites.push(thatWrite);
      }
      return Promise.all(pendingWrites);
    })
    .then(() => {
      return process.stdout.write(`${chalk.blue(' done.')}` + '\n');
    })
    .catch((err) => {
      if (err) return console.log('Could not create pages', err);
      throw err;
    })
}
