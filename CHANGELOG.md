## v1.1.0
* Updated dependencies
* Dev: Added Node v18 to CI
* Docs: Updated link to Google search in README

## v1.0.0 - First stable release! 🥳
* Updated dependencies
* Dev: Migrated to ``rollup`` (from ``browserify``)
* Dev: Finished removing Grunt

NB: This had to be published as v1.0.1 due to an issue encountered when publishing to NPM.

## v0.6.0
* Updated terser
* Updated commander
* Benchmarks: Replaced references to ``html-minifier`` with ``minhtml``
* Documentation: Replaced references to ``html-minifier`` with ``minhtml``
* Changelog: Reordered items in reverse chronological order
* Updated ansi-regex to fix a security vulnerability warning
* Documentation: Added a Code of Conduct
* Documentation: Added contributing guidelines

## v0.5.2
* The terser update had broken the CLI and has now been fixed.


## v0.5.1
* Just updated this changelog which I forgot about when releasing v0.5.0.

## v0.5.0
* BREAKING: Updated the terser package - From now on, minify() will be async.
* The license is now shipped with this package.
* The CLI now outputs a help message if no argument has been specified.
* `meter` and `output` tags are now treated as inline tags.
* Mustache templates are now officially supported.
* Updated the clean-css package


## v0.4.0
* BREAKING: Updated the clean-css package to latest - From now on, quotes inside CSS ``url()`` will not be stripped. 

## v0.3.0
* HOTFIX: Fixed the CLI which got broken due to updating the ``commander`` package in v0.1.0
* Dev: Migrated ESLint and Terser-related things away from Grunt
* Dev: Dropped the ``isNodejsVersionSupported`` function defined in Grunt configuration


## v0.2.0
* BREAKING: Dropped support for Node.JS version 8.x
* Updated dependencies that have been waiting on dropping support for Node.JS version 8.x
* Added support for Node.JS version 16.x
* Created this changelog
* Updated README and examples which were saying ``html-minifier-terser`` to reflect package rename.

## v0.1.0
* BREAKING: Dropped support for Node.JS version 6.x
* Updated dependencies with security vulnerabilities
* Updated most other dependencies
* Updated package.json 
* Updated README
