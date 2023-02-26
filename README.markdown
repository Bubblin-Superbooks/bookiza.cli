# Bookiza

> This is the first part of the **Bookiza Abelone** library.

Publish and distribute your books via the web. 🥳

Bookiza is a _book-making_ tool for the web. It is a lightweight javascript framework with a browser shim that lets you publish scalable and deeply formatted long-form works using traditional publishing values and modern web principles that sit above-the-fold.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](https://commitizen.github.io/cz-cli/)
[![npm](https://img.shields.io/npm/dt/bookiza.svg?maxAge=2592000)](https://www.npmjs.com/package/bookiza)
![alt tag](https://raw.githubusercontent.com/bookiza/bookiza/master/assets/images/bookiza.png)

# Advantages

Print delightful digital books on the web that reach everyone, and not just those who own specialized expensive hardware to read your work.

> Visit the [Bookiza Website](https://bookiza.io) for more details.

### Format

Bookiza uses the [Superbook format](https://bubblin.io/docs/format) to control the editions and compile your manuscript into a production-ready (SPA-like) book.

### Support

Books created using **Bookiza Abelone** are supported on every major device, tablet, and desktop sporting a modern browser and an Internet connection.

### Examples

Visit [Bubblin Superbooks](https://bubblin.io/) to view Books of different types with varying layouts, and features like intrinsic typesetting, line-tracking, and responsivity.

### Recommended hardware

Despite ubiquity, we recommend tablets (any brand) in landscape mode to best experience our books.

### Documentation

- Documentation is available [here](https://bubblin.io/bookiza/docs/).
- A free book on [The Bookiza Framework](https://bubblin.io/cover/bookiza-framework-by-marvin-danig).

A quick primer on the Superbook format is available [here](https://bubblin.io/docs/concept).

### What you'll need

node > 18.3.0, git-scm, an `api_key` from `https://bubblin.io` and a unixy-style bash.

### Setup

```bash
$ npm install -g bookiza
```

> You'll need to install bookiza and shelljs as global.

Check installation with:

```bash
$ bookiza --version
```

> `bookiza` is shortened to alphabet `b` on your terminal as CLI invoker. This is useful when you're creating a relatively longer body of text and it becomes increasingly painful to type full form commands into the abyss.

Next, register Bookiza client with:

```bash
$ bookiza register or $ b z
```

Provide your Bubblin credentials to connect to its sweet POST API. You're all set!

To check:

```bash
$ bookiza whoami or $ b w
```

### Getting started

To bootstrap new project, run:

```bash
$ bookiza new my-awesome-new-book --leafs 40 --template novella
# Creates a project with 40 fresh leafs (80 pages) inside the `manuscript/` folder and applies the responsive `novella` template on it with initial defaults.
```

`cd` into the project and:

```bash
$ bookiza server                  # Open https://localhost:4567 on your browser!
```

Full vocabulary is available with:

```bash
$ bookiza --help
```

That's it.

### Layout Templates

Bookiza comes along with several FREE, responsive and scalable [templates](https://github.com/bookiza/templates) so that you don’t have to do the layouts yourself.

Feel free to fork and build new templates to kickstart your work in any way you like.

> We accept new templates for different kinds of books and formatting options. PRs and new ideas are welcome.

# Advanced Configuration

Bookiza and Bubblin default to using only the building blocks of the web i.e. HTML, CSS & JavaScript. Bubblin maintains only the head version of your clean and compiled manuscript to render your work. No history is maintained at Bubblin at this time.

## Preprocessors

Bookiza lets you compose your manuscript with any preprocessor you like. There are two ways to configure Bookiza so as to cater to your needs depending on the type of content on your book.

#### ArcBookiza or just the Arc

Configuring Bookiza is very simple and its editing modes can be easily customized to suit your needs by setting the `mode` according to your liking.

When you register the Bookiza client (with `$ bookiza register`) in your local, it will automatically create and configure the following runcom file `.bookizarc` at the root of your machine. You can set the processing modes of Bookiza on this `arc` file and Bookiza will automatically pick up the desired processing mode for your manuscripts.

```
# $ vi .bookizarc

{
  // ...
  "mode": {
    "HTML": "html",   # markdown, haml, or pug etc.
    "CSS": "css",
    "JS": "js",
    "HEAD": "html"
  },
  // ...

}

```

See [full list](https://bookiza.io/docs) of templating engines & preprocessors that are currently available.

#### ArcBook or just the book

Editing mode can also be set on per book basis using the `.bookrc` configuration at the root of your project:

```
# $ vi .bookrc

{
  // ...
  "mode": {
    "HTML": "html",
    "CSS": "css",
    "JS": "js",
    "HEAD": "html"
  }
  // ...
}

```

In case of conflict between modes on `.bookrc` and `.bookizarc` the book level configuration i.e. via `.bookrc` shall prevail.

### PR Conventions

- [x] PR branches must work everywhere: i.e. should have been tested manually on all browsers and all operating systems i.e. MacOS, Windows, and at least one distribution of Linux.
- [x] Commit messages must be self explanatory. Please do pepper your submissions with comments!
- [x] Provide system related information of the dev machine (OS/Browser/Screen) you developed your PR on.

### LICENSE

TBD. _UNLICENSED_
