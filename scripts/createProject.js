function createProject (projectname, leafs, templateName) {
  const fse = require('fs-extra')
  const chalk = require('chalk')

  fse.ensureDir(projectname)
    .then(() => {
      const shell = require('shelljs')
      shell.cd(projectname) // Duration of function. See shelljs documentation.
    }).then(() => {
      setUp(projectname, leafs, templateName)
    }).catch((err) => {
      if (err) { return console.log(chalk.bold.red('Failed to create project', err)) }
    })
}

function setUp (projectname, leafs, templateName) {
  const fse = require('fs-extra')
  const path = require('path')
  const chalk = require('chalk')

  fse.ensureDir('assets')
    .then(() => {
      const make = require(path.join('..', 'helpers', 'makeDir.js'))
      make.directories(['css', 'javascript', 'images'], 'assets')
      make.directories(['trash', 'cover', 'build'])
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
      console.log(chalk.yellow(`.gitignoring /build /node_modules… :${chalk.blue('done.')}`))
    }).catch((err) => {
      if (err) { return console.error(chalk.red('.gitignore not initialized.'), err) }
    })

  fse.outputFile(path.join('.', 'license.txt'), '')
    .then(() => {
      console.log(chalk.yellow(`License.txt… :${chalk.blue('added.')}`))
    }).catch((err) => {
      if (err) { return console.error(chalk.red('License not initialized.'), err) }
    })

  let promises = []

  promises.push(
    fse.copy(path.join(__dirname, '..', 'templates', templateName), path.join('.', 'templates'))
      .then(() => {
        return console.log(chalk.yellow(`Applying a ${chalk.magenta(`${templateName}`)} layout… :${chalk.blue('success.')}`))
      }).catch(err => {
        if (err) { return console.error(chalk.red('Could\'nt copy templates folder', err)) }
      })
  )

  promises.push(
    fse.copy(path.join(__dirname, '..', 'crust'), path.join('.', 'crust'))
      .then(() => {
        console.log(chalk.yellow(`Mobilizing crust… :${chalk.blue('success.')}`))
      }).catch((err) => {
        if (err) { return console.error(chalk.red('Copying crust failed', err)) }
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
      const osHomeDir = require('os').homedir()
      const arc = require('arc-bookiza')
      const location = path.join(osHomeDir, '.', '.bookizarc')

      let packageJson = null
      let promises = []

      promises.push(arc.read(location))

      promises.push(fse.readJson(path.join('.', 'crust', 'package.json')))

      return Promise.all(promises)
        .then((values) => {
          let bookizArc = JSON.parse(values[0])
          packageJson = values[1]

          packageJson.name = projectname
          packageJson.author = `${bookizArc.username} <${bookizArc.email}> (https://bubblin.io/${bookizArc.username})`
          packageJson.homepage = `https://bubblin.io/${bookizArc.username}`
          packageJson.description = `Superbook: ${projectname} by ${bookizArc.username}`

          fse.outputFile(path.join('.', 'package.json'), JSON.stringify(packageJson, null, 2))
            .then(() => {
              console.log(chalk.yellow(`PackageJson configured… :${chalk.blue('standing by for installation.')}`))
            }).catch((err) => {
              if (err) return Error('Couldn\'t write package.json', err)
            })

          let bookrc = {}

          bookrc.name = projectname

          bookrc.type = templateName

          bookrc.has_page_numbers = false;

          [bookrc.mode = { 'HTML': 'html', 'CSS': 'css', 'JS': 'js', 'HEAD': 'html' }] = [bookizArc.mode]

          return bookrc
        }).then(bookrc => {
          fse.outputFile(path.join('.', '.bookrc'), JSON.stringify(bookrc, null, 2))
            .then(() => {
              console.log(chalk.yellow(`Setting bookrc values… :${chalk.blue('done.')}`))
            })
            .catch(err => {
              if (err) return new Error('Couldn\'t write .bookrc', err)
            })
          return bookrc.mode
        }).then(mode => {
          fse.ensureDir('manuscript')
            .then(() => {
              const pulp = require(path.join('..', 'generators', 'addPages.js'))
              let startAt = 1
              let pages = leafs * 2

              pulp.addPages({ startAt, pages, mode })

              const install = require('spawn-npm-install')

              install(Object.keys(packageJson.dependencies), { stdio: 'inherit' }, function (err) {
                if (err) {
                  return console.error(chalk.red(`Could\n't install modules:\n${err.message}`))
                } else {
                  console.log(chalk.yellow(`Installed npm modules… :${chalk.blue('successfully.')}`))
                  const git = require('git-bookiza')
                  git.init()

                  // process.exit(1)
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

module.exports.create = createProject
