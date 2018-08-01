(function (r) {
  'use strong'

  const fse = r('fs-extra')
  const chalk = r('chalk')

  fse.readFile('./MIT-license.txt', 'utf8', (err, data) => {
    if (err) {
      return Error('Couldn\'t read license information.')
    }
    console.log(chalk.keyword('orange')(data))
  })
})(require)
