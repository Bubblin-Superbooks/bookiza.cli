# Bookiza

Quick and beautiful books. *Everywhere*. `Responsive` by default. 

Bookiza is a lightweight framework that cuts down your book writing & publishing time by half. HALF, no less! It's a book "baking tool" implementing some of the best design and development strategies in the world. 

Go ahead, produce delightful books that work everywhere. Like it were an app! 

Visit the [Bookiza Website](http://bookiza.io) for more details.


![alt tag](https://raw.githubusercontent.com/bookiza/bookiza/master/crust/images/bookiza.png)

### Support

Books written using Bookiza are [supported](https://bubbl.in/support) on every major device, tablet and desktop. All it needs is a modern browser and an Internet connection (This will change!).

Here are some [demo books](https://bubbl.in/books) created by our community.

Despite ubiquity our effort with superbooks points mostly to yielding best reading experiences on tablets i.e. iPads(iOS 7+), Kindle 3 (Silk) and Android 5.0+ phablets. Because, well, even though it's great to support desktops, smartphones, TVs and whatnot, the most ideal situation and surface for reading books is the tablet. 

### What you'll need

node > 6.2.1, git-scm, bubblin's `api_key` and a unixy-style shell/terminal.

### Setup

```bash
$ npm install -g bookiza
```

> You'll need to install bookiza and shelljs as global.

Check installation with:

```bash
$ bookiza --version
```

Register client with:

```bash
$ bookiza register or $ b z
```

Provide your Bubblin credentials to connect to its sweet POST API. You're all set!

### Getting started
To bootstrap new project, run:

```bash
$ bookiza new MY-AWESOME-BOOK-NAME -l 12        # Creates project with 12 fresh leafs (24 pages) inside `manuscript/`.
```

`cd` into the project and:

```bash
$ bookiza server                                # Opens http://localhost:4567 on your browser!
```

Open it on your favorite editor (Sublime/Atom) and write away! Once your book is ready (or it has some changes), hit:

```bash
$ bookiza publish
```

Your book will be *POST'ed / PATCH'ed* on Bubblin instantly.


To see full CLI documentation with:

```bash
$ bookiza --help 
```

That's it.

### Templates

Bookiza comes along with several FREE, responsive and scalable [templates](https://github.com/bookiza/templates) so that you don’t have to do the layouts yourself. Feel free to use any to kickstart your book with a template that best presents your story and ensures that your book is responsive and [supported](https://bubbl.in/support) on as many devices as possible.

By default, both Bookiza and Bubblin favor building blocks of web i.e. HTML, CSS & JavaScript. Infact Bubblin accepts only compiled HTML, CSS & JS to render the books live. No preprocessor jugglery!

> We’re accepting new templates for all kinds of longform. Feel free to [fork](https://github.com/bookiza/templates#fork-destination-box) and submit pull requests per following [rules](https://github.com/bookiza/templates#rules) for any kind of book that you may have worked on. 


### Documentation

A quick tutorial on how to write superbooks is [here](https://marvindanig.svbtle.com/how-to-write-superbooks). 

Documentation is available [here](https://bookiza.github.io/docs/) and [here](https://bubbl.in/cover/official-handbook-by-marvin-danig) and [here](https://bubbl.in/cover/bookiza-framework-by-marvin-danig). 

### What is Bookiza?

Bookiza is an open source book writing framework that makes your life easy. Be up and running with a manuscript in seconds and publish some of the best most crazy beautiful books that ever existed.

Books baked with Bookiza use building-blocks of web i.e. HTML, CSS and JavaScript (Yeah, we got JS inside e-books!) so now you can spice up your story with underlying code, dynamic illustrations, data visualizations, interactive graphs, visual explanations and what not. 

Get the whole web inside your book!

Check out our [demo book](http://bubbl.in/cover/the-solar-system-by-marvin-danig) on your iPad, for example.


### Why a framework & not wordprocessor?
We wanted to be able to write any kind of book — comics, scientific journals, magazines, novels, schoolbooks, textbooks - using the awesomeness of web.

Wordprocessors trump the flexibility that is required for books, comics & magazines that artists all over the world can create. That's not surprising because wordprocessors originally were meant for enterprise documentation (bureaucracy?) only. For things like purchase orders, contracts or legalese which has nothing to do with nice and creative books.

We also wanted books to feel native on the new web -- not like websites that pretend to be books. Be one that handles long form correctly and scales across all the devices and desktops out there, *ala* - responsive, adaptive and scalable (with or without touch capability). 

__&#10049; Fun fact: A framework also ensures that we can stick to our existing development toolchain to mint books. 


#### What it's not

__&#10084; Bookiza is not another javascript framework (thankfully) for mobile or app development. It is also not a blogging solution. If you wish to write short-form essays (1-3 pages or so) we recommend you to go for a blog instead. 

At the moment bookiza will bake manuscripts that are at least 4 pages long. Read more about Superbooks on [Bubblin](https://bubbl.in). 


### Obsession

Bookiza is *obsessive* about running editions and quick turnarounds. Using instant edit2publish state of web to the maximum. Our goal is to optimize books on the web, make it friendlier for people to read, write and connect. Provide a flexibility that book writers haven't had for the last twenty years. A framework that decidely leaves behind the old-school idea of downloading-a-lifeless-artifact called ebook that is nothing but a dull file sponsored by an even older lobby group that wants physical books to thrive and remain on top!. 

We want to focus instead on a future where web and books are unified, like a single resource that is easy to access, search and consume anywhere.


#### Features

* [x] Responsive container by default
* [x] Cover on all major devices and browsers
* [x] Support beautiful typography with @font-faces 
* [x] Allow CDN resources for quick load 
* [x] Open once, offline forever without needing to download any artifact
* [x] Modular pages that follow web standards
* [x] Visual explanations with in-page JavaScript
* [x] Full-bleed imagery for fashion/lifestyle journals
* [x] Support for WebGL, CSS3 or other HTML5 experiments. 
* [x] Searchable & indexable content
* [x] Simplicity of `git`
* [x] Push2Deploy with real-time editions


## The library
Books created via Bookiza can be published directly to [bubblin](https://bubbl.in) - our substrate platform for book lovers. Or you can host it on your own website!

Find a selection of *exclusive* and [handpicked books](https://bubbl.in/books) by our community of writers. 
 
## The community

* Follow [@bookiza on Twitter](https://twitter.com/bookiza)
* Have a feature request or find a bug? [Submit an issue](https://github.com/bookiza/bookiza/issues)
* Have a question that's not a feature request or bug report? [Ask on Bookiza Bubblin forum](http://bubblin.uservoice.com/forums/228504-general) 
* Read the [Bubblin Blog](http://medium.com/)


## Authors

Created & maintained by [Marvin Danig](http://twitter.com/marvindanig). 

Pull requests, [issues](https://github.com/bookiza/bookiza/issues), contribution and [donations](https://bubbl.in/donations/new) are very welcome. Feedback is welcome from both developers & designers!

See the list of [contributors](https://github.com/bookiza/bookiza/graphs/contributors).

## Further development

Our motto: "Books should be a first class citizen of the web" -- let web & books be together, like a single unified resource -- both accessible and *open*! 

We're also working on a draft proposal for [spine_url](https://bubblin.github.io/) to bring native support of books on the web -- like single page apps.

### Dependencies

async, superagent, progress, co-prompt, co, path, fs, chalk, commander, string, dateformat, shelljs, os-homedir


### Bookiza Commit Conventions

* [x] PR branches must work everywhere: i.e. should have been tested on all browsers on OSX, Windows & Linux. 
* [x] Commit messages must explain whys & whats. Please lint your JS before submitting your features.
* [x] Provide system related information of the dev machine(OS/Browser/Screen).  

### Up next

* Introduce preprocessors inside page generators
* TODO: Consider introducing cover attributes within ambit of JSON. Or not.

### LICENSE

Bookiza is dual licensed under the MIT Open Source license. For more information, see the [LICENSE](https://github.com/bookiza/bookiza/blob/master/MIT-license.txt) in this repository. <TBD>