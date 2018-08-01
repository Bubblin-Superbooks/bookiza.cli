function print () {
  'use strong'

  const path = require('path')
  const chalk = require('chalk')
  const osHomedir = require('os-homedir')
  const arc = require('arc-bookiza')
  const location = path.join(osHomedir(), '.', '.bookizarc')

  arc.read(location)
    .then((data) => {
      const bookizArc = JSON.parse(data) // Arc object

      if (bookizArc.username !== '') {
        process.stdout.write(chalk.magenta(`${bookizArc.username}`) + chalk.gray(` <${bookizArc.email}>`) + chalk.yellow(`(https://bubblin.io/${bookizArc.username})`) + '\n')
        return true
      } else {
        console.error(chalk.red('Unregistered client. Try $ bookiza register'))
        return false
      }
    }).catch((err) => {
      if (err) { return console.log('Couldn\'t read bookizarc values', err) }
    })
}

module.exports.print = print
