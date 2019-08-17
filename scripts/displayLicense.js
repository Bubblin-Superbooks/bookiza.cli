(function (r) {
  'use strong'

  const fse = r('fs-extra')
  const chalk = r('chalk')
  const cl = require('chalkline')
  const terminalLink = require('terminal-link')
  const center = require('center-align')


  const docLink = terminalLink('docs@bookiza', 'https://bubblin.io/bookiza/docs/registration')
  const supportLink = terminalLink('support@bookiza', 'https://git.io/fj67o')

  cl.green()
  cl.blue()
  cl.red()

  fse.readFile('./license.txt', 'utf8', (err, data) => {
    if (err) return Error('Couldn\'t read license information.')
    console.log(center(chalk.keyword('orange')(data)))
    cl.white()
    console.log('\n Installation complete. Yay!')
    // console.log(`\n Welcome to Bookiza Abelone.`)
    console.log(`\n Next step: Run ${chalk.bold.yellow('$ bookiza register')} and pass your Bubblin credentials. \n`)
    console.log(` Visit: ${chalk.blue(docLink)} for more information.`)
    console.log(` Support: ${chalk.blue(supportLink)}\n`)
    cl.white()

    console.log('\n\n\n')
  })
})(require)
