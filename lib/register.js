function register (options) {
  const chalk = require('chalk')
  const request = require('superagent')
  const path = require('path')
  const arc = require('arc-bookiza')
  const osHomedir = require('os-homedir')
  const fs = require('fs')
  const co = require('co')
  const prompt = require('co-prompt')

  let username = options.username // Defined above co for lexical scope into then().
  let password = options.password

  co(function * () {
    if (username === undefined) {
      username = yield prompt('username: ')
    }
    if (password === undefined) {
      password = yield prompt.password('password: ')
    }
  }).then(() => {
    // Code smell: Try using Promise.all instead.

    let location = path.join(__dirname, '..', '.bookizarc')

    arc.read(location)
      .then((data) => {
        let bookizArc = JSON.parse(data) // arc object

        let url = bookizArc.urls.registrationURL
        let method = 'post'

        // Request token.
        request[method](url)
          .send()
          .auth(username, password)
          .set('Accept', 'application/json')
          .end((err, res) => {
            if (!err && res.ok) {
              bookizArc.token = res.body.key
              bookizArc.username = res.body.username
              bookizArc.email = res.body.email

              fs.writeFileSync(path.join(osHomedir(), '.', '.bookizarc'), JSON.stringify(bookizArc, null, 2))

              console.log(chalk.bold.cyan('Registration successful'))
              process.exit(0)
            }

            let errorMessage

            if (res && res.status === 401) {
              errorMessage = 'Authentication failed! Bad username/password?'
            } else if (err) {
              errorMessage = err
            } else {
              errorMessage = res.text
            }
            console.error(chalk.red(errorMessage))
            process.exit(1)
          })
      }).catch((err) => {
        console.error(`Couldn't read BookizArc: ${err}`)
      })
  }).catch((err) => {
    console.error(err)
  })
}

module.exports.register = register
