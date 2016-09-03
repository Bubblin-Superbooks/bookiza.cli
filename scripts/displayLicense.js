+!~-(function(r) {
    'use strong';
    
    const fs = r('fs');
    const chalk = r('chalk');

    fs.readFile('./MIT-license.txt', 'utf8', (err, content) => {
        console.log(chalk.white(content));
    });

})(require);
