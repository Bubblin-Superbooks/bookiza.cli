module.exports.render  = () => {
  	const shell = require('shelljs')
    const chalk = require('chalk')

	shell.exec(`gulp renderBook`)

	console.log(chalk.magenta('Build step was successful.'))
}


