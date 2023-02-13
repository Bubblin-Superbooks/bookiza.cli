import fse from 'fs-extra'
import chalk from 'chalk'

'use strong'


fse.readFile('./license.txt', 'utf8', (err, data) => {
  if (err) {
    return new Error('Couldn\'t read license information.')
  }
  console.log(chalk.magenta(data))
})

console.log(chalk.blue('Project is ready.'))
