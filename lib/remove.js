function removePage(removeAt) {
    'use strong';

    
    const chalk = require('chalk');
    const path = require('path');
    const manuscript = require(path.join('..', 'scripts', 'deletePage.js'));
    const stack = require(path.join('..', 'scripts', 'pushStackUp.js'));
    const fsp = require('fs-promise');

    const book = require('book-length');
    
    let bookLength = book.length();

    process.stdout.write(chalk.yellow(`Deleting page @[ ${chalk.blue(removeAt)} ]… :`));
    
    manuscript.deletePage(removeAt, () => {
        stack.pushStackUp(parseInt(removeAt), bookLength, () => {
            fsp.readJson(path.join('.', '.bookrc'))
                .then(json => {
                    let bookrc = json;
                    let mode = bookrc.mode;

                    const pulp = require(path.join('..', 'generators', 'addPages.js'));

                    pulp.addPages(bookLength, 1, mode); // 1 = number of pages.

                }).catch((err) => {
                    if (err) return console.log(chalk.red('Could not read book mode:', err));
                });

        });
    });

}

module.exports.removePage = removePage;
