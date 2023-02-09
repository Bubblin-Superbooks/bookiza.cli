import read from 'arc-bookiza'
import fse from 'fs-extra'
import chalk from 'chalk'
import path from 'path'
import shell from 'shelljs'
import { fileURLToPath } from 'url'
import makeDir from '../helpers/makeDir.js'
import addPages from '../generators/addPages.js'
import install from 'spawn-npm-install'
import os from 'os'

/* Get to the root directory of the user */
const homeDir = os.homedir()
const location = import(`${homeDir}/.bookizarc`)

/* __dirname isn't available inside ES modules: */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default function sproutLeavesAndLayout (projectname, leafs, templateName) {
  fse.ensureDir(projectname)
    .then(() => {
      shell.cd(projectname) // Duration of function. See shelljs documentation.
    }).then(() => {
      setUp(projectname, leafs, templateName)
    }).catch((err) => {
      if (err) { return console.log(chalk.bold.red('Failed to create project', err)) }
    })
}

function setUp (projectname, leafs, templateName) {
  fse.ensureDir('assets')
    .then(() => {
      makeDir(['css', 'javascript', 'images'], 'assets')
      makeDir(['trash', 'cover', 'build'])
    }).catch(err => {
      if (err) { return console.log(chalk.bold.red('Failed to create subdirectories…', err)) }
    })

  fse.outputFile(path.join('.', 'README.md'), projectname)
    .then(() => {
      console.log(chalk.yellow(`README initialization… :${chalk.blue('success.')}`))
    }).catch((err) => {
      if (err) { return console.error(chalk.red('README not initialized.'), err) }
    })

  fse.outputFile(path.join('.', '.gitignore'), 'node_modules\nbuild\n*/*.DS_Store')
    .then(() => {
      console.log(chalk.yellow(`Gitignoring… /build /node_modules :${chalk.blue('done.')}`))
    }).catch((err) => {
      if (err) { return console.error(chalk.red('.gitignore not initialized.'), err) }
    })

  fse.outputFile(path.join('.', 'license.md'), '')
    .then(() => {
      console.log(chalk.yellow(`License (blank) initialization:${chalk.blue('complete.')}`))
    }).catch((err) => {
      if (err) { return console.error(chalk.red('Licensing not initialized.'), err) }
    })

  const promises = []

  promises.push(
    fse.copy(path.join(__dirname, '..', 'templates', templateName), path.join('.', 'templates'))
      .then(() => {
        return console.log(chalk.yellow(`Applying a ${chalk.magenta(`${templateName}`)} layout… :${chalk.blue('success.')}`))
      }).catch(err => {
        if (err) { return console.error(chalk.red('Could not copy the templates folder', err)) }
      })
  )

  promises.push(
    fse.copy(path.join(__dirname, '..', 'crust'), path.join('.', 'crust'))
      .then(() => {
        console.log(chalk.yellow(`Mobilizing crust… :${chalk.blue('success.')}`))
      }).catch((err) => {
        if (err) { return console.error(chalk.red('Copying over the crust folder failed', err)) }
      })
  )

  return Promise.all(promises)
    .then(() => {
      fse.move(path.join('.', 'crust', 'gulpfile.js'), path.join('.', 'gulpfile.js'))
        .then(() => {
          console.log(chalk.yellow(`Server setup… :${chalk.blue('completed.')}`))
        }).catch((err) => {
          if (err) { return console.error(chalk.red('Failed. Gulpfile unavailable.', err)) }
        })
    }).then(() => {
      let packageJson = null
      const promises = []

      // TODO: FAILS AT THIS POINT.
      promises.push(arc.read(location))
      promises.push(fse.readJson(path.join('.', 'crust', 'package.json')))

      return Promise.all(promises)
        .then((values) => {
          const bookizArc = JSON.parse(values[0])
          packageJson = values[1]
          packageJson.name = projectname
          packageJson.author = `${bookizArc.username} <${bookizArc.email}> (https://bubblin.io/${bookizArc.username})`
          packageJson.homepage = `https://bubblin.io/${bookizArc.username}`
          packageJson.description = `Superbook: ${projectname} by ${bookizArc.username}`

          fse.outputFile(path.join('.', 'package.json'), JSON.stringify(packageJson, null, 2))
            .then(() => {
              console.log(chalk.yellow(`PackageJson configured… :${chalk.blue('preparing for installation.')}`))
            }).catch((err) => {
              if (err) return Error('Couldn\'t write package.json', err)
            })

          const bookrc = {}

          bookrc.name = projectname
          bookrc.type = templateName
          bookrc.has_page_numbers = false
          bookrc.cover = { punchline: '', toc: '', author_detail: '', colophon: '', synopsis: '' }
          bookrc.status = 'draft'
          bookrc.asset_url = '' // rawgit or cloudinary path
          bookrc.book_url = '';
          [bookrc.mode = { HTML: 'html', CSS: 'css', JS: 'js', HEAD: 'html' }] = [bookizArc.mode]

          return bookrc
        }).then(bookrc => {
          fse.outputFile(path.join('.', '.bookrc'), JSON.stringify(bookrc, null, 2))
            .then(() => {
              console.log(chalk.yellow(`Default bookrc values… :${chalk.blue('done.')}`))
            })
            .catch(err => {
              if (err) return new Error('Couldn\'t write .bookrc', err)
            })
          return bookrc.mode
        }).then(mode => {
          fse.ensureDir('manuscript')
            .then(() => {
              const startAt = 1
              const pages = leafs * 2

              addPages({ startAt, pages, mode })

              install(Object.keys(packageJson.dependencies), { stdio: 'inherit' }, function (err) {
                if (err) {
                  return console.error(chalk.red(`Could\n't install modules:\n${err.message}`))
                } else {
                  console.log(chalk.yellow(`Installing npm modules… :${chalk.blue('successful.')}`))
                }
              })
            }).catch((err) => {
              if (err) { return console.log(chalk.bold.red('Failed to write directory', err)) }
            })
        }).catch((err) => {
          if (err) { return console.log(chalk.red('Arcvalues & package json unavailable', err)) }
        })
    }).catch((err) => {
      if (err) { return console.log(chalk.red('Moving crust or template failed:', err)) }
    })
}
