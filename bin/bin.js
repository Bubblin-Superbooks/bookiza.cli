#! /usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')

program
  .command('new <projectname>')
  .alias('n')
  .description('New book (Setup manuscript)')
  .option('-l, --leafs <number_of_leafs>', 'tentative number of leafs')
  .option('-t, --template <template>', 'Use: [comics, magazine, novel, text, super]') // TODO: fetch() template.
  .action((projectname, options) => {
    const project = require(path.join('..', 'lib', 'new.js'))

    project.initialize(projectname, options)
  }).on('--help', () => {
    console.log('  Examples:')
    console.log()
    console.log('    $ bookiza new Sun-And-Sand -l 6')
    console.log('    $ bookiza new Live-Action-Hero -l 5')
    console.log(chalk.bold.bgGreen('    $ b n Wuthering-Heights -l 100'))
    console.log()
  })

// Add leaf(ves)
program
  .command('add')
  .alias('a')
  .description('Add leaf(s) to the stack (End of book).')
  .option('-l, --leafs <number_of_leafs>', 'Number of leafs')
  .action(options => {
    const manuscript = require(path.join('..', 'lib', 'add.js'))
    manuscript.addLeafs(options)
  }).on('--help', () => {
    console.log('  Examples:')
    console.log()
    console.log('    $ bookiza add -l 5')
    console.log('    $ b a -l 5')
    console.log()
  })

// Insert leaf
program
  .command('insert <insertAt>')
  .alias('i')
  .description('Insert leaf(s) into the stack (In between book)')
  .option('-l, --leafs <number_of_leafs>', 'Number of leafs')
  .action((insertAt, options) => {
    const manuscript = require(path.join('..', 'lib', 'insert.js'))
    manuscript.insertLeafs(insertAt, options)
  }).on('--help', () => {
    console.log('  Examples:')
    console.log()
    console.log('    $ bookiza insert 15 -l 4')
    console.log('    $ b i 24 --leafs 2')
    console.log()
  })

// Remove page
program
  .command('remove <removeAt>')
  .alias('r')
  .description('Remove page (not leaf!) and append a blank one.')
  .action((removeAt, options) => {
    const manuscript = require(path.join('..', 'lib', 'remove.js'))
    manuscript.removePage(removeAt)
  }).on('--help', () => {
    console.log('  Examples:')
    console.log()
    console.log('    $ bookiza remove 9')
    console.log('    $ b r 9')
    console.log()
  })

// Move page
program
  .command('move <moveFrom> <moveTo>')
  .alias('m')
  .description('Move a page (not leaf!) from A to B.')
  .action((moveFrom, moveTo, options) => {
    const manuscript = require(path.join('..', 'lib', 'move.js'))
    manuscript.movePage(moveFrom, moveTo)
  }).on('--help', () => {
    console.log('  Examples:')
    console.log()
    console.log('    $ bookiza move 9 17')
    console.log('    $ b m 9 17')
    console.log()
  })


// Clip leaves (End of book)
program
  .command('clip')
  .alias('c')
  .description('Clip leaf(s) off the stack (End of book).')
  .option('-l, --leafs <number_of_leafs>', 'Number of leafs')
  .action(options => {
    const manuscript = require(path.join('..', 'lib', 'clip.js'))
    manuscript.clip(options)
  }).on('--help', () => {
    console.log('  Examples:')
    console.log()
    console.log('    $ bookiza clip -l 2')
    console.log('    $ b c -l 2')
    console.log()
  })

program
  .command('length')
  .alias('l')
  .description('Book length')
  .action(() => {
    try {
      const book = require('book-length')
      console.log(book.length())
    } catch (ex) {
      console.error(ex.stack)
    }
  }).on('--help', () => {
    console.log('  Examples:')
    console.log()
    console.log('  $ bookiza length')
    console.log('  $ bookiza l')
    console.log('  $ b l')
    console.log()
  })

program
  .command('publish')
  .alias('p')
  .option('-t, --token <api_token>', 'Author api_token')
  .description('Publish book')
  .action(options => {
    const book = require(path.join('..', 'lib', 'publish.js'))
    book.publish(options)
  }).on('--help', () => {
    console.log('  Examples:')
    console.log()
    console.log('    $ bookiza publish')
    console.log('    $ b p')
    console.log()
  })

// Render pages w/o starting the server.
program
  .command('render')
  .alias('x')
  .description('Build manuscript')
  .action(options => {
    const manuscript = require(path.join('..', 'lib', 'render.js'))
    manuscript.render()
  }).on('--help', () => {
    console.log('  Examples:')
    console.log()
    console.log('    $ bookiza render')
    console.log('    $ b x')
    console.log()
  })


// Render pages and start local server
program
  .command('server')
  .alias('s')
  .option('-p, --port <port>', 'Optional port number')
  .description('Start server')
  .action(options => {
    const server = require(path.join('..', 'lib', 'server.js'))

    server.start(options)
  }).on('--help', () => {
    console.log('  Examples:')
    console.log()
    console.log('     $ bookiza server')
    console.log('     $ b s -p 8080')
    console.log()
  })

// Book status
program
  .command('status')
  .description('Check status')
  .action(() => {
    const git = require('git-bookiza')
    git.status()
  }).on('--help', () => {
    console.log('  Examples:')
    console.log()
    console.log('    $ git status')
    console.log()
  })

// Push changes to repo
program
  .command('push')
  .description('Push changes')
  .action(() => {
    const git = require('git-bookiza')
    git.push()
  }).on('--help', () => {
    console.log('  Examples:')
    console.log()
    console.log('    $ git push origin master')
    console.log()
  })

program
  .command('update')
  .alias('u')
  .description('Update Bookiza CLI')
  .action(() => {
    const packageUpdater = require(path.join('npm-update-module'))
    packageUpdater.update('bookiza')
  }).on('--help', () => {
    console.log('  Examples:')
    console.log()
    console.log('    $ bookiza update')
    console.log('    $ b u')
    console.log()
  })

// Update bookiza
program
  .command('register')
  .alias('z')
  .description('Register bookiza')
  .option('-u, --username <username>', 'Bubblin\'s username/email')
  .option('-p, --password <password>', 'Bubblin\'s password')
  .action(options => {
    const client = require(path.join('..', 'lib', 'register.js'))
    client.register(options)
  }).on('--help', () => {
    console.log('  Examples:')
    console.log()
    console.log('    $ bookiza register')
    console.log('    $ b z')
    console.log()
  })

// Registered as?
program
  .command('whoami')
  .alias('w')
  .description('Print whoami@bookizarc')
  .action(options => {
    const client = require(path.join('..', 'lib', 'whoami.js'))
    client.print()
  }).on('--help', () => {
    console.log('  Examples:')
    console.log()
    console.log('    $ bookiza whoami')
    console.log('    $ b w')
    console.log()
  })

// Catchall
program
  .command('*')
  .on('--help', () => {
    console.log('  Examples:')
    console.log()
    console.log('    $ bookiza <cmd> [options]')
    console.log()
  })

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json')).toString())

program
  .version(packageJson.version)
  .option('-v, --version', 'output the version number')
  .parse(process.argv)

if (!program.args.length) {
  program.help()
}
