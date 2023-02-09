#! /usr/bin/env node

import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import book from 'book-length'
import { Command } from 'commander'

import createNewProject from '../lib/new.js'

/* Removing all unsupported methods for now. */
// const manuscript = require(path.join('..', 'lib', 'add.js'))
// const manuscript = require(path.join('..', 'lib', 'insert.js'))
// const manuscript = require(path.join('..', 'lib', 'remove.js'))
// const manuscript = require(path.join('..', 'lib', 'move.js'))
// const manuscript = require(path.join('..', 'lib', 'clip.js'))
// const book = require(path.join('..', 'lib', 'publish.js'))
// const manuscript = require(path.join('..', 'lib', 'render.js'))
// const serve = require(path.join('..', 'lib', 'server.js'))
// const client = require(path.join('..', 'lib', 'register.js'))
// const client = require(path.join('..', 'lib', 'whoami.js'))

/* __dirname isn't available inside ES modules: */
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const program = new Command()
program
  .command('new <projectname>')
  .alias('n')
  .description('New book (Setup manuscript)')
  .option('-l, --leafs <number_of_leafs>', 'tentative number of leafs')
  .option('-t, --template <template>', 'Use: [comics, magazine, novel, text, super]') // TODO: 1. fetch() templates. 2. Implement super template with first five pages
  .action((projectname, options) => {
    createNewProject(projectname, options)
  }).on('--help', () => {
    console.log('  Examples:')
    console.log()
    console.log('    $ bookiza new my-book-name -l 60')
    console.log('    $ b new my-live-book --leafs 15')
    console.log(chalk.bold.greenBright('    $ b n wuthering-heights -l 100 -t novel'))
    console.log()
  })

// // Add leaf(ves)
// program
//   .command('add')
//   .alias('a')
//   .description('Add leaf(s) to the stack (End of book).')
//   .option('-l, --leafs <number_of_leafs>', 'Number of leafs')
//   .action(options => {
//     addLeafs(options)
//   }).on('--help', () => {
//     console.log('  Examples:')
//     console.log()
//     console.log('    $ bookiza add -l 5')
//     console.log('    $ b a -l 5')
//     console.log()
//   })

// // Insert leaf
// program
//   .command('insert <insertAt>')
//   .alias('i')
//   .description('Insert leaf(s) into the stack (In between book)')
//   .option('-l, --leafs <number_of_leafs>', 'Number of leafs')
//   .action((insertAt, options) => {
//     insertLeafs(insertAt, options)
//   }).on('--help', () => {
//     console.log('  Examples:')
//     console.log()
//     console.log('    $ bookiza insert 15 -l 4')
//     console.log('    $ b i 24 --leafs 2')
//     console.log()
//   })

// // Remove page
// program
//   .command('remove <removeAt>')
//   .alias('r')
//   .description('Remove page (not leaf!) and append a blank one.')
//   .action((removeAt, options) => {
//     removePage(removeAt)
//   }).on('--help', () => {
//     console.log('  Examples:')
//     console.log()
//     console.log('    $ bookiza remove 9')
//     console.log('    $ b r 9')
//     console.log()
//   })

// // Move page
// program
//   .command('move <moveFrom> <moveTo>')
//   .alias('m')
//   .description('Move a page (not leaf!) from A to B.')
//   .action((moveFrom, moveTo, options) => {
//     movePage(moveFrom, moveTo)
//   }).on('--help', () => {
//     console.log('  Examples:')
//     console.log()
//     console.log('    $ bookiza move 9 17')
//     console.log('    $ b m 9 17')
//     console.log()
//   })

// // Clip leaves (End of book)
// program
//   .command('clip')
//   .alias('c')
//   .description('Clip leaf(s) off the stack (End of book).')
//   .option('-l, --leafs <number_of_leafs>', 'Number of leafs')
//   .action(options => {
//     clip(options)
//   }).on('--help', () => {
//     console.log('  Examples:')
//     console.log()
//     console.log('    $ bookiza clip -l 2')
//     console.log('    $ b c -l 2')
//     console.log()
//   })

// program
//   .command('length')
//   .alias('l')
//   .description('Book length')
//   .action(() => {
//     try {
//       console.log(chalk.greenBright(`Book length: ${chalk.magentaBright(book.length())}`))
//     } catch (ex) {
//       console.error(ex.stack)
//     }
//   }).on('--help', () => {
//     console.log('  Examples:')
//     console.log()
//     console.log('  $ bookiza length')
//     console.log('  $ bookiza l')
//     console.log('  $ b l')
//     console.log()
//   })

// program
//   .command('publish')
//   .alias('p')
//   .option('-t, --token <api_token>', 'Author api_token')
//   .description('Publish book')
//   .action(options => {
//     book.publish(options)
//   }).on('--help', () => {
//     console.log('  Examples:')
//     console.log()
//     console.log('    $ bookiza publish')
//     console.log('    $ b p')
//     console.log()
//   })

// // Render pages w/o starting the server.
// program
//   .command('render')
//   .alias('x')
//   .alias('build')
//   .description('Build manuscript')
//   .action(options => {
//     renderPages()
//   }).on('--help', () => {
//     console.log('  Examples:')
//     console.log()
//     console.log('    $ bookiza render')
//     console.log('    $ b x')
//     console.log('    $ bookiza build')
//     console.log()
//   })

// // Render pages and start local server
// program
//   .command('serve')
//   .alias('s')
//   .option('-p, --port <port>', 'Optional port number')
//   .description('Start server')
//   .action(options => {
//     server.start(options)
//   }).on('--help', () => {
//     console.log('  Examples:')
//     console.log()
//     console.log('     $ bookiza serve')
//     console.log('     $ b s -p 8080')
//     console.log()
//   })

// // Register Bookiza client with Bubblin
// program
//   .command('register')
//   .alias('z')
//   .description('Register bookiza')
//   .option('-u, --username <username>', 'Bubblin\'s username/email')
//   .option('-p, --password <password>', 'Bubblin\'s password')
//   .action(options => {
//     client.register(options)
//   }).on('--help', () => {
//     console.log('  Examples:')
//     console.log()
//     console.log('    $ bookiza register')
//     console.log('    $ b z')
//     console.log()
//   })

// // Registered as?
// program
//   .command('whoami')
//   .alias('w')
//   .description('Print whoami@bookizarc')
//   .action(options => {
//     client.print()
//   }).on('--help', () => {
//     console.log('  Examples:')
//     console.log()
//     console.log('    $ bookiza whoami')
//     console.log('    $ b w')
//     console.log()
//   })

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
  .version(packageJson.version, '-v, --version', 'New version @bookiza')
  .parse(process.argv)

if (!program.args.length) {
  program.help()
}
