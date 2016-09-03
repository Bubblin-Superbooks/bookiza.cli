# Bookiza Change Log
All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).


### [Unreleased] Added 2016-06-11

### [Unreleased] Removed 2016-06-11

### [Unreleased] Reverted 2016-06-11

---

### [Unreleased] Added 2016-06-10
- Added per batch request update and process_complete when last request returns `ok`.
- PAGES_CHUNK_SIZE
- Breaking Changes: Moved "book_id" to `.bookrc` instead of `package.json`, renamed `template.html`, `template.css` and `template.js` to `body.html`, `style.css` and `script.js` respectively for uniformity. Moved book.title to `.bookrc`. 

### [Unreleased] Reverted 2016-06-10 
- Revert to .bookrc instead of book.json because book.json sounds like actual book. See `lib/manager.js`

### [Unreleased] Removed 2016-06-10
- ProgressBar removed because unused

---

### [Unreleased] Added 2016-06-9
- ES2015 for client registration. See `lib/register` 
- Return Promise object for .bookizarc file I/O. 
- "Arc Bookiza": "0.0.13",  https://www.npmjs.com/package/arc-bookiza

--- 

### [0.0.22] Added 2016-06-3
- Replace .bookrc with book.json for book-level mode & book_id information.
- "npm-update-module": "1.0.4" - See `update` method in `bin/bin.js`.


## 0.0.1 - 0.0.21 2016-05-31
### Added
- This CHANGELOG file to hopefully serve as an evolving example of a standardized open source project CHANGELOG.
- CNAME file to enable GitHub Pages custom domain
- README now contains answers to common questions about CHANGELOGs
- Good examples and basic guidelines, including proper date formatting.
- Counter-examples: "What makes a unicorn cry?"
- Framework website up!