function initialize (projectname, options) {
  'use strong'

  const co = require('co')
  const prompt = require('co-prompt')
  const check = require('check-types')
  const chalk = require('chalk')
  const path = require('path')
  const isSafePositiveInteger = require('is-positive-integer').isSafePositiveInteger

  // maxSafeInteger for older node engines
  // const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991

  // Restrict length of book to 2000 pages.
  const LEAF_LIMIT = 500

  // Generator
  co(function * () {
    let leafs = options.leafs

    if (!isSafePositiveInteger(parseInt(leafs))) {
      leafs = yield prompt('Number of leafs: ')

      if (!isSafePositiveInteger(parseInt(leafs))) {
        leafs = 2
      }
    }

    if (check.greater(parseInt(leafs), LEAF_LIMIT)) {
      leafs = 1000 // Restrict booklength and warn user.
      console.log(chalk.yellow('Restricting book length to 1000 leafs (or 2000 pages).'))
    }

    return leafs
  }).then(leafs => {
    let template = options.template

    if (template === undefined || check.not.includes(['comics', 'magazine', 'novel', 'text', 'super', 'photo'], template)) {
      template = 'blank'
    }

    console.log(`${`${chalk.yellow('Initializing… ')} [ manuscript=${chalk.magenta(`${projectname}`)}`} | leafs=${chalk.magenta(`${leafs}`)} | template=${chalk.magenta(`${template}`)} ]`)

    const project = require(path.join('..', 'scripts', 'createProject.js'))

    project.create(projectname, leafs, template)
  }).catch((err) => {
    if (err) return console.error(chalk.bold.red('Failed to initialize new project', err))
  })
}

module.exports.initialize = initialize
