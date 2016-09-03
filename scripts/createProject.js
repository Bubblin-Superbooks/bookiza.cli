function createProject(projectname, leafs, templateName) {
    const fsp = require('fs-promise');
    const chalk = require('chalk');

    fsp.mkdirs(projectname)
        .then(() => {
            const shell = require('shelljs');
            shell.cd(projectname); // Duration of function. See shelljs documentation.

        }).then(() => {
            setUp(projectname, leafs, templateName);

        }).catch((err) => {
            if (err)
                return console.log(chalk.bold.red('Failed to create project', err));
        });
}

function setUp(projectname, leafs, templateName) {
    const fsp = require('fs-promise');
    const path = require('path');
    const chalk = require('chalk');

    fsp.mkdirs('assets')
        .then(() => {
            const make = require(path.join('..', 'helpers', 'makeDir.js'));
            make.directories(['css', 'javascript', 'images'], 'assets');
            make.directories(['trash', 'cover', 'build']);

        }).catch(err => {
            if (err)
                return console.log(chalk.bold.red('Failed to create subdirectories…', err));
        });

    fsp.writeFile(path.join('.', 'README.md'), projectname)
        .then(() => {
            console.log(chalk.yellow(`README initialization… :${chalk.blue('success.')}`));
        }).catch((err) => {
            if (err)
                return console.error(chalk.red('README not initialized.'), err);
        });

    fsp.writeFile(path.join('.', '.gitignore'), 'node_modules\nbuild\n')
        .then(() => {
            console.log(chalk.yellow(`.gitignoring /build /node_modules… :${chalk.blue('done.')}`));
        }).catch((err) => {
            if (err)
                return console.error(chalk.red('.gitignore not initialized.'), err);
        });

    fsp.writeFile(path.join('.', 'license.txt'), '')
        .then(() => {
            console.log(chalk.yellow(`License.txt… :${chalk.blue('added.')}`));
        }).catch((err) => {
            if (err)
                return console.error(chalk.red('License not initialized.'), err);
        });


    let promises = [];

    promises.push(
            fsp.copy(path.join(__dirname, '..', 'templates', templateName), path.join('.', 'templates'))
            .then(() => {
                    return console.log(chalk.yellow(`Applying a ${chalk.magenta(`${templateName}`)} layout… :${chalk.blue('success.')}`)); 
            }).catch((err) => { 
                if (err)
                    return console.error(chalk.red('Could\'nt copy templates folder', err));
            })
    );

    promises.push(
        fsp.copy(path.join(__dirname, '..', 'crust'), path.join('.', 'crust'))
            .then(() => {
                console.log(chalk.yellow(`Mobilizing crust… :${chalk.blue('success.')}`));

            }).catch((err) => {
                if (err)
                    return  console.error(chalk.red('Copying crust failed', err));
            })

    );

    return Promise.all(promises)
        .then(() => {
            fsp.move(path.join('.', 'crust', 'gulpfile.js'), path.join('.', 'gulpfile.js'))
                .then(() => {
                    console.log(chalk.yellow(`Server setup… :${chalk.blue('complete.')}`));
                }).catch((err) => {
                    if (err) 
                        return console.error(chalk.red('Failed. Gulpfile unavailable.', err));
                });

        }).then(() => {
            const osHomedir = require('os-homedir');
            const arc = require('arc-bookiza');
            const location = path.join(osHomedir(), '.', '.bookizarc');

            let promises = [];

            promises.push(arc.read(location));

            promises.push(fsp.readJson(path.join('.', 'crust', 'package.json')));

            return Promise.all(promises)
                .then((values) => {

                    let bookizArc = JSON.parse(values[0]);
                    let packageJson = values[1];

                    packageJson.name = projectname;
                    packageJson.author = `${bookizArc.username} <${bookizArc.email}> (https://bubbl.in/${bookizArc.username})`;
                    packageJson.homepage = `https://bubbl.in/${bookizArc.username}`;
                    packageJson.description = `Superbook ${projectname} by ${bookizArc.username}`;

                    fsp.writeFile(path.join('.', 'package.json'), JSON.stringify(packageJson, null, 2))
                        .then(() => {
                            const install = require('spawn-npm-install');

                            install(Object.keys(packageJson.dependencies), { stdio: 'inherit' }, err => {
                                if (err) {
                                    return console.error(chalk.red(`Could\n't install modules:\n${err.message}`));
                                } else {
                                    console.log(chalk.yellow(`Installed npm modules… :${chalk.blue('successfully.')}`));

                                    const git = require('git-bookiza');
                                    git.init();

                                }

                            });

                        }).catch((err) => {
                            if (err) return error('Couldn\'t write package.json', err);
                        });

                    let bookrc = {};

                    [ bookrc.mode = { 'HTML': 'html', 'CSS': 'css', 'JS': 'js', 'HEAD': 'html' } ] = [ bookizArc.mode ];

                    bookrc.name = projectname;

                    bookrc.type = templateName;

                    return bookrc;

                }).then((bookrc) => {
                    fsp.writeFile(path.join('.', '.bookrc'), JSON.stringify(bookrc, null, 2))
                        .then(() => {
                            console.log(chalk.yellow(`Setting bookrc values… :${chalk.blue('done.')}`));
                        })
                        .catch(err => {
                            if (err) return error('Couldn\'t write .bookrc', err);
                        });
                    return bookrc.mode;

                }).then((mode) => {

                    fsp.mkdirs('manuscript')
                        .then(() => {                  
                            const pulp = require(path.join('..', 'generators', 'addPages.js'));
                            pulp.addPages(1, leafs * 2, mode);

                        }).catch((err) => {
                            if (err)
                                return console.log(chalk.bold.red('Failed to write directory', err));
                        });
                }).catch((err) => {
                    if (err)
                        return console.log(chalk.red('Arcvalues & Package Json unavailable', err));
                }); 

        }).catch((err) => {
            if (err)
                return console.log(chalk.red('Moving crust or template failed:', err));
        });

}

module.exports.create = createProject;
