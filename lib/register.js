import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import co from 'co';
import prompt from 'co-prompt';
import os from 'os';
import request from 'superagent';
import read from 'arc-bookiza';
import { fileURLToPath } from 'url';

export default async function register(options) {
  const osHomeDir = os.homedir();

  let { username } = options;
  let { password } = options;

  co(function* () {
    if (username === undefined) {
      username = yield prompt('username: ');
    }
    if (password === undefined) {
      password = yield prompt.password('password: ');
    }
  }).then(() => {
    // Code smell: Try using Promise.all instead.

    // ESM doesn't have dirname : https://github.com/nodejs/help/issues/2907#issuecomment-757446568
    // eslint-disable-next-line no-underscore-dangle
    const __filename = fileURLToPath(import.meta.url);
    // eslint-disable-next-line no-underscore-dangle
    const __dirname = path.dirname(__filename);
    const location = path.join(__dirname, '..', '.bookizarc');

    read(location)
      .then((data) => {
        const bookizArc = JSON.parse(data); // open the arc object

        const url = bookizArc.urls.registrationURL;
        const method = 'post';

        // Request token.
        request[method](url)
          .send()
          .auth(username, password)
          .set('Accept', 'application/json')
          .end((err, res) => {
            if (!err && res.ok) {
              bookizArc.token = res.body.key;
              bookizArc.username = res.body.username;
              bookizArc.email = res.body.email;

              fs.writeFileSync(path.join(osHomeDir, '.', '.bookizarc'), JSON.stringify(bookizArc, null, 2));

              console.log(chalk.bold.cyan('Registration successful'));
              process.exit(0);
            }

            let errorMessage;

            if (res && res.status === 401) {
              errorMessage = 'Authentication failed! Bad username/password?';
            } else if (err) {
              errorMessage = err;
            } else {
              errorMessage = res.text;
            }
            console.error(chalk.red('Something went wrong: Registration Request', errorMessage));
            process.exit(1);
          });
      }).catch((err) => {
        console.error(`Couldn't read BookizArc: ${err}`);
      });
  }).catch((err) => {
    console.error(err);
  });
}
