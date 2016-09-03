function addLeafs(options) {
    'use strong';

    const co = require('co');
    const prompt = require('co-prompt');
    const path = require('path');
    const fsp = require('fs-promise');
    const chalk = require('chalk');
    const book = require('book-length');
    const pulp = require(path.join('..', 'generators', 'addPages.js'));

    co(function*() {
        let leafs;
        if (options !== undefined && options.leafs % 1 === 0) {
            leafs = options.leafs;
        } else {
            leafs = yield prompt('No. of leafs?: ');
        }
        return leafs;
    }).then(leafs => {
        fsp.readJson(path.join('.', '.bookrc'))
            .then((bookrc) => {

                let mode = bookrc.mode;

                process.stdout.write(chalk.yellow(`${ chalk.blue(JSON.stringify([mode.HTML, mode.CSS])) } : Adding [ ${chalk.magenta(leafs)} ] leaf(s)… : `));

                let startAt = book.length() + 1;
                
                pulp.addPages(startAt, leafs * 2, mode);  // Spawn a process?

            }).catch((err) => {
                if (err) return console.log(chalk.red('Could not read book mode:', err));
            });


    }).catch(err => {
        if (err) 
            return console.log(chalk.red('Adding leafs failed:', err));
    });
}

module.exports.addLeafs = addLeafs;