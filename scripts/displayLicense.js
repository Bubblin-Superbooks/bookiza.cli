(function (r) {
  'use strong'

  const fse = r('fs-extra')
  const chalk = r('chalk')
  const cl = require('chalkline')
  const terminalLink = require('terminal-link')
  const center = require('center-align')


  const docLink = terminalLink('https://bubblin.io/bookiza/docs/registration', 'https://bubblin.io/bookiza/docs/registration');

  const supportLink = terminalLink('https://github.com/bookiza/bookiza.cli/issues', 'https://github.com/bookiza/bookiza.cli/issues');
 
  cl.green()
  cl.blue()
  cl.red()

  fse.readFile('./license.txt', 'utf8', (err, data) => {
    if (err) return Error('Couldn\'t read license information.')
    console.log(center(chalk.keyword('orange')(data)))
    cl.white()
    console.log('\n Hurray!, installation is complete!')
    console.log(`\n Welcome to Bookiza Abelone—the book baking tool for web.`)
    console.log(` Next step is to register your Bookiza Client. Use ${chalk.bold.redBright('$ bookiza register')} to pass your Bubblin credentials.`)
    console.log(` Visit: ${chalk.blue(docLink)} for more information.`)
    console.log(` Support at ${chalk.blue(supportLink)}\n`)
    cl.white()

    console.log('\n\n\n')
  })
})(require)
