function print () {
  'use strong'

  const path = require('path')
  const chalk = require('chalk')
  const osHomeDir = require('os').homedir()
  const arc = require('arc-bookiza')
  const location = path.join(osHomeDir, '.', '.bookizarc')

  arc.read(location)
    .then((data) => {
      const bookizArc = JSON.parse(data) // Arc object

      if (bookizArc.username !== '') {
        process.stdout.write(chalk.yellowBright(`${bookizArc.username}`) + chalk.gray(` <${bookizArc.email}>`) + chalk.yellow(`(https://bubblin.io/${bookizArc.username})`) + '\n')
        return true
      } else {
        console.error(chalk.red('Unregistered client. Try $ bookiza register'))
        return false
      }
    }).catch((err) => {
      if (err) { return console.log(chalk.red('Unregistered client:', err)) }
    })
}

module.exports.print = print
