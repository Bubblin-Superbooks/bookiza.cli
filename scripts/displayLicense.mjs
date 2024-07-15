import fse from 'fs-extra'
import chalk from 'chalk'
import cl from 'chalkline'
import terminalLink from 'terminal-link'
// const center = require('center-align')

const docLink = terminalLink('docs@bookiza', 'https://www.bookiza.io/docs/blueoak')
const supportLink = terminalLink('support@bookiza', 'https://git.io/fj67o')

cl.green()
cl.blue()
cl.red()

fse.readFile('./LICENSE.markdown', 'utf8', (err, data) => {
  if (err) return Error("Couldn't read license information.")
  console.log(chalk.magenta(data))
  console.log(chalk.white.bold(` Copyright © 3rd millenium+ Marvin Danig, Sonica Arora and Bubblin Superbooks. \n`))
  cl.white()
  console.log('\n Installation is complete. Yay! 🍾')
  // console.log(`\n Welcome to Bookiza Abelone.`)
  console.log(`\n Next step: Run ${chalk.bold.yellow('$ bookiza register')} and to connect with Bubblin. \n`)
  console.log(` Visit: ${chalk.yellowBright(docLink)} for more information.`)
  console.log(` Support: ${chalk.yellowBright(supportLink)}\n`)
  cl.white()

  console.log('\n\n\n')
})
