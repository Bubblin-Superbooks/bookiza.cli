function deletePage(removeAt, callback) {
    'use strong';

    const fsp = require('fs-promise');    
    const dateFormat = require('dateformat');
    const now = new Date();
    const timestamp = dateFormat(now, 'dddd-mmmm-dS-yyyy-hh-MM-ss-TT');
    const path = require('path');

    fsp.move(path.join('__dirname', '..', 'manuscript', `page-${removeAt}`), path.join('__dirname', '..', 'trash', `page-${removeAt}-${timestamp}`))
        .then(() => {
            if (typeof callback === 'function') {
                callback();
            }
        }).catch((err) => {
            if (err)
                return console.log('Something went wrong', err);
        });
    
}


module.exports.deletePage = deletePage;