function npmInstall() {
  // const chalk = require('chalk');
  const exec = require('executive');

  exec('npm i -S --silent');
}

module.exports.install = npmInstall;
