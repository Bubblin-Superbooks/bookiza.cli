function publish (options) {
  // TODO: Get cover attributes up here.

  'use strong'

  const chalk = require('chalk')
  const request = require('superagent')
  const path = require('path')
  const osHomedir = require('os-homedir')
  const fs = require('fs')
  const jsonfile = require('jsonfile')
  const manuscript = require('book-length')
  const arc = require('arc-bookiza')

  const location = path.join(osHomedir(), '.', '.bookizarc')

  arc.read(location)
    .then(data => {
      const bookizArc = JSON.parse(data) // Arc object
      if (bookizArc.token === '') {
        throw new Error('ArcToken unavailable!')
      }
      initializeBook(bookizArc)
    })
    .catch(err => {
      console.log(chalk.bold.red('Unregistered client'))
      console.log(chalk.bold.cyan('Try $ bookiza register --help'))
      console.log(err)
    })

  function initializeBook (bookizArc) {
    const file = '.bookrc'

    jsonfile.readFile(file, (err, bookrc) => {
      if (err) {
        throw new Error('Couldn\'t read the arc.')
      }

      if (!(bookrc.hasOwnProperty('book_id'))) {
        const method = 'post'
        requestBookId(method, bookizArc, bookrc, options.token)
      } else {
        pushBook(bookizArc, bookrc, options.token)
      }
    })
  }

  function requestBookId (method, bookizArc, bookrc, token = bookizArc.token) {
    if (token === undefined) {
      console.log(chalk.red('Cannot proceed without API_token'))
      return
    }

    const url = bookizArc.urls.baseURL

    request[method](url)
      .send()
      .set('Accept', 'application/json')
      .set('Accept', 'application/bookiza.bubblin.v2')
      .set('Authorization', `Token token=${token}`)
      .end((err, res) => {
        if (!err && res.ok && res.body.status === 201 && res.body.id !== null) {
          bookrc.book_id = res.body.id
          fs.writeFileSync('.bookrc', JSON.stringify(bookrc, null, 2))
          pushBook(bookizArc, bookrc)
        } else {
          let errorMessage
          if (res && res.body.status === 401) {
            errorMessage = 'Authentication failed! Bad username/password?'
          } else if (res.body.status === 403) {
            errorMessage = 'Submission unauthorized!'
          } else {
            errorMessage = res.text
          }
          console.error(chalk.red(errorMessage))
          process.exit(1)
        }
      })
  }

  function pushBook (bookizArc, bookrc) {
    const book = {}

    book.title = bookrc.name || 'Untitled'
    book.has_page_numbers = bookrc.has_page_numbers || 'false'
    book.id = bookrc.book_id

    const COMPONENTS = [
      { name: 'HEAD', path: 'head.html' },
      { name: 'HTML', path: 'body.html' },
      { name: 'CSS', path: 'style.css' },
      { name: 'JS', path: 'script.js' }
    ]

    const template = {}

    for (const templateIndex in COMPONENTS) {
      const templateComponentPath = path.join('build', 'templates', COMPONENTS[templateIndex].path)
      if (fs.existsSync(templateComponentPath)) {
        template[COMPONENTS[templateIndex].name] = fs.readFileSync(templateComponentPath, 'utf-8').toString()
      }
    }

    book.template_attributes = template

    const length = manuscript.length()

    let pages = [] // Array of Page Objects

    const PAGES_CHUNK_SIZE = 50

    let batchStart = 1
    let batchEnd = length < PAGES_CHUNK_SIZE ? length : PAGES_CHUNK_SIZE

    let requestStatus = []

    do {
      for (let pageNo = batchStart; pageNo <= batchEnd; pageNo++) {
        const page = {}

        page.book_id = book.id

        page.page_no = pageNo
        for (const index in COMPONENTS) {
          const componentPath = path.join('build', 'manuscript', `page-${pageNo}`, COMPONENTS[index].path)
          if (fs.existsSync(componentPath)) {
            page[COMPONENTS[index].name] = fs.readFileSync(componentPath, 'utf-8').toString()
          }
        }
        pages.push(page)
      }

      book.pages_attributes = pages

      const bookJson = {}

      bookJson.book = book
      bookJson.length = length

      const url = bookizArc.urls.baseURL + book.id
      const token = bookizArc.token
      const method = 'patch'

      request[method](url)
        .send(encodeURI(JSON.stringify(bookJson)))
        .set('Accept', 'application/json')
        .set('Accept', 'application/bookiza.bubblin.v2')
        .set('Authorization', `Token token=${token}`)
        .set('gzip', 'true')
        .end((err, res) => {
          process.stdout.write(chalk.bold.blue('==='))

          requestStatus.push(1)

          if (batchStart > length && batchEnd === length) {
            printComplete()
          }

          if (!(!err && res.ok && res.body.status === 200)) {
            let errorMessage
            if (res && res.body.status === 401) {
              errorMessage = 'Authentication failed! Bad username/password?'
            } else if (res.body.status === 403) {
              errorMessage = 'Submission unauthorized!'
            } else {
              errorMessage = res.text
            }
            console.error(chalk.red(errorMessage))
            process.exit(1)
          }
        })

      batchStart = batchEnd + 1
      batchEnd = (batchEnd + PAGES_CHUNK_SIZE) > length ? length : (batchEnd + PAGES_CHUNK_SIZE)

      pages = []
    } while (batchStart <= length)

    function float2int (value) {
      return value | 0
    }

    function printComplete () {
      if (requestStatus.every(elem => elem === 1) && requestStatus.length === float2int(length / PAGES_CHUNK_SIZE) + 1) {
        console.log(chalk.bold.cyan(' Done! 100% upload complete.'))
        console.log(chalk.bold.yellow('Manuscript published successfully.'))
      }
    }
  }
}

module.exports.publish = publish
