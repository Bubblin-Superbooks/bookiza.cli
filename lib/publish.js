import path from 'path';
import manuscript from 'book-length';
import chalk from 'chalk';
import request from 'superagent';
import os from 'os';
import fs from 'fs';
import jsonfile from 'jsonfile';
import read from 'arc-bookiza';

export default function publish(options) {
  // TODO: Get cover attributes up here.

  'use strong';

  const osHomeDir = os.homedir();
  // const manuscript = require('book-length')
  // const arc = require('arc-bookiza')

  const location = path.join(osHomeDir, '.', '.bookizarc');

  read(location)
    .then((data) => {
      const bookizArc = JSON.parse(data); // Arc object
      if (bookizArc.token === '') {
        throw new Error('BookizArc.token unavailable!');
      }
      initializeBookPress(bookizArc);
    })
    .catch((err) => {
      console.log(chalk.bold.red('Unregistered client'));
      console.log(chalk.bold.cyan('Try $ bookiza register --help'));
      console.log(err);
    });

  function initializeBookPress(bookizArc) {
    const file = '.bookrc';

    jsonfile.readFile(file, (err, bookrc) => {
      if (err) {
        throw new Error('Couldn\'t read the arc.');
      }
      if (!(bookrc.hasOwnProperty('book_id'))) {
        requestBookId(bookizArc, bookrc, options.token);
      } else {
        patchBook(bookizArc, bookrc, options.token);
      }
    });
  }

  function requestBookId(bookizArc, bookrc, token = bookizArc.token) {
    if (token === undefined) {
      console.log(chalk.red('Cannot proceed without API_token'));
      return;
    }

    const url = bookizArc.urls.baseURL;
    const method = 'post';

    request[method](url)
      .send()
      .set('Accept', 'application/json')
      .set('Accept', 'application/bookiza.bubblin.v2')
      .set('Authorization', `Token token=${token}`)
      .end((err, res) => {
        if (!err && res.ok && res.body.status === 201 && res.body.id !== null) {
          bookrc.book_id = res.body.id;
          fs.writeFileSync('.bookrc', JSON.stringify(bookrc, null, 2));
          patchBook(bookizArc, bookrc, token);
        } else {
          let errorMessage;
          if (res && res.body.status === 401) {
            errorMessage = 'Authentication failed! Bad username/password?';
          } else if (res.body.status === 403) {
            errorMessage = 'Submission unauthorized!';
          } else {
            errorMessage = res.text;
          }
          console.error(chalk.red(errorMessage));
          process.exit(1);
        }
      });
  }

  function patchBook(bookizArc, bookrc, token = bookizArc.token) {
    const book = {};

    book.title = bookrc.name || 'Untitled';
    book.has_page_numbers = bookrc.has_page_numbers || 'false';
    book.status = bookrc.status || 'draft'; /* Required for automated publishing only. */
    book.id = bookrc.book_id;

    /*
     * Nested attributes for layout template.
    */

    const COMPONENTS = [
      { name: 'HEAD', path: 'head.html' },
      { name: 'HTML', path: 'body.html' },
      { name: 'CSS', path: 'style.css' },
      { name: 'JS', path: 'script.js' },
    ];

    const template = {};

    for (const templateIndex in COMPONENTS) {
      const templateComponentPath = path.join('build', 'templates', COMPONENTS[templateIndex].path);
      if (fs.existsSync(templateComponentPath)) {
        template[COMPONENTS[templateIndex].name] = fs.readFileSync(templateComponentPath, 'utf-8').toString();
      }
    }

    book.template_attributes = template;

    /*
     * Nested attributes for cover page.
    */
    const cover = {};

    let toc = '';
    if (fs.existsSync(path.join('.', 'cover', 'toc.html'))) {
      toc = fs.readFileSync(path.join('.', 'cover', 'toc.html'), 'utf-8').toString();
    }

    let synopsis = '';
    if (fs.existsSync(path.join('.', 'cover', 'synopsis.html'))) {
      synopsis = fs.readFileSync(path.join('.', 'cover', 'synopsis.html'), 'utf-8').toString();
    }

    if (bookrc.hasOwnProperty('cover')) {
      cover.punchline = bookrc.cover.punchline || '';
      cover.toc = toc || bookrc.cover.toc || '';
      cover.author_detail = bookrc.cover.author_detail || '';
      cover.colophon = bookrc.cover.colophon || '';
      cover.synopsis = synopsis || bookrc.cover.synopsis || '';
    }

    book.cover_attributes = cover;

    const length = manuscript.length();

    let pages = []; // Array of Page Objects

    const PAGES_CHUNK_SIZE = 5000;

    let batchStart = 1;
    let batchEnd = length < PAGES_CHUNK_SIZE ? length : PAGES_CHUNK_SIZE;

    const requestStatus = [];

    do {
      for (let pageNo = batchStart; pageNo <= batchEnd; pageNo++) {
        const page = {};

        page.book_id = book.id;

        page.page_no = pageNo;
        for (const index in COMPONENTS) {
          const componentPath = path.join('build', 'manuscript', `page-${pageNo}`, COMPONENTS[index].path);
          if (fs.existsSync(componentPath)) {
            page[COMPONENTS[index].name] = fs.readFileSync(componentPath, 'utf-8').toString();
          }
        }
        pages.push(page);
      }

      book.pages_attributes = pages;

      const bookJson = {};

      bookJson.book = book;
      bookJson.length = length;

      const url = bookizArc.urls.baseURL + book.id;
      const method = 'patch';

      request[method](url)
        .send(encodeURI(JSON.stringify(bookJson)))
        .set('Accept', 'application/json')
        .set('Accept', 'application/bookiza.bubblin.v2')
        .set('Authorization', `Token token=${token}`)
        .set('gzip', 'true')
        .end((err, res) => {
          process.stdout.write(chalk.bold.blue('🌟'));
          requestStatus.push(1);
          if (batchStart > length && batchEnd === length) {
            printComplete(res);
          }
          if (!(!err && res.ok && res.body.status === 200)) {
            let errorMessage;
            if (res && res.body.status === 401) {
              errorMessage = 'Authentication failed! Bad username/password?';
            } else if (res.body.status === 403) {
              errorMessage = 'Submission unauthorized!';
            } else {
              errorMessage = res.text;
            }
            console.error(chalk.red(errorMessage));
            process.exit(1);
          }
        });

      batchStart = batchEnd + 1;
      batchEnd = (batchEnd + PAGES_CHUNK_SIZE) > length ? length : (batchEnd + PAGES_CHUNK_SIZE);

      pages = [];
    } while (batchStart <= length);

    function float2int(value) {
      return value | 0;
    }

    function printComplete(response) {
      if (requestStatus.every((elem) => elem === 1) && requestStatus.length === float2int(length / PAGES_CHUNK_SIZE) + 1) {
        bookrc.book_url = response.body.url;
        fs.writeFileSync('.bookrc', JSON.stringify(bookrc, null, 2));

        console.log(chalk.bold.cyan(' Success [100%]. Manuscript was uploaded (patched) on https://bubblin.io successfully.'));
        console.log(chalk.bold.yellow('Next step: Login into your Bubblin Account to review the available edition. 🔥'));
      }
    }
  }
}
