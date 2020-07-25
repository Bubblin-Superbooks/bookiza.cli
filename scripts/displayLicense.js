((r) => {
  'use strong'

  const fse = r('fs-extra')
  const chalk = r('chalk')
  const cl = require('chalkline')
  const terminalLink = require('terminal-link')
  const center = require('center-align')


  const docLink = terminalLink('docs@bookiza', 'https://www.bookiza.io/docs/blueoak')
  const supportLink = terminalLink('support@bookiza', 'https://git.io/fj67o')

  cl.green()
  cl.blue()
  cl.red()

  fse.readFile('./LICENSE.markdown', 'utf8', (err, data) => {
    if (err) return Error('Couldn\'t read license information.')
    console.log(chalk.keyword('magenta')(data))
    console.log(chalk.bold.white(` Copyright © 3rd millenium+ Marvin Danig, Sonica Arora and Bubblin Superbooks. \n`))
    cl.white()
    console.log('\n Installation is complete. Yay! 🍾')
    // console.log(`\n Welcome to Bookiza Abelone.`)
    console.log(`\n Next step: Run ${chalk.bold.yellow('$ bookiza register')} and pass your Bubblin credentials. \n`)
    console.log(` Visit: ${chalk.keyword('orange')(docLink)} for more information.`)
    console.log(` Support: ${chalk.keyword('orange')(supportLink)}\n`)
    cl.white()

    console.log('\n\n\n')
  })
})(require)