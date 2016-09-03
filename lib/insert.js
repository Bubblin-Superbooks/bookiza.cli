function insertLeafs(insertAt, options) {
    'use strong';

    const path = require('path');
    const stack = require(path.join('..', 'scripts', 'pushStackDown.js'));
    const fsp = require('fs-promise');
    const chalk = require('chalk');

    let leafs = 1;

    if (options !== undefined && options.leafs % 1 === 0) {
        leafs = options.leafs;
    }

    stack.pushStackDown(insertAt, leafs, () => {

        fsp.readJson(path.join('.', '.bookrc'))
            .then(json => {
                let bookrc = json;
                let mode = bookrc.mode;

                const pulp = require(path.join('..', 'generators', 'addPages.js'));

                pulp.addPages(parseInt(insertAt), leafs * 2, mode);

            }).catch((err) => {
                if (err) return console.log(chalk.red('Could not read book mode:', err));
            });

    });

}

module.exports.insertLeafs = insertLeafs;
