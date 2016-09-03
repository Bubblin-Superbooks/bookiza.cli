function pushStackDown(insertAt, leafs, callback) {
    const path = require('path');
    const book = require('book-length');
    const chalk = require('chalk');
    // const ProgressBar = require('progress');

    let bookLength = book.length();
    let pages = leafs * 2;

    process.stdout.write(chalk.yellow('Shaking stack… [ DOWN ]: '));



    for (let pageIndex = bookLength; pageIndex >= insertAt; pageIndex--) {
        mv(path.join('__dirname', '..', 'manuscript', `page-${pageIndex}`), path.join('__dirname', '..', 'manuscript', `page-${pageIndex + pages}`));
    }

    // const bar = new ProgressBar(':bar', { total: 10 });

    // const timer = setInterval(() => {
    //     bar.tick();
    //     if (bar.complete) {
    //         process.stdout.write(chalk.blue(' Done! : '));
    //         clearInterval(timer);
    //     }
    // }, 100);

    if (typeof callback === "function") {
        callback();
    }
}

module.exports.pushStackDown = pushStackDown;
