function render () {
  	const shell = require('shelljs')
    const chalk = require('chalk')

	shell.exec(`gulp renderBook`)

	console.log(chalk.magenta('Manuscript rebuilt successfully!'))
}

module.exports.render = render
