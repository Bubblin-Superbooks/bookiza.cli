(function (r) {
  'use strong'

  const fse = r('fs-extra')
  const chalk = r('chalk')
  const cl = require('chalkline')
  const terminalLink = require('terminal-link')
  const center = require('center-align')


  const link = terminalLink('https://bubblin.io/bookiza/docs/registration', 'https://bubblin.io/bookiza/docs/registration');
 
  cl.green()
  cl.blue()
  cl.red()

  fse.readFile('./license.txt', 'utf8', (err, data) => {
    if (err) {
      return Error('Couldn\'t read license information.')
    }
  
  console.log(center(chalk.keyword('orange')(data)))
  
  cl.white()

  console.log(chalk.whiteBright.bgBlack(`Welcome to creating responsive Superbooks with ${chalk.magentaBright.bgBlack('Bookiza Abelone')}!`))
  console.log(chalk.whiteBright.bgBlack(`NEXT STEP: Register Bookiza with: ${chalk.bold.redBright.bgBlack('$ bookiza register')} command using your Bubblin credentials.`))
  console.log(chalk.whiteBright.bgBlack(`Visit: ${chalk.blueBright.bgBlack(link)} to learn more.`))
  
  cl.green()
  cl.blue()
  cl.red()


  })
})(require)
