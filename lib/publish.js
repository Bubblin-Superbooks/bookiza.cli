/*
# == Schema Information
#
# Table name: books
#
#  title             :string(255)
#  status            :string(255)      default("draft")
#  price_cents       :bigint
#  page_marker       :integer
#  commission        :integer
#  has_page_numbers  :boolean          default(FALSE)
#  front             :string
#  support           :string(160)
#  punchline         :string(160)
#  summary           :text
#  author_detail     :text
#  colophon          :text
#  table_of_contents :text
#  category          :string           default("")
#  language          :string
#  publisher         :string
#  seller            :string
#  edition           :string
#  layout            :string
#
*/
import path from 'path';
import chalk from 'chalk';
import request from 'superagent';
import os from 'os';
import fs from 'fs';
import jsonfile from 'jsonfile';
import read from 'arc-bookiza';

import bookLength from '../lib/bookLength.js';

export default function publish(options) {
  function requestBookId(systemArc, bookrc, token = systemArc.token) {
    if (token === undefined) {
      console.log(chalk.red('Cannot proceed without the Bubblin api token.'));
      return;
    }

    // const url = systemArc.urls.baseURL;
    const url = 'http://127.0.0.1:3000/api/books/';
    const method = 'post';

    request[method](url)
      .send()
      .set('Accept', 'application/json')
      .set('Accept', 'application/bookiza.bubblin.v1')
      .set('Authorization', `Token token=${token}`)
      .end((err, res) => {
        if (!err && res.ok && res.body.status === 201 && res.body.id !== null) {
          bookrc.book_id = res.body.id;
          fs.writeFileSync('.bookrc', JSON.stringify(bookrc, null, 2));
          patchBook(systemArc, bookrc, token);
        } else {
          let errorMessage;
          if (res && res.body.status === 401) {
            errorMessage = 'Authentication failed! Bad username/password.';
          } else if (res && res.body.status === 403) {
            errorMessage = 'Submission unauthorized.';
          } else {
            errorMessage = err;
          }
          console.log(chalk.red(errorMessage));
          process.exit(1);
        }
      });
  }

  function patchBook(bookizArc, bookrc, token = bookizArc.token) {
    const book = {};

    book.title = bookrc.name || 'Untitled';
    book.has_page_numbers = bookrc.has_page_numbers || 'false';
    book.status = bookrc.status || 'draft'; /* Required for automated publishing only. */
    book.category = bookrc.category || 'fiction';
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

    /* TODO: Remove completely.
     * Nested attributes for cover page.
    */

    let toc = '';
    if (fs.existsSync(path.join('.', 'cover', 'toc.html'))) {
      toc = fs.readFileSync(path.join('.', 'cover', 'toc.html'), 'utf-8').toString();
    }

    let summary = '';
    if (fs.existsSync(path.join('.', 'cover', 'summary.html'))) {
      summary = fs.readFileSync(path.join('.', 'cover', 'summary.html'), 'utf-8').toString();
    }

    if (Object.prototype.hasOwnProperty.call(bookrc, 'cover')) {
      book.punchline = bookrc.cover.punchline || '';
      book.author_detail = bookrc.cover.author_detail || '';
      book.colophon = bookrc.cover.colophon || '';
      book.language = bookrc.language || 'en';
      book.table_of_contents = toc || bookrc.cover.toc || '';
      book.summary = summary || bookrc.cover.summary || '';
    } else {
      book.punchline = bookrc.punchline || '';
      book.author_detail = bookrc.author_detail || '';
      book.colophon = bookrc.colophon || '';
      book.language = bookrc.language || 'en';
      book.table_of_contents = toc || bookrc.toc || '';
      book.summary = summary || bookrc.summary || '';
    }

    book.tag_list = bookrc.tag_list || [];
    book.category = bookrc.category || '';
    book.layout = bookrc.layout || '';

    const length = bookLength();

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

      // const url = bookizArc.urls.baseURL + book.id;
      const url = `http://127.0.0.1:3000/api/books/${book.id}`;
      const method = 'patch';

      request[method](url)
        .send(encodeURI(JSON.stringify(bookJson)))
        .set('Accept', 'application/json')
        .set('Accept', 'application/bookiza.bubblin.v1')
        .set('Authorization', `Token token=${token}`)
        .set('gzip', 'true')
        .end((err, res) => {
          process.stdout.write(chalk.bold.blue('﹢'));
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
        console.log(chalk.bold.yellow('Next step: Login into your Bubblin Account and review the contents. 🔥'));
      }
    }
  }

  function initializeBookPress(systemArc) {
    jsonfile.readFile('.bookrc', (err, bookrc) => { // Project Arc
      if (err) {
        throw new Error('Couldn\'t read the project arc: .bookrc.');
      }
      if (!(Object.prototype.hasOwnProperty.call(bookrc, 'book_id'))) {
        requestBookId(systemArc, bookrc, options.token);
      } else {
        patchBook(systemArc, bookrc, options.token);
      }
    });
  }

  const osHomeDir = os.homedir();
  const location = path.join(osHomeDir, '.', '.bookizarc');

  read(location)
    .then((data) => {
      const systemArc = JSON.parse(data); // System Arc.
      if (systemArc.token === '') {
        throw new Error('Arc (system) token not found!');
      }
      initializeBookPress(systemArc);
    }).catch((err) => {
      console.log(chalk.bold.red('Unregistered client'));
      console.log(chalk.bold.cyan('Try $ bookiza register --help'));
      console.log(err);
    });
}
