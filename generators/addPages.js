const path = require('path')
const fsp = require('fs-promise')
const chalk = require('chalk')

function addPages (startAt, pages, mode) {
  let htmlExt = mode.HTML || 'html'
  let headExt = mode.HEAD || 'html'
  let cssExt = mode.CSS || 'css'
  let javascriptExt = mode.JS || 'js'

  let bodyTemplate = ''

  fsp.readFile(path.join('.', 'templates', 'body.html'), { encoding: 'utf-8' })
    .then((content) => {
      process.stdout.write(chalk.yellow(`generating [ ${chalk.magenta(pages)} ] blank page(s)… :`))

      bodyTemplate = content; // Set bodyTemplate for next promise. Ugly :(

      // Blank manuscript structure:
      let blankPages = []

      for (let i = startAt, endAt = startAt + pages; i < endAt; i++) {
        let pageDir = path.join('.', 'manuscript', `page-${i}`)

        let thisDir = fsp.mkdirs(pageDir); // promise { pending }

        blankPages.push(thisDir)
      }

      return Promise.all(blankPages)
    })
    .then(() => {

      let pendingWrites = []; // TODO: Consider fsp.copy instead of per page I/O.

      for (let i = startAt, endAt = startAt + pages; i < endAt; i++) {
        let styleFile = path.join('.', 'manuscript', `page-${i}`, `style.${cssExt}`)
        let htmlFile = path.join('.', 'manuscript', `page-${i}`, `body.${htmlExt}`)

        let thisWrite = fsp.writeFile(styleFile, '')
        let thatWrite = fsp.writeFile(htmlFile, bodyTemplate)

        pendingWrites.push(thisWrite)
        pendingWrites.push(thatWrite)
      }

      return Promise.all(pendingWrites)
    }).then(() => {
    return process.stdout.write(`${chalk.blue(' done.')}` + '\n')
  }).catch((err) => {
    if (err) return console.log("Couldn't create pages", err)
    throw err
  })
}

module.exports.addPages = addPages
