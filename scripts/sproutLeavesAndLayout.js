import read from 'arc-bookiza';
import fse from 'fs-extra';
import chalk from 'chalk';
import path from 'path';
import shell from 'shelljs';
import { fileURLToPath } from 'url';
import install from 'spawn-npm-install';
import os from 'os';
import makeDir from '../helpers/makeDir.js';
import addPages from '../generators/addPages.js';

/* Get to the root directory of the user */
const homeDir = os.homedir();
const location = `${homeDir}/.bookizarc`;

/* __dirname isn't available inside ES modules: */
// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename);

const setUp = (projectname, leafs, templateName) => {
  fse.ensureDir('assets')
    .then(() => {
      makeDir(['css', 'javascript', 'images'], 'assets');
      makeDir(['trash', 'cover', 'build']);
    }).catch((err) => {
      console.log(chalk.bold.red('Failed to create subdirectories…', err));
    });

  fse.outputFile(path.join('.', 'README.md'), projectname)
    .then(() => {
      console.log(chalk.yellow(`README initialization… :${chalk.blue('success.')}`));
    }).catch((err) => {
      console.error(chalk.red('README not initialized.'), err);
    });

  fse.outputFile(path.join('.', '.gitignore'), 'node_modules\nbuild\n*/*.DS_Store')
    .then(() => {
      console.log(chalk.yellow(`Ignoring folders /build, /node_modules on git:${chalk.blue('success.')}`));
    }).catch((err) => {
      console.error(chalk.red('.gitignore not initialized.'), err);
    });

  fse.outputFile(path.join('.', 'license.md'), '')
    .then(() => {
      console.log(chalk.yellow(`License (blank) initialization:${chalk.blue('success.')}`));
    }).catch((err) => {
      console.error(chalk.red('Licensing not initialized.'), err);
    });

  const promises = [];

  promises.push(
    fse.copy(path.join(__dirname, '..', 'templates', templateName), path.join('.', 'templates'))
      .then(() => console.log(chalk.yellow(`Applying a ${chalk.magenta(`${templateName}`)} layout… :${chalk.blue('success.')}`))).catch((err) => {
        console.error(chalk.red('Could not copy the templates folder', err));
      }),
  );

  promises.push(
    fse.copy(path.join(__dirname, '..', 'crust'), path.join('.', 'crust'))
      .then(() => {
        console.log(chalk.yellow(`Mobilizing crust… :${chalk.blue('success.')}`));
      }).catch((err) => {
        console.error(chalk.red('Copying over the crust folder failed', err));
      }),
  );

  return Promise.all(promises)
    .then(() => {
      fse.move(path.join('.', 'crust', 'gulpfile.js'), path.join('.', 'gulpfile.js'))
        .then(() => {
          console.log(chalk.yellow(`Server setup… :${chalk.blue('complete.')}`));
        }).catch((err) => {
          console.error(chalk.red('Failed. Gulpfile was unavailable.', err));
        });
    }).then(() => {
      let packageJson = null;
      const promises = [];

      promises.push(read(location));// Read ArcBookiza values. See line #14 above.
      promises.push(fse.readJson(path.join('.', 'crust', 'package.json')));

      return Promise.all(promises)
        .then((values) => {
          const bookizArc = JSON.parse(values[0]);
          packageJson = values[1];
          packageJson.name = projectname;
          packageJson.author = `${bookizArc.username} <${bookizArc.email}> (https://bubblin.io/${bookizArc.username})`;
          packageJson.homepage = `https://bubblin.io/${bookizArc.username}`;
          packageJson.description = `Superbook: ${projectname} by ${bookizArc.username}`;

          fse.outputFile(path.join('.', 'package.json'), JSON.stringify(packageJson, null, 2))
            .then(() => {
              console.log(chalk.yellow(`PackageJson configuration… :${chalk.blue('success.')}`));
            }).catch((err) => {
              if (err) return Error('Couldn\'t write package.json', err);
            });

          const bookrc = {};

          bookrc.name = projectname;
          bookrc.layout = templateName;
          bookrc.has_page_numbers = false;
          bookrc.punchline = '';
          bookrc.table_of_contents = '';
          bookrc.author_detail = '';
          bookrc.colophon = '';
          bookrc.summary = '';
          bookrc.language = '';
          bookrc.status = 'draft';
          bookrc.asset_url = ''; // Allow only rawgit, self, or the cloudinary path. Maintain a whitelist.
          bookrc.book_url = '';
          [bookrc.mode = {
            HTML: 'html', CSS: 'css', JS: 'js', HEAD: 'html',
          }] = [bookizArc.mode];

          return bookrc;
        }).then((bookrc) => {
          fse.outputFile(path.join('.', '.bookrc'), JSON.stringify(bookrc, null, 2))
            .then(() => {
              console.log(chalk.yellow(`Default bookrc values… :${chalk.blue('success.')}`));
            })
            .catch((err) => {
              if (err) return new Error('Couldn\'t write .bookrc', err);
            });
          return bookrc.mode;
        }).then((mode) => {
          fse.ensureDir('manuscript')
            .then(() => {
              const startAt = 1;
              const pages = leafs * 2;

              addPages(startAt, pages, mode);

              install(Object.keys(packageJson.dependencies), { stdio: 'inherit' }, (err) => {
                if (err) {
                  return console.error(chalk.red(`Could\n't install modules:\n${err.message}`));
                }
                console.log(chalk.yellow(`Installing npm modules… :${chalk.blue('successful.')}`));
              });
            }).catch((err) => {
              console.log(chalk.bold.red('Failed to write directory', err));
            });
        })
        .catch((err) => {
          console.log(chalk.red('Arcvalues & package json unavailable', err));
        });
    }).catch((err) => {
      console.log(chalk.red('Moving crust or template failed:', err));
    });
}

export default function sproutLeavesAndLayout(projectname, leafs, templateName) {
  fse.ensureDir(projectname)
    .then(() => {
      shell.cd(projectname);// Duration of function. See shelljs documentation.
    }).then(() => {
      setUp(projectname, leafs, templateName);
    }).catch((err) => {
      console.log(chalk.bold.red('Failed to create project', err));
    });
}