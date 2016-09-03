function makeDir(dirsArray, parentDir, callback) {
    const path = require('path');
    const fs = require('fs');
    const chalk = require('chalk');

    dirsArray.forEach(dirName => {
        if (parentDir === undefined) {
            fs.mkdirSync(dirName);
        } else {
            fs.mkdirSync(path.join(parentDir, dirName));
        }
    });

    if (typeof callback === "function") {
        callback();
    }
}

module.exports.directories = makeDir;
